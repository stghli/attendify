import React, { createContext, useState, useContext } from "react";
import { SMSLog } from "@/types";
import { toast } from "sonner";
import { sanitizePhoneNumber, sanitizeSmsMessage } from "@/utils/validation";
import { logger } from "@/utils/logger";

// Mock data
const initialSmsLogs: SMSLog[] = [
  {
    id: "sms-1",
    studentId: "student-1",
    studentName: "Alice Johnson",
    parentPhone: "+1234567890",
    message: "Alice Johnson checked in at 8:00 AM",
    timestamp: "2025-05-21T08:00:10Z",
    status: "delivered",
  },
];

interface SmsContextType {
  smsLogs: SMSLog[];
  addSmsLog: (logData: {
    studentId: string;
    studentName: string;
    parentPhone: string;
    message: string;
  }) => void;
}

const SmsContext = createContext<SmsContextType>({
  smsLogs: [],
  addSmsLog: () => {},
});

export const SmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>(initialSmsLogs);

  // Add SMS log with input sanitization
  const addSmsLog = (logData: {
    studentId: string;
    studentName: string;
    parentPhone: string;
    message: string;
  }) => {
    try {
      // Sanitize and validate inputs
      const sanitizedPhone = sanitizePhoneNumber(logData.parentPhone);
      const sanitizedMessage = sanitizeSmsMessage(logData.message);
      
      const newSmsLog: SMSLog = {
        id: `sms-${Date.now()}`,
        studentId: logData.studentId,
        studentName: logData.studentName,
        parentPhone: sanitizedPhone,
        message: sanitizedMessage,
        timestamp: new Date().toISOString(),
        status: "delivered",
      };
      
      setSmsLogs([newSmsLog, ...smsLogs]);
      
      // Log only in development (no PII in production logs)
      logger.log('SMS notification queued for student:', logData.studentName);
      
    } catch (error) {
      toast.error("Invalid phone number or message format");
      logger.error("SMS validation error:", error);
    }
  };

  return (
    <SmsContext.Provider
      value={{
        smsLogs,
        addSmsLog,
      }}
    >
      {children}
    </SmsContext.Provider>
  );
};

export const useSmsNotifications = () => useContext(SmsContext);
