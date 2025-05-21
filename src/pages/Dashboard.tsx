
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  User, Users, Calendar, QrCode, Bell, FileText,
  TrendingUp, Clock, AlertCircle, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const { students, teachers, attendanceLogs, smsLogs } = useData();
  const user = authState.user;

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
    <div className="space-y-6">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Welcome, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your QR Attendance System today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {user?.role === "admin" && (
          <>
            <Card className="overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-200 border-none">
              <div className="absolute h-1 w-full bg-gradient-to-r from-primary to-blue-400"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
                <CardTitle className="text-sm font-medium">
                  Students
                </CardTitle>
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{students.length}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-primary">{studentsPresent}</span> present today
                  </p>
                  <Badge variant="outline" className="bg-primary/5">
                    {studentAttendancePercentage}% attendance
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-200 border-none">
              <div className="absolute h-1 w-full bg-gradient-to-r from-green-400 to-teal-500"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
                <CardTitle className="text-sm font-medium">
                  Teachers
                </CardTitle>
                <div className="inline-flex items-center justify-center rounded-lg bg-green-100 p-2">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{teachers.length}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-green-600">{teachersPresent}</span> present today
                  </p>
                  <Badge variant="outline" className="bg-green-50">
                    {teacherAttendancePercentage}% attendance
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {user?.role === "teacher" && (
          <>
            <Card className="overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-200 border-none">
              <div className="absolute h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
                <CardTitle className="text-sm font-medium">
                  My Students
                </CardTitle>
                <div className="inline-flex items-center justify-center rounded-lg bg-violet-100 p-2">
                  <Users className="h-5 w-5 text-violet-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{myStudents.length}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-violet-600">{myStudentsPresent}</span> present today
                  </p>
                  <Badge variant="outline" className="bg-violet-50">
                    {myStudents.length > 0 ? Math.round((myStudentsPresent / myStudents.length) * 100) : 0}% attendance
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-200 border-none">
          <div className="absolute h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
            <CardTitle className="text-sm font-medium">
              Today's Check-Ins
            </CardTitle>
            <div className="inline-flex items-center justify-center rounded-lg bg-amber-100 p-2">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{todayLogs.length}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Check-ins recorded today
              </p>
              <Badge variant="outline" className="bg-amber-50 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Today
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-200 border-none">
          <div className="absolute h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
            <CardTitle className="text-sm font-medium">
              QR Scans
            </CardTitle>
            <div className="inline-flex items-center justify-center rounded-lg bg-blue-100 p-2">
              <QrCode className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{attendanceLogs.length}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Total scans recorded
              </p>
              <Badge variant="outline" className="bg-blue-50 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> All time
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border-none">
          <div className="absolute h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                Latest Attendance
              </CardTitle>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                {todayLogs.length} today
              </Badge>
            </div>
            <CardDescription>Recent check-ins and check-outs</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                <p className="text-muted-foreground">No attendance records yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-auto pr-2">
                {attendanceLogs.slice(0, 7).map((log) => (
                  <div key={log.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                        ${log.action === 'time-in' ? 'bg-green-100' : 'bg-amber-100'}`}>
                        {log.action === 'time-in' ? 
                          <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                          <Clock className="h-4 w-4 text-amber-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{log.userName}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {log.userRole} - {log.action.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-right">
                        {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <p className="text-xs text-muted-foreground text-right">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {user?.role === "admin" && (
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border-none">
            <div className="absolute h-1 w-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
            <CardHeader className="pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-pink-500" />
                  SMS Notifications
                </CardTitle>
                <Badge variant="outline" className="bg-pink-50 text-pink-700">
                  {smsLogs.length} sent
                </Badge>
              </div>
              <CardDescription>Recent notifications to parents</CardDescription>
            </CardHeader>
            <CardContent>
              {smsLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                  <p className="text-muted-foreground">No SMS logs yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-auto pr-2">
                  {smsLogs.slice(0, 7).map((log) => (
                    <div key={log.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                          ${log.status === 'delivered' ? 'bg-green-100' : 'bg-amber-100'}`}>
                          {log.status === 'delivered' ? 
                            <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                            <Bell className="h-4 w-4 text-amber-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{log.studentName}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {log.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            To: {log.parentPhone}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-right">
                          {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="text-xs text-muted-foreground text-right capitalize">
                          {log.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {user?.role === "teacher" && (
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border-none">
            <div className="absolute h-1 w-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
            <CardHeader className="pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-teal-500" />
                  Attendance Summary
                </CardTitle>
                <Badge variant="outline" className="bg-teal-50 text-teal-700">
                  {myStudents.length} students
                </Badge>
              </div>
              <CardDescription>Class attendance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">Present:</span>
                  <span className="font-medium text-green-600">{myStudentsPresent} students</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">Absent:</span>
                  <span className="font-medium text-rose-600">{myStudents.length - myStudentsPresent} students</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">Attendance Rate:</span>
                  <span className="font-medium">
                    {myStudents.length > 0 ? Math.round((myStudentsPresent / myStudents.length) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" 
                      style={{ 
                        width: `${myStudents.length > 0 ? Math.round((myStudentsPresent / myStudents.length) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
