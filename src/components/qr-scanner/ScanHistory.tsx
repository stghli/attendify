
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, LogIn, LogOut } from "lucide-react";
import { ScanHistoryItem } from "./types";

interface ScanHistoryProps {
  showHistory: boolean;
  scanHistory: ScanHistoryItem[];
  onClearHistory: () => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ 
  showHistory, 
  scanHistory, 
  onClearHistory 
}) => {
  return (
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
                onClick={onClearHistory} 
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
  );
};

export default ScanHistory;
