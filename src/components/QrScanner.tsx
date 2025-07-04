

import React, { useState, useEffect } from "react";
import { useStudents } from "@/context/students/StudentsContext";
import { useTeachers } from "@/context/teachers/TeachersContext";
import { useAttendance } from "@/context/attendance/AttendanceContext";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ScannerCamera from "./qr-scanner/ScannerCamera";
import { ScanHistoryItem } from "./qr-scanner/types";
import { Clock, AlertTriangle } from "lucide-react";

const QrScanner: React.FC = () => {
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { recordAttendance, getTimeStatus } = useAttendance();
  const [scanning, setScanning] = useState(true);
  const [lastScan, setLastScan] = useState<ScanHistoryItem | null>(null);
  
  const timeStatus = getTimeStatus();

  const handleScan = (result: any) => {
    if (result && result.text) {
      const qrData = result.text;
      console.log("QR Data scanned:", qrData);
      console.log("Syncing with admin data - Students:", students.length, "Teachers:", teachers.length);

      try {
        // Enhanced QR code processing to sync with admin data
        let userId, role, user;

        // Try different QR code formats
        if (qrData.includes('-')) {
          // Format like "student-1-qr" or "teacher-1-qr"
          const parts = qrData.split('-');
          if (parts.length >= 2) {
            role = parts[0];
            userId = parts[1];
          }
        } else {
          // Try to parse as JSON or other formats
          try {
            const parsedData = JSON.parse(qrData);
            role = parsedData.role;
            userId = parsedData.id || parsedData.userId;
          } catch {
            // Simple format - try to extract from plain text
            if (qrData.includes('student')) {
              role = 'student';
              userId = qrData.replace(/[^0-9]/g, '');
            } else if (qrData.includes('teacher')) {
              role = 'teacher';
              userId = qrData.replace(/[^0-9]/g, '');
            }
          }
        }

        console.log("Extracted - Role:", role, "User ID:", userId);

        // Search in admin data (students and teachers contexts)
        if (role === "student") {
          // Search by ID first, then by QR code, then by name similarity
          user = students.find(s => 
            s.id === userId || 
            s.id === `student-${userId}` ||
            s.qrCode === qrData ||
            s.name.toLowerCase().includes(qrData.toLowerCase())
          );
          
          if (!user && userId) {
            // Try to find by partial ID match
            user = students.find(s => s.id.includes(userId));
          }
          
          console.log("Found student in admin data:", user);
        } else if (role === "teacher") {
          // Search by ID first, then by QR code, then by name similarity
          user = teachers.find(t => 
            t.id === userId || 
            t.id === `teacher-${userId}` ||
            t.qrCode === qrData ||
            t.name.toLowerCase().includes(qrData.toLowerCase())
          );
          
          if (!user && userId) {
            // Try to find by partial ID match
            user = teachers.find(t => t.id.includes(userId));
          }
          
          console.log("Found teacher in admin data:", user);
        }

        // If still not found, try broader search across both collections
        if (!user) {
          console.log("Trying broader search across all users...");
          
          // Search students by any matching criteria
          user = students.find(s => 
            qrData.includes(s.id) || 
            s.qrCode?.includes(qrData) ||
            qrData.includes(s.name.toLowerCase()) ||
            s.name.toLowerCase().includes(qrData.toLowerCase())
          );
          
          if (user) {
            role = "student";
            userId = user.id;
            console.log("Found student via broader search:", user);
          } else {
            // Search teachers by any matching criteria
            user = teachers.find(t => 
              qrData.includes(t.id) || 
              t.qrCode?.includes(qrData) ||
              qrData.includes(t.name.toLowerCase()) ||
              t.name.toLowerCase().includes(qrData.toLowerCase())
            );
            
            if (user) {
              role = "teacher";
              userId = user.id;
              console.log("Found teacher via broader search:", user);
            }
          }
        }

        if (!user) {
          console.log("User not found in admin data. QR Data:", qrData);
          console.log("Available students:", students.map(s => ({ id: s.id, name: s.name, qrCode: s.qrCode })));
          console.log("Available teachers:", teachers.map(t => ({ id: t.id, name: t.name, qrCode: t.qrCode })));
          
          toast.error("User not found in admin database", {
            description: "Please ensure the QR code is registered in the system"
          });
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

        // Record attendance with synced admin data
        console.log("Recording attendance for:", { userId: user.id, role, action });
        recordAttendance(user.id, role as "student" | "teacher", action);

        // Create new scan history item
        const newScanItem: ScanHistoryItem = {
          userId: user.id,
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
        toast.error("Invalid QR code format. Please try again.", {
          description: "Ensure the QR code is generated by the admin system"
        });
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
                  Synced with Admin Database ✓
                </div>
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

