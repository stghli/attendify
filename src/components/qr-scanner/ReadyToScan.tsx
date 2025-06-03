
import React from "react";
import { LogIn, LogOut } from "lucide-react";

interface ReadyToScanProps {
  selectedAction: "time-in" | "time-out";
}

const ReadyToScan: React.FC<ReadyToScanProps> = ({ selectedAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
      <div className="rounded-full bg-muted p-6">
        {selectedAction === "time-in" ? 
          <LogIn className="h-10 w-10" /> : 
          <LogOut className="h-10 w-10" />
        }
      </div>
      <p className="mt-4">Ready to scan {selectedAction === 'time-in' ? 'check-in' : 'check-out'} QR codes</p>
    </div>
  );
};

export default ReadyToScan;
