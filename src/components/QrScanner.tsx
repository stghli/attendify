
import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Clock, QrCode, Scan, CheckCircle, LogIn, LogOut, History } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the scan history item type
interface ScanHistoryItem {
  userId: string;
  name: string;
  role: "student" | "teacher";
  action: "time-in" | "time-out";
  timestamp: Date;
}

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
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 text-center font-medium flex items-center justify-center gap-2">
        <QrCode className="h-5 w-5" />
        {scanning ? "Scan QR Code to Record Attendance" : "QR Scanner"}
      </div>
      <CardContent className="p-5">
        {!scanning && (
          <Tabs 
            defaultValue="time-in" 
            value={selectedAction} 
            onValueChange={(value) => setSelectedAction(value as "time-in" | "time-out")}
            className="w-full mb-5"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="time-in" className="flex items-center gap-1.5">
                <LogIn className="h-4 w-4" />
                Check In
              </TabsTrigger>
              <TabsTrigger value="time-out" className="flex items-center gap-1.5">
                <LogOut className="h-4 w-4" />
                Check Out
              </TabsTrigger>
            </TabsList>
            <TabsContent value="time-in" className="mt-3 text-center text-sm text-muted-foreground">
              Students and teachers will be marked as present
            </TabsContent>
            <TabsContent value="time-out" className="mt-3 text-center text-sm text-muted-foreground">
              Students and teachers will be marked as departed
            </TabsContent>
          </Tabs>
        )}

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
                      <LogIn className="h-8 w-8 text-green-600" /> : 
                      <LogOut className="h-8 w-8 text-amber-600" />
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
                    {selectedAction === "time-in" ? 
                      <LogIn className="h-10 w-10" /> : 
                      <LogOut className="h-10 w-10" />
                    }
                  </div>
                  <p className="mt-4">Ready to scan {selectedAction === 'time-in' ? 'check-in' : 'check-out'} QR codes</p>
                </div>
              )}
              
              <div className="grid gap-3">
                <Button 
                  onClick={() => setScanning(true)} 
                  className="w-full py-6 text-base flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                  variant="default"
                >
                  <Scan className="h-5 w-5" />
                  {lastScan ? "Scan Another QR Code" : "Start Scanning"}
                </Button>
                
                <Button 
                  onClick={() => setShowHistory(!showHistory)} 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  {showHistory ? "Hide Recent Scans" : "Show Recent Scans"}
                </Button>
              </div>

              {/* Recent Scans History */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <div className="bg-muted/80 px-4 py-2.5 flex items-center justify-between">
                        <h3 className="font-medium text-sm flex items-center gap-1.5">
                          <History className="h-3.5 w-3.5" />
                          Recent Scans
                        </h3>
                        <Button 
                          onClick={clearHistory} 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          disabled={scanHistory.length === 0}
                        >
                          Clear
                        </Button>
                      </div>
                      
                      <ScrollArea className="max-h-[200px]">
                        {scanHistory.length > 0 ? (
                          <ul className="divide-y">
                            {scanHistory.map((scan, index) => (
                              <li key={index} className="px-4 py-2.5 flex items-center justify-between hover:bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <div className={`rounded-full p-1.5 ${
                                    scan.action === 'time-in' 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'bg-amber-100 text-amber-600'
                                  }`}>
                                    {scan.action === 'time-in' ? 
                                      <LogIn className="h-3 w-3" /> : 
                                      <LogOut className="h-3 w-3" />
                                    }
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{scan.name}</p>
                                    <div className="flex items-center gap-1">
                                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                        {scan.role}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {scan.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="py-8 text-center text-sm text-muted-foreground">
                            <p>No recent scans</p>
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default QrScanner;
