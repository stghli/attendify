
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useData } from "@/context/DataContext";
import { TrendingUp } from "lucide-react";

const AttendanceTrendChart: React.FC = () => {
  const { attendanceLogs } = useData();
  
  // Process attendance data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const chartData = last7Days.map(date => {
    const dayString = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateString = date.toDateString();

    const dayLogs = attendanceLogs.filter(log => 
      new Date(log.timestamp).toDateString() === dateString
    );

    const students = dayLogs.filter(log => 
      log.userRole === "student" && log.action === "time-in"
    ).length;

    const teachers = dayLogs.filter(log => 
      log.userRole === "teacher" && log.action === "time-in"
    ).length;

    return {
      name: dayString,
      students,
      teachers,
    };
  });

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border-none">
      <div className="absolute h-1 w-full bg-gradient-to-r from-primary to-blue-600"></div>
      <CardHeader className="pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Weekly Attendance Trend
          </CardTitle>
        </div>
        <CardDescription>Attendance patterns over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={12} tickMargin={10} />
              <YAxis fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Bar dataKey="students" name="Students" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="teachers" name="Teachers" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTrendChart;
