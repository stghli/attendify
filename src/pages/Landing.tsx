
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import QrScanner from "@/components/QrScanner";
import { useStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { useAttendanceLogs } from "@/hooks/useAttendance";
import { useLandingPageSettings } from "@/hooks/useLandingPageSettings";
import LandingHeader from "@/components/landing/LandingHeader";
import CurrentTimeDisplay from "@/components/landing/CurrentTimeDisplay";
import EventCard from "@/components/landing/EventCard";
import StatisticsCards from "@/components/landing/StatisticsCards";
import ImportantNotice from "@/components/landing/ImportantNotice";
import ClockLoader from "@/components/ClockLoader";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();
  const { data: attendanceLogs = [], isLoading: attendanceLoading } = useAttendanceLogs();
  const { settings, isLoading: settingsLoading } = useLandingPageSettings();
  const [isSecurityValidated, setIsSecurityValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Current time state - always declared
  const [currentTime, setCurrentTime] = useState(new Date());

  // Always update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced security validation - runs continuously
  useEffect(() => {
    const validateSecurity = () => {
      // First check if landing page is enabled
      if (settings && !settings.is_enabled) {
        navigate("/", { replace: true });
        return false;
      }

      const hasValidAccess = localStorage.getItem("validAccessCode");
      const accessTime = localStorage.getItem("accessTime");
      const currentTime = Date.now();
      
      // Check if access code exists and is not expired (8 hours)
      if (!hasValidAccess || !accessTime || (currentTime - parseInt(accessTime)) > 8 * 60 * 60 * 1000) {
        // Clear expired access
        localStorage.removeItem("validAccessCode");
        localStorage.removeItem("accessTime");
        navigate("/code-entry", { replace: true });
        return false;
      }
      return true;
    };

    // Initial validation with loading
    const initialCheck = async () => {
      // Show loader for at least 1 second for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (validateSecurity()) {
        setIsSecurityValidated(true);
      }
      setIsLoading(false);
    };

    // Only run validation after settings are loaded
    if (!settingsLoading) {
      initialCheck();

    // Continuous security check every 30 seconds
    const securityInterval = setInterval(async () => {
      if (!(await validateSecurity())) {
        setIsSecurityValidated(false);
      }
    }, 30000);

      // Check on window focus/blur events for additional security
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          validateSecurity();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(securityInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [navigate, settings, settingsLoading]);

  // Show loader while validating or loading data
  if (isLoading || studentsLoading || teachersLoading || attendanceLoading || settingsLoading) {
    return <ClockLoader />;
  }

  // Don't render anything if security is not validated
  if (!isSecurityValidated) {
    return <ClockLoader />;
  }

  // Calculate totals
  const totalAttendees = students.length + teachers.length;

  // Calculate checked-in counts
  const getCheckedInCounts = () => {
    const today = new Date().toDateString();
    const todayLogs = attendanceLogs.filter(log => 
      new Date(log.created_at).toDateString() === today
    );

    // Count unique students
    const uniqueStudents = new Set(todayLogs.map(log => log.student_id));
    const checkedInStudents = uniqueStudents.size;
    
    return {
      students: checkedInStudents,
      teachers: 0 // Teachers not tracked separately in this version
    };
  };

  const { students: checkedInStudents, teachers: checkedInTeachers } = getCheckedInCounts();
  const totalCheckedIn = checkedInTeachers + checkedInStudents;
  
  // Calculate not checked in counts
  const notCheckedInTeachers = teachers.length - checkedInTeachers;
  const notCheckedInStudents = students.length - checkedInStudents;

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
