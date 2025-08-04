
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { generateQRCodeData } from "@/utils/qrCode";

interface QrCodeGeneratorProps {
  userId: string;
  userName: string;
  userRole: 'student' | 'teacher';
  size?: number;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ 
  userId, 
  userName, 
  userRole, 
  size = 200 
}) => {
  const qrValue = generateQRCodeData(userId, userRole, userName);
  const handleDownload = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) {
      toast.error("Could not generate QR code image");
      return;
    }

    const url = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = url;
    link.download = `${userRole}-${userName}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded successfully");
  };

  const handlePrint = () => {
    const printContent = document.getElementById('qr-print-area');
    if (!printContent) {
      toast.error("Could not print QR code");
      return;
    }

    const windowContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${userName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .qr-container {
              max-width: 300px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .qr-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .qr-role {
              color: #666;
              margin-bottom: 15px;
            }
            .qr-code {
              margin-bottom: 15px;
            }
            .qr-instructions {
              font-size: 12px;
              color: #666;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-title">${userName}</div>
            <div class="qr-role">${userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
            <div class="qr-code">
              ${printContent.innerHTML}
            </div>
            <div class="qr-instructions">
              Scan with the school attendance system to check in/out
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(windowContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      toast.success("Print dialog opened");
    } else {
      toast.error("Could not open print window. Please check your popup settings.");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className="py-3">
          <div id="qr-print-area">
            <QRCodeSVG 
              id="qr-canvas"
              value={qrValue}
              size={size}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/placeholder.svg",
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          <div className="mt-2">
            <p className="font-semibold">{userName}</p>
            <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QrCodeGenerator;
