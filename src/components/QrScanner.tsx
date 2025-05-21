
import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Clock } from "lucide-react";
import { toast } from "sonner";

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
        
        // Show success message
        toast.success(`${user.name} checked in successfully`);
        
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
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <div className="bg-primary/10 p-4 text-center font-semibold border-b">
        {scanning ? "Scan QR Code to Record Attendance" : "QR Scanner"}
      </div>
      <CardContent className="p-4">
        {scanning ? (
          <div className="aspect-square max-h-[350px] overflow-hidden rounded-md border">
            <QrReader
              constraints={{ facingMode: "environment" }}
              scanDelay={500}
              onResult={handleScan}
              videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
              containerStyle={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {lastScan && (
              <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted/50 rounded-lg animate-fade-in">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  lastScan.action === 'time-in' ? 'bg-green-100' : 'bg-amber-100'
                }`}>
                  {lastScan.action === 'time-in' ? 
                    <UserCheck className="h-6 w-6 text-green-600" /> : 
                    <UserX className="h-6 w-6 text-amber-600" />
                  }
                </div>
                <h3 className="font-medium text-lg">{lastScan.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={lastScan.role === 'student' ? 'outline' : 'secondary'}>
                    {lastScan.role.charAt(0).toUpperCase() + lastScan.role.slice(1)}
                  </Badge>
                  <Badge variant={lastScan.action === 'time-in' ? 'default' : 'outline'}>
                    {lastScan.action === 'time-in' ? 'Checked In' : 'Checked Out'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {lastScan.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => setScanning(true)} 
              className="w-full"
              variant="default"
            >
              {lastScan ? "Scan Another QR Code" : "Start Scanning"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QrScanner;
