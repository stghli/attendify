import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyboardIcon, QrCode } from "lucide-react";

interface ManualInputProps {
  onSubmit: (studentId: string) => void;
  onBackToScanner: () => void;
}

const ManualInput: React.FC<ManualInputProps> = ({ onSubmit, onBackToScanner }) => {
  const [studentId, setStudentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setIsSubmitting(true);
    try {
      onSubmit(studentId.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto"
    >
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <KeyboardIcon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Enter Student ID</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the student ID number manually
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Student ID Number
              </label>
              <Input
                type="text"
                placeholder="Enter student ID (e.g., STU001)"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="text-center text-lg font-mono"
                autoFocus
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the unique student identification number
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!studentId.trim() || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Mark Attendance"}
            </Button>
          </form>
          
          <Button 
            variant="outline" 
            onClick={onBackToScanner}
            className="w-full"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Back to QR Scanner
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManualInput;