
import React from "react";
import { QrCode } from "lucide-react";

interface QrScannerHeaderProps {
  scanning: boolean;
}

const QrScannerHeader: React.FC<QrScannerHeaderProps> = ({ scanning }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 text-center font-medium flex items-center justify-center gap-2">
      <QrCode className="h-5 w-5" />
      {scanning ? "Scan QR Code to Record Attendance" : "QR Scanner"}
    </div>
  );
};

export default QrScannerHeader;
