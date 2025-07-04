import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import QrScanner from "@/components/QrScanner";
import { useStudents } from "@/context/students/StudentsContext";
import { useTeachers } from "@/context/teachers/TeachersContext";
import { useAttendance } from "@/context/attendance/AttendanceContext";
import LandingHeader from "@/components/landing/LandingHeader";
import CurrentTimeDisplay from "@/components/landing/CurrentTimeDisplay";
import EventCard from "@/components/landing/EventCard";
import StatisticsCards from "@/components/landing/StatisticsCards";
import ImportantNotice from "@/components/landing/ImportantNotice";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { attendanceLogs } = useAttendance();

  // Calculate totals
  const totalAttendees = students.length + teachers.length;

  // Calculate checked-in counts
  const getCheckedInCounts = () => {
    const today = new Date().toDateString();
    const todayLogs = attendanceLogs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );

    // Get unique users who have checked in today (latest action per user)
    const userStatuses = new Map();
    
    todayLogs.forEach(log => {
      const existing = userStatuses.get(log.userId);
      if (!existing || new Date(log.timestamp) > new Date(existing.timestamp)) {
        userStatuses.set(log.userId, log);
      }
    });

    let checkedInTeachers = 0;
    let checkedInStudents = 0;

    userStatuses.forEach(log => {
      if (log.action === "time-in") {
        if (log.userRole === "teacher") {
          checkedInTeachers++;
        } else if (log.userRole === "student") {
          checkedInStudents++;
        }
      }
    });

    return { checkedInTeachers, checkedInStudents };
  };

  const { checkedInTeachers, checkedInStudents } = getCheckedInCounts();
  const totalCheckedIn = checkedInTeachers + checkedInStudents;
  
  // Calculate not checked in counts
  const notCheckedInTeachers = teachers.length - checkedInTeachers;
  const notCheckedInStudents = students.length - checkedInStudents;

  // Check for valid access code on mount
  useEffect(() => {
    const hasValidAccess = localStorage.getItem("validAccessCode");
    if (!hasValidAccess) {
      navigate("/code-entry");
    }
  }, [navigate]);

  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Dark Background with QR Scanner */}
      <div className="lg:w-1/2 bg-slate-800 flex flex-col items-center justify-center p-4 sm:p-8 relative">
        {/* Mobile Header Buttons */}
        <LandingHeader />

        {/* Current Time Display */}
        <CurrentTimeDisplay currentTime={currentTime} />

        {/* QR Scanner - Centered for mobile */}
        <div className="w-full max-w-xs sm:max-w-sm flex justify-center">
          <QrScanner />
        </div>
      </div>

      {/* Right Side - Light Background with Enhanced Content */}
      <div className="lg:w-1/2 bg-gray-50 flex flex-col justify-center p-4 sm:p-8 space-y-4 sm:space-y-6">
        {/* Event Card */}
        <EventCard currentTime={currentTime} />

        {/* Statistics Cards */}
        <StatisticsCards
          totalAttendees={totalAttendees}
          teachers={teachers.length}
          students={students.length}
          totalCheckedIn={totalCheckedIn}
          checkedInTeachers={checkedInTeachers}
          checkedInStudents={checkedInStudents}
          notCheckedInTeachers={notCheckedInTeachers}
          notCheckedInStudents={notCheckedInStudents}
        />

        {/* How It Works Section */}
        <Card className="shadow-lg border-0 bg-blue-50">
          
        </Card>

        {/* Important Notice */}
        <ImportantNotice />

        {/* Contact Information */}
        <Card className="shadow-lg border-0">
          
        </Card>
      </div>
    </div>
  );
};

export default Landing;
