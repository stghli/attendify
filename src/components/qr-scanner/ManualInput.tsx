import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyboardIcon, QrCode, AlertCircle, CheckCircle } from "lucide-react";
import { useValidateStudentId } from "@/hooks/useStudents";
import { toast } from "sonner";

interface ManualInputProps {
  onSubmit: (studentData: { id: string; name: string; student_id: string }) => void;
  onBackToScanner: () => void;
}

const ManualInput: React.FC<ManualInputProps> = ({ onSubmit, onBackToScanner }) => {
  const [studentId, setStudentId] = useState("");
  const [validationResult, setValidationResult] = useState<{ id: string; name: string; student_id: string } | null>(null);
  const validateStudentId = useValidateStudentId();

  const handleValidate = async () => {
    if (!studentId.trim()) return;

    try {
      const result = await validateStudentId.mutateAsync(studentId.trim().toUpperCase());
      if (result) {
        setValidationResult(result);
        toast.success(`Student found: ${result.name}`);
      } else {
        setValidationResult(null);
        toast.error("Student ID not found in database");
      }
    } catch (error) {
      setValidationResult(null);
      console.error("Validation error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationResult) {
      onSubmit(validationResult);
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
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter student ID (e.g., STU001234)"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    setValidationResult(null);
                  }}
                  className="text-center text-lg font-mono flex-1"
                  autoFocus
                  maxLength={20}
                />
                <Button 
                  type="button"
                  onClick={handleValidate}
                  disabled={!studentId.trim() || validateStudentId.isPending}
                  variant="outline"
                >
                  {validateStudentId.isPending ? "..." : "Check"}
                </Button>
              </div>
              
              {validationResult && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded-md flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 dark:text-green-300">
                    Found: {validationResult.name} (ID: {validationResult.student_id})
                  </span>
                </div>
              )}
              
              {validateStudentId.isError && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 dark:text-red-300">
                    Student ID not found. Please check and try again.
                  </span>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                Enter the student ID and click "Check" to validate
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!validationResult}
            >
              Mark Attendance
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