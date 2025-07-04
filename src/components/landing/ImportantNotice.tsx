
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const ImportantNotice: React.FC = () => {
  return (
    <Card className="shadow-lg border-0 bg-yellow-50 border-l-4 border-l-yellow-400">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base sm:text-lg font-bold text-yellow-800 mb-2">Important Information</h4>
            <ul className="space-y-1 text-yellow-700 text-xs sm:text-sm">
              <li>• Check-in opens at 7:00 AM daily</li>
              <li>• Late arrivals after 8:30 AM will be marked accordingly</li>
              <li>• Check-out available from 12:00 PM onwards</li>
              <li>• Contact office for QR code issues</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportantNotice;
