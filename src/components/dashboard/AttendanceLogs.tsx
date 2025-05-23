
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface AttendanceLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  timestamp: string;
}

interface AttendanceLogsProps {
  logs: AttendanceLog[];
  todayLogsCount: number;
}

const AttendanceLogs: React.FC<AttendanceLogsProps> = ({ logs, todayLogsCount }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-none rounded-xl">
      <div className="absolute h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      <CardHeader className="pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
            Latest Attendance
          </CardTitle>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 font-medium">
            {todayLogsCount} today
          </Badge>
        </div>
        <CardDescription>Recent check-ins and check-outs</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
            <p className="text-muted-foreground">No attendance records yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-auto pr-2 custom-scrollbar">
            {logs.slice(0, 7).map((log) => (
              <div key={log.id} className="flex items-center justify-between border-b pb-3 last:border-0 hover:bg-muted/20 p-2 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-sm
                    ${log.action === 'time-in' ? 'bg-green-100' : 'bg-amber-100'}`}>
                    {log.action === 'time-in' ? 
                      <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
                      <Clock className="h-5 w-5 text-amber-600" />
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
                  <p className="text-sm text-right font-medium">
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
  );
};

export default AttendanceLogs;
