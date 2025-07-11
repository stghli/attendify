
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QrCodeGenerator from "@/components/QrCodeGenerator";

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userRole: "student" | "teacher";
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  userRole,
}) => {
  // For a real QR code, we'd use a format that could be parsed like: userRole-userId-qr
  const qrValue = `${userRole}-${userId}-qr`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>
            {userRole === "student"
              ? "Student QR code for attendance tracking"
              : "Teacher QR code for attendance tracking"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <QrCodeGenerator
            value={qrValue}
            userName={userName}
            userRole={userRole}
            size={200}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
