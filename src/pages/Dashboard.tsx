
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { User, Users, Calendar, QrCode, Clock, TrendingUp, Activity, Bell, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import AttendanceLogs from "@/components/dashboard/AttendanceLogs";
import SmsNotifications from "@/components/dashboard/SmsNotifications";
import AttendanceSummary from "@/components/dashboard/AttendanceSummary";
import AttendanceTrendChart from "@/components/dashboard/AttendanceTrendChart";
import RecentActivities from "@/components/dashboard/RecentActivities";
import QuickActions from "@/components/dashboard/QuickActions";

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const { students, teachers, attendanceLogs, smsLogs } = useData();
  const user = authState.user;
  const [activeTab, setActiveTab] = useState("overview");

  const todayLogs = attendanceLogs.filter(
    log => new Date(log.timestamp).toDateString() === new Date().toDateString()
  );
  
  const studentsPresent = todayLogs.filter(
    log => log.userRole === "student" && log.action === "time-in"
  ).length;
  
  const teachersPresent = todayLogs.filter(
    log => log.userRole === "teacher" && log.action === "time-in"
  ).length;

  // For teacher view
  const myStudents = user?.role === "teacher" ? students.filter(
    student => student.assignedTeacherId === user.id
  ) : [];

  const myStudentsPresent = user?.role === "teacher" ? todayLogs.filter(
    log => {
      const studentIds = myStudents.map(s => s.id);
      return studentIds.includes(log.userId) && log.action === "time-in";
    }
  ).length : 0;

  // Calculate attendance percentage
  const studentAttendancePercentage = students.length > 0 
    ? Math.round((studentsPresent / students.length) * 100) 
    : 0;
  
  const teacherAttendancePercentage = teachers.length > 0 
    ? Math.round((teachersPresent / teachers.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Dashboard Header with greeting and tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <DashboardHeader userName={user?.name || ''} />
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="analytics" className="hidden md:block">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Quick Actions */}
      <QuickActions userRole={user?.role || ''} />

      {/* Stat Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {user?.role === "admin" && (
          <>
            <StatCard 
              title="Students"
              value={students.length}
              icon={User}
              iconBgColor="bg-primary/10"
              iconColor="text-primary"
              gradientFrom="var(--primary)"
              gradientTo="#60a5fa" // blue-400
              subtitle="present today"
              subtitleHighlight={{ value: studentsPresent, color: "text-primary" }}
              badgeText={`${studentAttendancePercentage}% attendance`}
            />

            <StatCard 
              title="Teachers"
              value={teachers.length}
              icon={Users}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              gradientFrom="#4ade80" // green-400
              gradientTo="#14b8a6" // teal-500
              subtitle="present today"
              subtitleHighlight={{ value: teachersPresent, color: "text-green-600" }}
              badgeText={`${teacherAttendancePercentage}% attendance`}
              badgeBgClass="bg-green-50"
            />
          </>
        )}

        {user?.role === "teacher" && (
          <>
            <StatCard 
              title="My Students"
              value={myStudents.length}
              icon={Users}
              iconBgColor="bg-violet-100"
              iconColor="text-violet-600"
              gradientFrom="#8b5cf6" // violet-500
              gradientTo="#a855f7" // purple-500
              subtitle="present today"
              subtitleHighlight={{ value: myStudentsPresent, color: "text-violet-600" }}
              badgeText={`${myStudents.length > 0 ? Math.round((myStudentsPresent / myStudents.length) * 100) : 0}% attendance`}
              badgeBgClass="bg-violet-50"
            />
          </>
        )}

        <StatCard 
          title="Today's Check-Ins"
          value={todayLogs.length}
          icon={Calendar}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          gradientFrom="#f59e0b" // amber-500
          gradientTo="#f97316" // orange-500
          subtitle="Check-ins recorded today"
          badgeText="Today"
          badgeBgClass="bg-amber-50 flex items-center gap-1"
          subtitleHighlight={{ value: "", color: "" }}
        />

        <StatCard 
          title="QR Scans"
          value={attendanceLogs.length}
          icon={QrCode}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          gradientFrom="#60a5fa" // blue-400
          gradientTo="#6366f1" // indigo-500
          subtitle="Total scans recorded"
          badgeText="All time"
          badgeBgClass="bg-blue-50 flex items-center gap-1"
          subtitleHighlight={{ value: "", color: "" }}
        />
      </div>

      {/* Attendance Trend Chart */}
      <div className="mt-6">
        <AttendanceTrendChart />
      </div>

      {/* Detailed Cards */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <AttendanceLogs 
          logs={attendanceLogs} 
          todayLogsCount={todayLogs.length} 
        />
        
        {user?.role === "admin" && (
          <SmsNotifications logs={smsLogs} />
        )}
        
        {user?.role === "teacher" && (
          <AttendanceSummary 
            studentsCount={myStudents.length} 
            presentCount={myStudentsPresent} 
          />
        )}
      </div>

      {/* Recent Activities Section */}
      <div className="mt-6">
        <RecentActivities logs={[...attendanceLogs, ...smsLogs].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, 10)} />
      </div>
    </div>
  );
};

export default Dashboard;
