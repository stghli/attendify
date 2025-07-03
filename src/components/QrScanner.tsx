
import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useAttendance } from "@/context/attendance/AttendanceContext";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ScannerCamera from "./qr-scanner/ScannerCamera";
import { ScanHistoryItem } from "./qr-scanner/types";
import { Clock, AlertTriangle } from "lucide-react";

const QrScanner: React.FC = () => {
  const { students, teachers } = useData();
  const { recordAttendance, getTimeStatus } = useAttendance();
  const [scanning, setScanning] = useState(true);
  const [lastScan, setLastScan] = useState<ScanHistoryItem | null>(null);
  
  const timeStatus = getTimeStatus();

  const handleScan = (result: any) => {
    if (result && result.text) {
      const qrData = result.text;
      console.log("QR Data scanned:", qrData);
      console.log("Available students:", students);
      console.log("Available teachers:", teachers);

      try {
        // Process QR code data (format: {role}-{userId}-qr or just {role}-{userId})
        const parts = qrData.split('-');
        if (parts.length < 2) throw new Error("Invalid QR code format");
        
        const role = parts[0];
        const userId = parts[1];
        console.log("Looking for user with role:", role, "and ID:", userId);

        // Find the user
        let user;
        if (role === "student") {
          user = students.find(s => s.id === userId);
          console.log("Found student:", user);
        } else if (role === "teacher") {
          user = teachers.find(t => t.id === userId);
          console.log("Found teacher:", user);
        }

        if (!user) {
          console.log("User not found. Available users:", { students, teachers });
          toast.error("User not found in the system");
          return;
        }

        // Determine action based on time
        let action: "time-in" | "time-out";
        if (timeStatus.canCheckIn) {
          action = "time-in";
        } else if (timeStatus.canCheckOut) {
          action = "time-out";
        } else {
          toast.error(`Attendance not available. ${timeStatus.message}`);
          return;
        }

        // Record attendance
        recordAttendance(userId, role as "student" | "teacher", action);

        // Create new scan history item
        const newScanItem: ScanHistoryItem = {
          userId,
          name: user.name,
          role: role as "student" | "teacher",
          action,
          timestamp: new Date()
        };

        // Update last scan info
        setLastScan(newScanItem);

        // Stop scanning temporarily 
        setScanning(false);

        // Auto restart scanning after 3 seconds
        setTimeout(() => {
          setScanning(true);
        }, 3000);

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
    <div className="w-full max-w-sm mx-auto space-y-4">
      <AnimatePresence mode="wait">
        {scanning ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex justify-center"
          >
            <ScannerCamera onScan={handleScan} onError={handleError} />
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white border border-white/20 mx-auto"
          >
            {lastScan && (
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-400">
                  ✓ {lastScan.action === "time-in" ? "Checked In" : "Checked Out"}
                </div>
                <div className="text-xl">{lastScan.name}</div>
                <div className="text-sm text-white/70 capitalize">{lastScan.role}</div>
                <div className="text-xs text-white/60">
                  {lastScan.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {((lastScan.action === "time-in" && timeStatus.isLateCheckIn) || 
                  (lastScan.action === "time-out" && timeStatus.isLateCheckOut)) && (
                  <div className="text-sm text-orange-300 font-medium">
                    ⚠️ {lastScan.action === "time-in" ? "Late Arrival" : "Late Pickup"}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QrScanner;
