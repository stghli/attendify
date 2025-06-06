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
import LandingPageControl from "@/components/dashboard/LandingPageControl";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-8 max-w-[1600px] mx-auto p-6">
        {/* Dashboard Header with greeting and tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <DashboardHeader userName={user?.name || ''} />
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full lg:w-auto"
          >
            <TabsList className="grid grid-cols-2 lg:grid-cols-3 w-full lg:w-auto bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="attendance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Attendance</TabsTrigger>
              <TabsTrigger value="analytics" className="hidden lg:block data-[state=active]:bg-blue-600 data-[state=active]:text-white">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <QuickActions userRole={user?.role || ''} />
        </div>

        {/* Landing Page Control - Only for Admin */}
        {user?.role === "admin" && (
          <LandingPageControl />
        )}

        {/* Stat Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {user?.role === "admin" && (
            <>
              <StatCard 
                title="Students"
                value={students.length}
                icon={User}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
                gradientFrom="#3b82f6" // blue-500
                gradientTo="#1d4ed8" // blue-700
                subtitle="present today"
                subtitleHighlight={{ value: studentsPresent, color: "text-blue-600" }}
                badgeText={`${studentAttendancePercentage}% attendance`}
                badgeBgClass="bg-blue-50 text-blue-700"
              />

              <StatCard 
                title="Teachers"
                value={teachers.length}
                icon={Users}
                iconBgColor="bg-emerald-50"
                iconColor="text-emerald-600"
                gradientFrom="#10b981" // emerald-500
                gradientTo="#047857" // emerald-700
                subtitle="present today"
                subtitleHighlight={{ value: teachersPresent, color: "text-emerald-600" }}
                badgeText={`${teacherAttendancePercentage}% attendance`}
                badgeBgClass="bg-emerald-50 text-emerald-700"
              />
            </>
          )}

          {user?.role === "teacher" && (
            <>
              <StatCard 
                title="My Students"
                value={myStudents.length}
                icon={Users}
                iconBgColor="bg-purple-50"
                iconColor="text-purple-600"
                gradientFrom="#8b5cf6" // violet-500
                gradientTo="#6d28d9" // violet-700
                subtitle="present today"
                subtitleHighlight={{ value: myStudentsPresent, color: "text-purple-600" }}
                badgeText={`${myStudents.length > 0 ? Math.round((myStudentsPresent / myStudents.length) * 100) : 0}% attendance`}
                badgeBgClass="bg-purple-50 text-purple-700"
              />
            </>
          )}

          <StatCard 
            title="Today's Check-Ins"
            value={todayLogs.length}
            icon={Calendar}
            iconBgColor="bg-amber-50"
            iconColor="text-amber-600"
            gradientFrom="#f59e0b" // amber-500
            gradientTo="#d97706" // amber-600
            subtitle="Check-ins recorded today"
            badgeText="Today"
            badgeBgClass="bg-amber-50 text-amber-700"
            subtitleHighlight={{ value: "", color: "" }}
          />

          <StatCard 
            title="QR Scans"
            value={attendanceLogs.length}
            icon={QrCode}
            iconBgColor="bg-red-50"
            iconColor="text-red-600"
            gradientFrom="#ef4444" // red-500
            gradientTo="#dc2626" // red-600
            subtitle="Total scans recorded"
            badgeText="All time"
            badgeBgClass="bg-red-50 text-red-700"
            subtitleHighlight={{ value: "", color: "" }}
          />
        </div>

        {/* Attendance Trend Chart */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
          <AttendanceTrendChart />
        </div>

        {/* Detailed Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
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
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
          <RecentActivities logs={[...attendanceLogs, ...smsLogs].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ).slice(0, 10)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
