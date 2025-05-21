import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar as CalendarIcon } from "lucide-react";

const MyStudentsPage: React.FC = () => {
  const { authState } = useAuth();
  const { getStudentsByTeacher, attendanceLogs } = useData();
  const user = authState.user;

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("today");

  if (!user || user.role !== "teacher") {
    return <div>Loading...</div>;
  }

  const myStudents = getStudentsByTeacher(user.id);
  
  const filteredLogs = attendanceLogs.filter(log => {
    // Filter by student if one is selected
    if (selectedStudent && log.userId !== selectedStudent) return false;
    
    // Otherwise, show logs for all of the teacher's students
    const studentIds = myStudents.map(s => s.id);
    if (!studentIds.includes(log.userId)) return false;
    
    // Apply date filter
    if (dateFilter === "all") return true;
    if (dateFilter === "today") {
      return new Date(log.timestamp).toDateString() === new Date().toDateString();
    }
    if (dateFilter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(log.timestamp) >= oneWeekAgo;
    }
    if (dateFilter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(log.timestamp) >= oneMonthAgo;
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Students</h1>
        <p className="text-muted-foreground">
          View attendance records for your assigned students.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={selectedStudent === null ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedStudent(null)}
                >
                  <User className="mr-2 h-4 w-4" />
                  All Students ({myStudents.length})
                </Button>
                {myStudents.map(student => (
                  <Button
                    key={student.id}
                    variant={selectedStudent === student.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {student.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedStudent 
                    ? `Attendance: ${myStudents.find(s => s.id === selectedStudent)?.name}`
                    : "Attendance: All Students"}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={dateFilter === "today" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("today")}
                  >
                    Today
                  </Button>
                  <Button
                    variant={dateFilter === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={dateFilter === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={dateFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("all")}
                  >
                    All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No attendance records found.
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 font-medium bg-muted/50 p-3">
                    <div>Student</div>
                    <div>Date</div>
                    <div>Time</div>
                    <div>Action</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="grid grid-cols-5 p-3">
                        <div>{log.userName}</div>
                        <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                        <div>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="capitalize">{log.action.replace('-', ' ')}</div>
                        <div className="capitalize">{log.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyStudentsPage;
