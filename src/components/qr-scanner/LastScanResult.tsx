
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut } from "lucide-react";
import { ScanHistoryItem } from "./types";

interface LastScanResultProps {
  lastScan: ScanHistoryItem;
}

const LastScanResult: React.FC<LastScanResultProps> = ({ lastScan }) => {
  return (
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
  );
};

export default LastScanResult;
