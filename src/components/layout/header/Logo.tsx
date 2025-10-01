import React from "react";
import { QrCode } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
        <QrCode className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-foreground">
          QR Attendance
        </h1>
      </div>
    </div>
  );
};

export default Logo;
