
import React, { createContext, useState, useContext } from "react";
import { AttendanceLog } from "@/types";
import { toast } from "sonner";
import { useStudents } from "../students/StudentsContext";
import { useTeachers } from "../teachers/TeachersContext";
import { useSmsNotifications } from "../sms/SmsContext";

// Morning and evening scriptures
const morningScriptures = [
  { verse: "This is the day which the Lord has made; let us rejoice and be glad in it.", reference: "Psalm 118:24" },
  { verse: "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.", reference: "Lamentations 3:22-23" },
  { verse: "But I will sing of your strength; I will sing aloud of your steadfast love in the morning.", reference: "Psalm 59:16" },
  { verse: "Let me hear in the morning of your steadfast love, for in you I trust.", reference: "Psalm 143:8" },
  { verse: "Satisfy us in the morning with your steadfast love, that we may rejoice and be glad all our days.", reference: "Psalm 90:14" },
];

const eveningScriptures = [
  { verse: "When you lie down, you will not be afraid; when you lie down, your sleep will be sweet.", reference: "Proverbs 3:24" },
  { verse: "In peace I will both lie down and sleep; for you alone, O Lord, make me dwell in safety.", reference: "Psalm 4:8" },
  { verse: "It is in vain that you rise up early and go late to rest, eating the bread of anxious toil; for he gives to his beloved sleep.", reference: "Psalm 127:2" },
  { verse: "I lay down and slept; I woke again, for the Lord sustained me.", reference: "Psalm 3:5" },
  { verse: "For God gives rest to his loved ones.", reference: "Psalm 127:2" },
];

// Mock data
const initialAttendanceLogs: AttendanceLog[] = [
  {
    id: "log-1",
    userId: "student-1",
    userName: "Alice Johnson",
    userRole: "student",
    timestamp: "2025-05-21T08:00:00Z",
    action: "time-in",
    status: "entry",
  },
  {
    id: "log-2",
    userId: "teacher-1",
    userName: "John Smith",
    userRole: "teacher",
    timestamp: "2025-05-21T07:45:00Z",
    action: "time-in",
    status: "entry",
  },
];

interface AttendanceContextType {
  attendanceLogs: AttendanceLog[];
  recordAttendance: (
    userId: string, 
    userRole: "student" | "teacher",
    action: "time-in" | "time-out"
  ) => void;
  generateQRCode: (userId: string, userRole: "student" | "teacher") => string;
  getTimeStatus: () => {
    canCheckIn: boolean;
    canCheckOut: boolean;
    isLateCheckIn: boolean;
    isLateCheckOut: boolean;
    message: string;
  };
}

const AttendanceContext = createContext<AttendanceContextType>({
  attendanceLogs: [],
  recordAttendance: () => {},
  generateQRCode: () => "",
  getTimeStatus: () => ({
    canCheckIn: false,
    canCheckOut: false,
    isLateCheckIn: false,
    isLateCheckOut: false,
    message: ""
  }),
});

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(initialAttendanceLogs);
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { addSmsLog } = useSmsNotifications();

  // Get time status for attendance
  const getTimeStatus = () => {
    const now = new Date();
    const hours = now.getHours();
    
    // Check-in times: 5am-9am (on time), 9am-11am (late)
    const canCheckIn = hours >= 5 && hours < 11;
    const isLateCheckIn = hours >= 9 && hours < 11;
    
    // Check-out times: 12pm-5pm (on time), after 5pm (late pickup)
    const canCheckOut = hours >= 12;
    const isLateCheckOut = hours >= 17;
    
    let message = "";
    
    if (hours < 5) {
      message = "Check-in starts at 5:00 AM";
    } else if (hours >= 5 && hours < 9) {
      message = "On-time check-in period";
    } else if (hours >= 9 && hours < 11) {
      message = "Late check-in period";
    } else if (hours >= 11 && hours < 12) {
      message = "Check-in closed. Check-out starts at 12:00 PM";
    } else if (hours >= 12 && hours < 17) {
      message = "On-time check-out period";
    } else {
      message = "Late check-out period";
    }
    
    return {
      canCheckIn,
      canCheckOut,
      isLateCheckIn,
      isLateCheckOut,
      message
    };
  };

  // Get random scripture based on time of day
  const getRandomScripture = (isCheckin: boolean) => {
    const scriptures = isCheckin ? morningScriptures : eveningScriptures;
    const randomIndex = Math.floor(Math.random() * scriptures.length);
    return scriptures[randomIndex];
  };

  // Get greeting based on time of day
  const getGreeting = (name: string, isCheckin: boolean, isLate: boolean = false) => {
    const hours = new Date().getHours();
    let greeting = "";
    
    if (isCheckin) {
      if (isLate) {
        greeting = `${name}, you're checking in late. Please be on time next time.`;
      } else if (hours < 12) {
        greeting = `Good morning, ${name}! Have a wonderful day at school.`;
      } else {
        greeting = `Good afternoon, ${name}! Glad you're here today.`;
      }
    } else {
      if (isLate) {
        greeting = `${name}, this is a late pickup. Please arrange for earlier pickup next time.`;
      } else if (hours < 16) {
        greeting = `Goodbye, ${name}! Hope you had a great day at school.`;
      } else {
        greeting = `Good evening, ${name}! Have a peaceful evening and rest well.`;
      }
    }
    
    return greeting;
  };

  // Record attendance
  const recordAttendance = (
    userId: string, 
    userRole: "student" | "teacher",
    action: "time-in" | "time-out"
  ) => {
    const timeStatus = getTimeStatus();
    
    // Check if the action is allowed based on time
    if (action === "time-in" && !timeStatus.canCheckIn) {
      toast.error("Check-in is not available at this time. Check-in hours: 5:00 AM - 11:00 AM");
      return;
    }
    
    if (action === "time-out" && !timeStatus.canCheckOut) {
      toast.error("Check-out is not available at this time. Check-out starts at 12:00 PM");
      return;
    }

    // Find the user
    const user = userRole === "student" 
      ? students.find(s => s.id === userId)
      : teachers.find(t => t.id === userId);

    if (!user) {
      toast.error("User not found");
      return;
    }

    // Determine if this is a late check-in or check-out
    const isLate = action === "time-in" ? timeStatus.isLateCheckIn : timeStatus.isLateCheckOut;

    // Create attendance log
    const newLog: AttendanceLog = {
      id: `log-${Date.now()}`,
      userId,
      userName: user.name,
      userRole,
      timestamp: new Date().toISOString(),
      action,
      status: action === "time-in" ? "entry" : "exit",
    };

    setAttendanceLogs([newLog, ...attendanceLogs]);
    
    // Get scripture and greeting
    const isCheckin = action === "time-in";
    const scripture = getRandomScripture(isCheckin);
    const greeting = getGreeting(user.name, isCheckin, isLate);
    
    // Display welcome message with scripture
    toast.success(
      <div className="space-y-1">
        <p className="font-medium">{greeting}</p>
        {isLate && (
          <p className="text-sm text-orange-600 font-medium">
            {action === "time-in" ? "⚠️ Late Arrival" : "⚠️ Late Pickup"}
          </p>
        )}
        <p className="text-sm italic">"{scripture.verse}"</p>
        <p className="text-xs text-right">- {scripture.reference}</p>
      </div>,
      {
        duration: 5000,
      }
    );
    
    // If student, send SMS notification
    if (userRole === "student") {
      const student = user;
      // Make sure we're only accessing parentPhone for students
      if ('parentPhone' in student) {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const timeString = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        let message = "";
        
        if (action === "time-in") {
          message = `Dear Parent/Guardian,

This is to inform you that your child, ${student.name}, from ${student.class || 'N/A'}, has checked in at Honeyberry International School on ${dateString} at ${timeString}.

We're excited to have them present and ready to learn today.

— Honeyberry International School`;
        } else {
          message = `Dear Parent/Guardian,

Your child, ${student.name}, from ${student.class || 'N/A'}, has checked out of Honeyberry International School on ${dateString} at ${timeString}.

Thank you for entrusting us with your child's education and safety. We look forward to seeing them tomorrow.

— Honeyberry International School`;
        }
        
        // Send SMS via SmsContext
        addSmsLog({
          studentId: student.id,
          studentName: student.name,
          parentPhone: student.parentPhone,
          message,
        });
      }
    }
  };

  // Generate QR code (simplified for demo)
  const generateQRCode = (userId: string, userRole: "student" | "teacher"): string => {
    // In a real app, this would generate an actual QR code
    return `${userRole}-${userId}-qr`;
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceLogs,
        recordAttendance,
        generateQRCode,
        getTimeStatus,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
