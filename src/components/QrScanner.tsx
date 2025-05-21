
import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Student, Teacher } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// This is a mock QR scanner component
// In a real application, you would integrate with a library like react-qr-reader
const QrScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [recentScan, setRecentScan] = useState<{
    name: string;
    role: "student" | "teacher";
    action: "time-in" | "time-out";
  } | null>(null);
  
  const { students, teachers, recordAttendance } = useData();

  // Mock scanner that randomly picks a user for demo purposes
  const startScanning = () => {
    setScanning(true);
    setScanResult(null);
    
    setTimeout(() => {
      // For demo, randomly select a student or teacher to simulate scanning
      const allUsers = [...students, ...teachers];
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const qrData = randomUser.id;
      
      setScanResult(qrData);
      setScanning(false);
    }, 2000); // Simulate 2-second scan
  };

  useEffect(() => {
    if (scanResult) {
      processQrCode(scanResult);
    }
  }, [scanResult]);

  const processQrCode = (qrCode: string) => {
    // Check if it's a student or teacher
    const student = students.find((s) => s.id === qrCode);
    const teacher = teachers.find((t) => t.id === qrCode);
    
    if (student) {
      // Check if the last action was time-in or time-out to toggle
      const action: "time-in" | "time-out" = "time-in"; 
      
      recordAttendance(student.id, "student", action);
      setRecentScan({
        name: student.name,
        role: "student",
        action,
      });
    } else if (teacher) {
      // Check if the last action was time-in or time-out to toggle
      const action: "time-in" | "time-out" = "time-in"; 
      
      recordAttendance(teacher.id, "teacher", action);
      setRecentScan({
        name: teacher.name,
        role: "teacher",
        action,
      });
    } else {
      toast.error("Invalid QR code");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">QR Code Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="qr-scanner-container bg-gray-200 aspect-video mb-6">
          {scanning ? (
            <>
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="scanner-overlay">
                  <div className="scanner-target"></div>
                </div>
                <span className="animate-pulse text-white text-lg">Scanning...</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-gray-600 mb-2">Camera ready</p>
              <Button onClick={startScanning}>
                Start Scanning
              </Button>
            </div>
          )}
        </div>

        {recentScan && (
          <div className="border rounded-md p-4 bg-green-50">
            <h3 className="text-lg font-medium text-green-700 mb-1">Scan Successful</h3>
            <p className="text-sm">
              {recentScan.name} ({recentScan.role}) has been marked as{" "}
              {recentScan.action === "time-in" ? "present" : "absent"}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QrScanner;
