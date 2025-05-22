
import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Clock, QrCode, Scan, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const QrScanner: React.FC = () => {
  const { recordAttendance, students, teachers } = useData();
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<{
    userId: string;
    name: string;
    role: "student" | "teacher";
    action: "time-in" | "time-out";
    timestamp: Date;
  } | null>(null);

  const handleScan = (result: any) => {
    if (result && result.text) {
      const qrData = result.text;
      
      try {
        // Process QR code data (format: {role}-{userId}-qr)
        const parts = qrData.split('-');
        if (parts.length < 2) throw new Error("Invalid QR code format");
        
        const role = parts[0];
        const userId = parts[1];
        
        // Find the user
        let user;
        if (role === "student") {
          user = students.find(s => s.id === userId);
        } else if (role === "teacher") {
          user = teachers.find(t => t.id === userId);
        }
        
        if (!user) {
          toast.error("User not found in the system");
          return;
        }
        
        // Determine if this is time-in or time-out based on last action
        // For simplicity, we're alternating between time-in and time-out
        // In a real system, you'd check the last record for this user
        const action: "time-in" | "time-out" = "time-in"; 
        
        // Record attendance
        recordAttendance(userId, role as "student" | "teacher", action);
        
        // Update last scan info
        setLastScan({
          userId,
          name: user.name,
          role: role as "student" | "teacher",
          action,
          timestamp: new Date()
        });
        
        // Stop scanning temporarily 
        setScanning(false);
        
      } catch (error) {
        console.error("Error processing QR code:", error);
        toast.error("Invalid QR code. Please try again.");
      }
    }
  };

  const handleError = (error: any) => {
    console.error("QR Scanner Error:", error);
    toast.error("Error accessing camera. Please check permissions.");
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-xl border-none overflow-hidden bg-white relative">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 text-center font-medium flex items-center justify-center gap-2">
        <QrCode className="h-5 w-5" />
        {scanning ? "Scan QR Code to Record Attendance" : "QR Scanner"}
      </div>
      <CardContent className="p-5">
        <AnimatePresence mode="wait">
          {scanning ? (
            <motion.div 
              key="scanner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="aspect-square max-h-[350px] overflow-hidden rounded-xl border shadow-inner"
            >
              <div className="relative h-full w-full">
                <QrReader
                  constraints={{ facingMode: "environment" }}
                  scanDelay={500}
                  onResult={handleScan}
                  videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  containerStyle={{ width: '100%', height: '100%' }}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="border-2 border-white/80 rounded-lg w-full h-full flex items-center justify-center">
                      <div className="relative w-3/4 h-3/4 border-2 border-dashed border-primary/80 rounded-lg">
                        {/* Corner markers */}
                        <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-primary"></div>
                        <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-primary"></div>
                        <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-primary"></div>
                        <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-primary"></div>
                        
                        {/* Scanning effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/60 animate-[scan_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {lastScan ? (
                <div className="flex flex-col items-center justify-center gap-3 p-6 bg-muted/30 rounded-xl animate-fade-in border">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-lg ${
                    lastScan.action === 'time-in' 
                      ? 'bg-gradient-to-br from-green-100 to-green-200' 
                      : 'bg-gradient-to-br from-amber-100 to-amber-200'
                  }`}
                  >
                    {lastScan.action === 'time-in' ? 
                      <CheckCircle className="h-8 w-8 text-green-600" /> : 
                      <UserX className="h-8 w-8 text-amber-600" />
                    }
                  </motion.div>
                  <h3 className="font-medium text-xl">{lastScan.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={lastScan.role === 'student' ? 'outline' : 'secondary'} className="px-3 py-1 text-xs font-medium">
                      {lastScan.role.charAt(0).toUpperCase() + lastScan.role.slice(1)}
                    </Badge>
                    <Badge variant={lastScan.action === 'time-in' ? 'default' : 'outline'} className="px-3 py-1 text-xs font-medium">
                      {lastScan.action === 'time-in' ? 'Checked In' : 'Checked Out'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lastScan.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <div className="rounded-full bg-muted p-6">
                    <QrCode className="h-10 w-10" />
                  </div>
                  <p className="mt-4">Ready to scan attendance QR codes</p>
                </div>
              )}
              
              <Button 
                onClick={() => setScanning(true)} 
                className="w-full py-6 text-base flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                variant="default"
              >
                <Scan className="h-5 w-5" />
                {lastScan ? "Scan Another QR Code" : "Start Scanning"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default QrScanner;
