
import React from "react";
import { Button } from "@/components/ui/button";
import { Scan, History } from "lucide-react";

interface ScannerActionsProps {
  lastScan: any;
  showHistory: boolean;
  onStartScanning: () => void;
  onToggleHistory: () => void;
}

const ScannerActions: React.FC<ScannerActionsProps> = ({
  lastScan,
  showHistory,
  onStartScanning,
  onToggleHistory
}) => {
  return (
    <div className="grid gap-3">
      <Button 
        onClick={onStartScanning} 
        className="w-full py-6 text-base flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
        variant="default"
      >
        <Scan className="h-5 w-5" />
        {lastScan ? "Scan Another QR Code" : "Start Scanning"}
      </Button>
      
      <Button 
        onClick={onToggleHistory} 
        variant="outline" 
        className="w-full flex items-center gap-2"
      >
        <History className="h-4 w-4" />
        {showHistory ? "Hide Recent Scans" : "Show Recent Scans"}
      </Button>
    </div>
  );
};

export default ScannerActions;
