
import React from "react";
import QrScanner from "@/components/QrScanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanQrCode, Info, ArrowRight, UsersRound, QrCode } from "lucide-react";

const QrScannerPage: React.FC = () => {
  return (
    <div className="container px-4 py-6 max-w-5xl mx-auto">
      <div className="flex flex-col mb-8">
        <div className="flex items-center mb-3">
          <div className="bg-primary/10 p-2 rounded-lg mr-3">
            <QrCode className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            QR Attendance Scanner
          </h1>
        </div>
        <p className="text-muted-foreground">
          Scan student or teacher QR codes to quickly record attendance and send automatic notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <QrScanner />
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Today's Scans</h3>
                  <p className="text-3xl font-bold">24</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <ScanQrCode className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Present</h3>
                  <p className="text-3xl font-bold">18</p>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <UsersRound className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-lg border-none overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/90 to-blue-600 text-white">
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                How It Works
              </CardTitle>
              <CardDescription className="text-blue-100">
                Quick guide for using the attendance scanner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2 text-primary">
                  <ArrowRight className="h-4 w-4" /> For Students & Teachers
                </h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li>Hold your QR code in front of the scanner</li>
                  <li>Wait for the confirmation message</li>
                  <li>For students, an SMS will be sent to your parents</li>
                  <li>The system will automatically record if you're checking in or out</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2 text-primary">
                  <ArrowRight className="h-4 w-4" /> For Administrators
                </h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li>Login to access attendance records</li>
                  <li>Generate and print QR codes for students and teachers</li>
                  <li>View SMS notification logs</li>
                  <li>Generate attendance reports</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center text-primary">
                <Info className="mr-2 h-4 w-4" /> Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you're having trouble with the scanner, please contact the school administrator.
                Make sure you have a clear, well-lit view of your QR code and steady your device for better results.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QrScannerPage;
