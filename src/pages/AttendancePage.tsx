
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

const AttendancePage: React.FC = () => {
  const { authState } = useAuth();
  const { attendanceLogs } = useData();
  const user = authState.user;

  const [dateFilter, setDateFilter] = useState<string>("all");

  if (!user) {
    return <div>Loading...</div>;
  }

  // Filter logs based on the teacher's ID
  const teacherLogs = attendanceLogs.filter(log => log.userId === user.id);

  // Apply date filter
  const filteredLogs = teacherLogs.filter(log => {
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
        <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
        <p className="text-muted-foreground">
          View your attendance records.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <Button
            variant={dateFilter === "all" ? "default" : "outline"}
            className="mr-2"
            onClick={() => setDateFilter("all")}
          >
            All Time
          </Button>
          <Button
            variant={dateFilter === "today" ? "default" : "outline"}
            className="mr-2"
            onClick={() => setDateFilter("today")}
          >
            Today
          </Button>
          <Button
            variant={dateFilter === "week" ? "default" : "outline"}
            className="mr-2"
            onClick={() => setDateFilter("week")}
          >
            Past Week
          </Button>
          <Button
            variant={dateFilter === "month" ? "default" : "outline"}
            onClick={() => setDateFilter("month")}
          >
            Past Month
          </Button>
        </div>
        <div>
          <Button variant="outline">
            Export Records
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Attendance Logs</CardTitle>
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found.
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-4 font-medium bg-muted/50 p-3">
                <div>Date</div>
                <div>Time</div>
                <div>Action</div>
                <div>Status</div>
              </div>
              <div className="divide-y">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="grid grid-cols-4 p-3">
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
  );
};

export default AttendancePage;
