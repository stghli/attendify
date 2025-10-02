
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
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
  const { profile: user } = useUserProfile();
  const { students, teachers, attendanceLogs, smsLogs } = useData();
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
    <div className="min-h-screen bg-background">
      <div className="space-y-6 max-w-[1600px] mx-auto p-6">
        {/* Dashboard Header with greeting and tabs */}
        <div className="flex flex-col gap-6">
          <DashboardHeader userName={user?.name || ''} />
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <QuickActions userRole={user?.role || ''} />
              </div>

              {/* Landing Page Control - Only for Admin */}
              {user?.role === "admin" && (
                <LandingPageControl />
              )}

              {/* Stat Cards Grid */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {user?.role === "admin" && (
                  <>
                    <StatCard 
                      title="Students"
                      value={students.length}
                      icon={User}
                      iconBgColor="bg-blue-50"
                      iconColor="text-blue-600"
                      gradientFrom="#3b82f6"
                      gradientTo="#1d4ed8"
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
                      gradientFrom="#10b981"
                      gradientTo="#047857"
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
                      gradientFrom="#8b5cf6"
                      gradientTo="#6d28d9"
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
                  gradientFrom="#f59e0b"
                  gradientTo="#d97706"
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
                  gradientFrom="#ef4444"
                  gradientTo="#dc2626"
                  subtitle="Total scans recorded"
                  badgeText="All time"
                  badgeBgClass="bg-red-50 text-red-700"
                  subtitleHighlight={{ value: "", color: "" }}
                />
              </div>

              {/* Recent Activities Section */}
              <RecentActivities logs={[...attendanceLogs, ...smsLogs].sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              ).slice(0, 10)} />
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              {/* Attendance Trend Chart */}
              <div className="border rounded-lg p-6">
                <AttendanceTrendChart />
              </div>

              {/* Detailed Cards */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
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
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Analytics content */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Analytics & Reports
                </h3>
                <p className="text-muted-foreground mb-4">Detailed analytics and reporting features coming soon.</p>
                <AttendanceTrendChart />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
