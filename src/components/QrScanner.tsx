
import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import QrScannerHeader from "./qr-scanner/QrScannerHeader";
import ActionTabs from "./qr-scanner/ActionTabs";
import ScannerCamera from "./qr-scanner/ScannerCamera";
import LastScanResult from "./qr-scanner/LastScanResult";
import ReadyToScan from "./qr-scanner/ReadyToScan";
import ScannerActions from "./qr-scanner/ScannerActions";
import ScanHistory from "./qr-scanner/ScanHistory";
import { ScanHistoryItem } from "./qr-scanner/types";

const QrScanner: React.FC = () => {
  const { students, teachers, recordAttendance } = useData();
  const [scanning, setScanning] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"time-in" | "time-out">("time-in");
  const [lastScan, setLastScan] = useState<ScanHistoryItem | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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
        
        // Record attendance with the selected action (time-in or time-out)
        recordAttendance(userId, role as "student" | "teacher", selectedAction);
        
        // Create new scan history item
        const newScanItem: ScanHistoryItem = {
          userId,
          name: user.name,
          role: role as "student" | "teacher",
          action: selectedAction,
          timestamp: new Date()
        };
        
        // Update last scan info
        setLastScan(newScanItem);
        
        // Add to scan history (limit to 10 most recent)
        setScanHistory(prev => [newScanItem, ...prev].slice(0, 10));
        
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

  const clearHistory = () => {
    setScanHistory([]);
    toast.info("Scan history cleared");
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-xl border-none overflow-hidden bg-white relative">
      <QrScannerHeader scanning={scanning} />
      <CardContent className="p-5">
        {!scanning && (
          <ActionTabs 
            selectedAction={selectedAction}
            onActionChange={setSelectedAction}
          />
        )}

        <AnimatePresence mode="wait">
          {scanning ? (
            <ScannerCamera onScan={handleScan} onError={handleError} />
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {lastScan ? (
                <LastScanResult lastScan={lastScan} />
              ) : (
                <ReadyToScan selectedAction={selectedAction} />
              )}
              
              <ScannerActions
                lastScan={lastScan}
                showHistory={showHistory}
                onStartScanning={() => setScanning(true)}
                onToggleHistory={() => setShowHistory(!showHistory)}
              />

              <ScanHistory
                showHistory={showHistory}
                scanHistory={scanHistory}
                onClearHistory={clearHistory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default QrScanner;
