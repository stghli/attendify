
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { useData } from "@/context/DataContext";
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
      total: students + teachers
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
    <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-none bg-white rounded-xl">
      <div className="absolute h-1.5 w-full bg-gradient-to-r from-primary via-blue-500 to-purple-500"></div>
      <CardHeader className="pt-6 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Attendance Analytics
              </CardTitle>
              <CardDescription className="flex items-center mt-0.5">
                Weekly attendance patterns 
                {trend !== 0 && (
                  <div className={`ml-2 flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="text-sm font-medium flex items-center">
                      {trend > 0 ? (
                        <>+{trend}% <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" /></>
                      ) : (
                        <>{trend}% <ArrowDownRight className="h-3.5 w-3.5 ml-0.5" /></>
                      )}
                    </span>
                  </div>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">Last 7 days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
            <p className="text-xs text-blue-700">Total Present</p>
            <p className="text-2xl font-bold text-blue-800">{chartData.reduce((sum, day) => sum + day.total, 0)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg px-4 py-3 border border-purple-100">
            <p className="text-xs text-purple-700">Students</p>
            <p className="text-2xl font-bold text-purple-800">{chartData.reduce((sum, day) => sum + day.students, 0)}</p>
          </div>
          <div className="bg-green-50 rounded-lg px-4 py-3 border border-green-100">
            <p className="text-xs text-green-700">Teachers</p>
            <p className="text-2xl font-bold text-green-800">{chartData.reduce((sum, day) => sum + day.teachers, 0)}</p>
          </div>
        </div>
      
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
              barGap={0}
              barCategoryGap={16}
            >
              <defs>
                <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="teacherGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
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
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
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
                iconSize={8}
              />
              <Bar 
                dataKey="students" 
                name="Students" 
                fill="url(#studentGradient)" 
                radius={[4, 4, 0, 0]}
                barSize={24}
                animationDuration={1500}
              />
              <Bar 
                dataKey="teachers" 
                name="Teachers" 
                fill="url(#teacherGradient)" 
                radius={[4, 4, 0, 0]}
                barSize={24}
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
