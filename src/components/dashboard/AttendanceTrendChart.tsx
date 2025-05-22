
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useData } from "@/context/DataContext";
import { TrendingUp, Calendar } from "lucide-react";

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

  // Calculate the week's trend
  const currentWeekAttendance = chartData.reduce((sum, day) => sum + day.students, 0);
  const previousWeek = attendanceLogs
    .filter(log => {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 3600 * 24));
      return daysDiff >= 7 && daysDiff < 14 && log.userRole === "student" && log.action === "time-in";
    })
    .length;
  
  const trend = previousWeek > 0 
    ? Math.round(((currentWeekAttendance - previousWeek) / previousWeek) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-none bg-white">
      <div className="absolute h-1 w-full bg-gradient-to-r from-primary via-blue-500 to-purple-500"></div>
      <CardHeader className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Weekly Attendance Trend
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last 7 days</span>
          </div>
        </div>
        <CardDescription className="flex items-center mt-1">
          Attendance patterns {trend !== 0 && (
            <div className={`ml-2 flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-sm font-medium">
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
              <TrendingUp className={`h-4 w-4 ml-1 ${trend > 0 ? '' : 'rotate-180'}`} />
            </div>
          )}
        </CardDescription>
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
              <defs>
                <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="teacherGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                fontSize={12} 
                tickMargin={10} 
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                fontSize={12} 
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fill: '#6b7280' }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', 
                  border: 'none',
                  padding: '12px'
                }} 
                cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }} 
                iconType="circle"
                iconSize={10}
              />
              <Bar 
                dataKey="students" 
                name="Students" 
                fill="url(#studentGradient)" 
                radius={[4, 4, 0, 0]}
                barSize={30}
                animationDuration={1500}
              />
              <Bar 
                dataKey="teachers" 
                name="Teachers" 
                fill="url(#teacherGradient)" 
                radius={[4, 4, 0, 0]}
                barSize={30}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTrendChart;
