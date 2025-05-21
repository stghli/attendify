
import React, { createContext, useState, useContext } from "react";
import { SMSLog } from "@/types";
import { toast } from "sonner";

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

  // Add SMS log
  const addSmsLog = (logData: {
    studentId: string;
    studentName: string;
    parentPhone: string;
    message: string;
  }) => {
    const newSmsLog: SMSLog = {
      id: `sms-${Date.now()}`,
      ...logData,
      timestamp: new Date().toISOString(),
      status: "delivered", // In a real app, this would depend on the SMS API response
    };
    
    setSmsLogs([newSmsLog, ...smsLogs]);
    
    // In a real app, you would integrate with Twilio or another SMS provider here
    console.log(`SMS sent to ${logData.parentPhone}: ${logData.message}`);
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
