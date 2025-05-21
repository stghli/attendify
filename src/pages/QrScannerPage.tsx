
import React from "react";
import QrScanner from "@/components/QrScanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanQrCode, Info } from "lucide-react";

const QrScannerPage: React.FC = () => {
  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <ScanQrCode className="mr-2 h-6 w-6 text-primary" />
          QR Attendance Scanner
        </h1>
        <p className="text-muted-foreground">
          Scan student or teacher QR codes to record attendance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <QrScanner />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
              <CardDescription>
                Quick guide for using the attendance scanner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">For Students & Teachers:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Hold your QR code in front of the scanner</li>
                  <li>Wait for the confirmation message</li>
                  <li>For students, an SMS will be sent to your parents</li>
                  <li>The system will automatically record if you're checking in or out</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">For Administrators:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Login to access attendance records</li>
                  <li>Generate and print QR codes for students and teachers</li>
                  <li>View SMS notification logs</li>
                  <li>Generate attendance reports</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you're having trouble with the scanner, please contact the school administrator.
                Make sure you have a clear, well-lit view of your QR code.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QrScannerPage;
