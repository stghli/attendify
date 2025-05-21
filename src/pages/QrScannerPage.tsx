
import React from "react";
import QrScanner from "@/components/QrScanner";

const QrScannerPage: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight">QR Scanner</h1>
        <p className="text-muted-foreground">
          Scan student or teacher QR codes to record attendance.
        </p>
      </div>

      <div className="flex justify-center">
        <QrScanner />
      </div>
    </div>
  );
};

export default QrScannerPage;
