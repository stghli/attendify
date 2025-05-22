
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  FileBarChart, 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  Filter, 
  PieChart,
  Clock,
  Building,
  ArrowUpRight
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ReportsPage: React.FC = () => {
  const { students, teachers, attendanceLogs } = useData();
  const [activeTab, setActiveTab] = useState("attendance");
  const [timeRange, setTimeRange] = useState("this-week");

  // Calculate statistics
  const studentCount = students.length;
  const teacherCount = teachers.length;
  
  const todayAttendance = attendanceLogs.filter(
    log => new Date(log.timestamp).toDateString() === new Date().toDateString() 
      && log.action === "time-in"
  );

  const studentsPresent = todayAttendance.filter(log => log.userRole === "student").length;
  const teachersPresent = todayAttendance.filter(log => log.userRole === "teacher").length;
  
  const studentAttendanceRate = studentCount > 0 ? Math.round((studentsPresent / studentCount) * 100) : 0;
  const teacherAttendanceRate = teacherCount > 0 ? Math.round((teachersPresent / teacherCount) * 100) : 0;

  // Sample data for charts
  const attendanceByWeekday = [
    { name: "Mon", students: 42, teachers: 8 },
    { name: "Tue", students: 38, teachers: 7 },
    { name: "Wed", students: 45, teachers: 9 },
    { name: "Thu", students: 40, teachers: 8 },
    { name: "Fri", students: 35, teachers: 6 }
  ];

  const attendanceByClass = [
    { name: 'Class 1A', count: 22, rate: 92 },
    { name: 'Class 2B', count: 18, rate: 86 },
    { name: 'Class 3C', count: 24, rate: 96 },
    { name: 'Class 4D', count: 16, rate: 80 }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
  
  const pieData = [
    { name: 'On Time', value: 75 },
    { name: 'Late', value: 15 },
    { name: 'Absent', value: 10 },
  ];

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col mb-8">
        <div className="flex items-center mb-3">
          <div className="bg-blue-100 p-2.5 rounded-lg mr-3">
            <FileBarChart className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Attendance Reports
          </h1>
        </div>
        <p className="text-muted-foreground">
          Generate and analyze attendance reports for students and teachers
        </p>
      </div>

      {/* Report Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="attendance" className="flex items-center gap-1.5">
              <BarChart className="h-4 w-4" /> Attendance
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Students
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-1.5">
              <Building className="h-4 w-4" /> Teachers
            </TabsTrigger>
            <TabsTrigger value="timeliness" className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Timeliness
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="flex items-center gap-1.5">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          
          <Button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="bg-white shadow-lg border-none rounded-xl overflow-hidden">
          <div className="h-1.5 w-full bg-blue-500" />
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <h3 className="text-3xl font-bold mt-1">{studentCount}</h3>
                <p className="text-sm text-muted-foreground mt-1">Registered in system</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-none rounded-xl overflow-hidden">
          <div className="h-1.5 w-full bg-purple-500" />
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
                <h3 className="text-3xl font-bold mt-1">{studentsPresent}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center">
                  {studentAttendanceRate}% Present
                  <span className="inline-flex items-center text-green-600 ml-2">
                    <ArrowUpRight className="h-3 w-3" /> 4%
                  </span>
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-none rounded-xl overflow-hidden">
          <div className="h-1.5 w-full bg-green-500" />
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teachers</p>
                <h3 className="text-3xl font-bold mt-1">{teacherCount}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {teachersPresent} present today ({teacherAttendanceRate}%)
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-none rounded-xl overflow-hidden">
          <div className="h-1.5 w-full bg-amber-500" />
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rate</p>
                <h3 className="text-3xl font-bold mt-1">86%</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center">
                  Monthly attendance
                  <span className="inline-flex items-center text-green-600 ml-2">
                    <ArrowUpRight className="h-3 w-3" /> 2.4%
                  </span>
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              Weekly Attendance Summary
            </CardTitle>
            <CardDescription>Attendance by weekday</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  data={attendanceByWeekday}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="students" name="Students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="teachers" name="Teachers" fill="#10b981" radius={[4, 4, 0, 0]} />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Attendance Distribution
            </CardTitle>
            <CardDescription>On time vs late vs absent</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class-wise attendance */}
      <Card className="shadow-lg border-none mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5 text-green-600" />
            Class-wise Attendance
          </CardTitle>
          <CardDescription>Attendance rates by class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Class</th>
                  <th className="text-left py-3 px-4">Students</th>
                  <th className="text-left py-3 px-4">Present</th>
                  <th className="text-left py-3 px-4">Absent</th>
                  <th className="text-left py-3 px-4">Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {attendanceByClass.map((cls, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{cls.name}</td>
                    <td className="py-3 px-4">{cls.count}</td>
                    <td className="py-3 px-4 text-green-600">{Math.round(cls.count * (cls.rate / 100))}</td>
                    <td className="py-3 px-4 text-red-500">{cls.count - Math.round(cls.count * (cls.rate / 100))}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 w-24 h-2 rounded-full">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${cls.rate}%` }}
                          ></div>
                        </div>
                        <span>{cls.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-4">
          <Button variant="outline" className="flex items-center gap-1.5">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportsPage;
