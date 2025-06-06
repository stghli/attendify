
import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ScannerCamera from "./qr-scanner/ScannerCamera";
import { ScanHistoryItem } from "./qr-scanner/types";

const QrScanner: React.FC = () => {
  const { students, teachers, recordAttendance } = useData();
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanHistoryItem | null>(null);

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
        
        // Record attendance with time-in by default
        recordAttendance(userId, role as "student" | "teacher", "time-in");
        
        // Create new scan history item
        const newScanItem: ScanHistoryItem = {
          userId,
          name: user.name,
          role: role as "student" | "teacher",
          action: "time-in",
          timestamp: new Date()
        };
        
        // Update last scan info
        setLastScan(newScanItem);
        
        // Stop scanning temporarily 
        setScanning(false);
        
        // Auto restart scanning after 2 seconds
        setTimeout(() => {
          setScanning(true);
        }, 2000);
        
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

  // Auto-start scanning on mount
  React.useEffect(() => {
    setScanning(true);
  }, []);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {scanning ? (
          <ScannerCamera onScan={handleScan} onError={handleError} />
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white border border-white/20"
          >
            {lastScan && (
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-400">✓ Checked In</div>
                <div className="text-xl">{lastScan.name}</div>
                <div className="text-sm text-white/70 capitalize">{lastScan.role}</div>
                <div className="text-xs text-white/60">
                  {lastScan.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QrScanner;
