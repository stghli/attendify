import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScannerCamera from "./qr-scanner/ScannerCamera";
import ManualInput from "./qr-scanner/ManualInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, CheckCircle, AlertCircle, KeyboardIcon } from "lucide-react";
import { parseQRCodeData } from "@/utils/qrCode";
import { useStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { useRecordAttendance, getTimeStatus } from "@/hooks/useAttendance";
import { toast } from "sonner";

interface ScanResult {
  name: string;
  role: 'student' | 'teacher';
  action: 'time-in' | 'time-out';
  timestamp: string;
  isLate: boolean;
  userId: string;
}

const QrScanner: React.FC = () => {
  const [mode, setMode] = useState<'scanner' | 'manual' | 'result'>('scanner');
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();
  const recordAttendance = useRecordAttendance();
  
  const handleScan = async (result: any) => {
    if (!result) return;
    
    try {
      const qrString = result.getText ? result.getText() : result.text || result;
      const qrData = parseQRCodeData(qrString);
      
      if (!qrData) {
        toast.error("Invalid QR code format");
        return;
      }
      
      // Find user in database
      let user = null;
      let userName = qrData.user_name;
      
      if (qrData.user_role === 'student') {
        user = students.find(s => s.id === qrData.user_id || s.user_id === qrData.user_id);
      } else {
        user = teachers.find(t => t.id === qrData.user_id || t.user_id === qrData.user_id);
      }
      
      if (user) {
        userName = user.name;
      } else if (userName === 'Unknown') {
        toast.error("User not found in database");
        return;
      }
      
      // Determine action based on time
      const timeStatus = getTimeStatus();
      const action: 'time-in' | 'time-out' = timeStatus.suggestedAction || 'time-in';
      const isLate = action === 'time-in' ? timeStatus.isLateCheckIn : timeStatus.isEarlyCheckOut;
      
      // Record attendance
      await recordAttendance.mutateAsync({
        studentId: qrData.user_id,
        studentName: userName,
        notes: '',
      });
      
      // Update UI
      const scanResult: ScanResult = {
        name: userName,
        role: qrData.user_role,
        action,
        timestamp: new Date().toISOString(),
        isLate,
        userId: user?.id || qrData.user_id,
      };
      
      setLastScan(scanResult);
      setMode('result');
      
    } catch (error) {
      console.error("Error processing QR scan:", error);
      toast.error("Failed to process QR code");
    }
  };

  const handleError = (error: any) => {
    console.error("Camera error:", error);
    // Only show toast errors for actual camera permission/access issues
    if (error?.name === 'NotAllowedError' || 
        error?.name === 'NotFoundError' ||
        error?.message?.toLowerCase().includes('permission') ||
        error?.message?.toLowerCase().includes('access') ||
        error?.message?.toLowerCase().includes('denied')) {
      toast.error("Camera access required. Please allow camera permissions.");
    }
  };

  const handleManualInput = async (studentData: { id: string; name: string; student_id: string }) => {
    try {
      // Determine action based on time
      const timeStatus = getTimeStatus();
      const action: 'time-in' | 'time-out' = timeStatus.suggestedAction || 'time-in';
      const isLate = action === 'time-in' ? timeStatus.isLateCheckIn : timeStatus.isEarlyCheckOut;

      // Record attendance using the validated student data
      await recordAttendance.mutateAsync({
        studentId: studentData.id,
        studentName: studentData.name,
        notes: '',
      });

      // Update UI
      const scanResult: ScanResult = {
        name: studentData.name,
        role: 'student',
        action,
        timestamp: new Date().toISOString(),
        isLate,
        userId: studentData.id,
      };

      setLastScan(scanResult);
      setMode('result');
    } catch (error) {
      console.error("Error processing manual input:", error);
      toast.error("Failed to mark attendance");
    }
  };

  const resetScanner = () => {
    setMode('scanner');
    setLastScan(null);
  };

  const showManualInput = () => {
    setMode('manual');
  };

  const backToScanner = () => {
    setMode('scanner');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (studentsLoading || teachersLoading) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading user data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {mode === 'scanner' ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <ScannerCamera onScan={handleScan} onError={handleError} />
            <Button 
              onClick={showManualInput} 
              variant="outline" 
              className="w-full"
            >
              <KeyboardIcon className="h-4 w-4 mr-2" />
              Enter Student ID Manually
            </Button>
          </motion.div>
        ) : mode === 'manual' ? (
          <ManualInput 
            key="manual"
            onSubmit={handleManualInput} 
            onBackToScanner={backToScanner}
          />
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {lastScan && (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      {lastScan.action === 'time-in' ? (
                        <CheckCircle className="h-12 w-12 text-green-500" />
                      ) : (
                        <AlertCircle className="h-12 w-12 text-blue-500" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">{lastScan.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {lastScan.role}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {lastScan.action === 'time-in' ? 'Checked In' : 'Checked Out'} at{' '}
                          {formatTime(lastScan.timestamp)}
                        </span>
                      </div>
                      
                      {lastScan.isLate && (
                        <Badge variant="destructive" className="text-xs">
                          {lastScan.action === 'time-in' ? 'Late Arrival' : 'Early Departure'}
                        </Badge>
                      )}
                    </div>
                    
                    <Button onClick={resetScanner} className="w-full">
                      Scan Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QrScanner;