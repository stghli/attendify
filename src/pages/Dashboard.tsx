
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, Calendar, QrCode } from "lucide-react";

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

  return (
    <div>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the QR Attendance System Dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {user?.role === "admin" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
                <p className="text-xs text-muted-foreground">
                  {studentsPresent} present today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Teachers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teachers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {teachersPresent} present today
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {user?.role === "teacher" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  My Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myStudents.length}</div>
                <p className="text-xs text-muted-foreground">
                  {myStudentsPresent} present today
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Today's Attendance
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Check-ins today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              QR Scans
            </CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Total scans recorded
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        
        <div className="rounded-lg border shadow">
          <div className="bg-muted/50 p-3">
            <h3 className="font-medium">Latest Attendance</h3>
          </div>
          <div className="p-4">
            {attendanceLogs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No attendance records yet</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-auto">
                {attendanceLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{log.userName}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {log.userRole} - {log.action.replace('-', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-right">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-muted-foreground text-right">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {user?.role === "admin" && (
          <div className="rounded-lg border shadow">
            <div className="bg-muted/50 p-3">
              <h3 className="font-medium">SMS Notifications</h3>
            </div>
            <div className="p-4">
              {smsLogs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No SMS logs yet</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-auto">
                  {smsLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{log.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          To: {log.parentPhone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-right">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-muted-foreground text-right capitalize">
                          {log.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
