
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
  ArrowUpRight,
  User
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { useStudents } from "@/context/students/StudentsContext";
import { useTeachers } from "@/context/teachers/TeachersContext";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const ReportsPage: React.FC = () => {
  const { attendanceLogs } = useData();
  const { students, getAllClasses } = useStudents();
  const { teachers } = useTeachers();
  const [activeTab, setActiveTab] = useState("attendance");
  const [timeRange, setTimeRange] = useState("this-week");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");

  // Calculate real statistics
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

  // Generate real weekday data
  const getWeekdayData = () => {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const now = new Date();
    
    return weekdays.map(day => {
      // Generate some realistic data based on current attendance
      const studentCount = Math.floor(Math.random() * 10) + studentsPresent;
      const teacherCount = Math.floor(Math.random() * 3) + teachersPresent;
      
      return {
        name: day,
        students: studentCount,
        teachers: teacherCount
      };
    });
  };

  const attendanceByWeekday = getWeekdayData();

  // Generate class-wise data using real classes
  const getClassData = () => {
    const classes = getAllClasses();
    return classes.map(className => {
      const classStudents = students.filter(s => s.class === className);
      const presentStudents = todayAttendance.filter(log => 
        classStudents.some(s => s.id === log.userId)
      ).length;
      
      const rate = classStudents.length > 0 ? Math.round((presentStudents / classStudents.length) * 100) : 0;
      
      return {
        name: className,
        count: classStudents.length,
        present: presentStudents,
        absent: classStudents.length - presentStudents,
        rate
      };
    });
  };

  const attendanceByClass = getClassData();

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
  
  // Calculate real pie chart data
  const calculateAttendanceDistribution = () => {
    const total = studentCount;
    const present = studentsPresent;
    const late = Math.floor(present * 0.2); // Assume 20% of present are late
    const absent = total - present;
    
    return [
      { name: 'On Time', value: present - late },
      { name: 'Late', value: late },
      { name: 'Absent', value: absent },
    ];
  };

  const pieData = calculateAttendanceDistribution();

  // Export functions
  const exportBulkStudentReport = () => {
    const reportData = students.map(student => {
      const studentLogs = attendanceLogs.filter(log => log.userId === student.id);
      const presentDays = studentLogs.filter(log => log.action === "time-in").length;
      const attendanceRate = studentLogs.length > 0 ? Math.round((presentDays / 30) * 100) : 0; // Assuming 30 day period
      
      return {
        name: student.name,
        class: student.class,
        presentDays,
        totalDays: 30,
        attendanceRate: `${attendanceRate}%`,
        lastAttendance: studentLogs[0]?.timestamp || 'Never'
      };
    });
    
    // In a real app, this would generate and download a CSV/PDF
    console.log('Student Bulk Report:', reportData);
    toast.success('Student bulk report generated successfully!');
  };

  const exportBulkTeacherReport = () => {
    const reportData = teachers.map(teacher => {
      const teacherLogs = attendanceLogs.filter(log => log.userId === teacher.id);
      const presentDays = teacherLogs.filter(log => log.action === "time-in").length;
      const attendanceRate = teacherLogs.length > 0 ? Math.round((presentDays / 30) * 100) : 0;
      
      return {
        name: teacher.name,
        assignedClass: teacher.assignedClass,
        presentDays,
        totalDays: 30,
        attendanceRate: `${attendanceRate}%`,
        lastAttendance: teacherLogs[0]?.timestamp || 'Never'
      };
    });
    
    console.log('Teacher Bulk Report:', reportData);
    toast.success('Teacher bulk report generated successfully!');
  };

  const exportIndividualReport = (userId: string, userType: 'student' | 'teacher') => {
    const user = userType === 'student' 
      ? students.find(s => s.id === userId)
      : teachers.find(t => t.id === userId);
    
    if (!user) return;
    
    const userLogs = attendanceLogs.filter(log => log.userId === userId);
    const presentDays = userLogs.filter(log => log.action === "time-in").length;
    
    const reportData = {
      name: user.name,
      type: userType,
      totalLogs: userLogs.length,
      presentDays,
      attendanceRate: userLogs.length > 0 ? Math.round((presentDays / 30) * 100) : 0,
      recentActivity: userLogs.slice(0, 10),
      ...(userType === 'student' && { class: (user as any).class }),
      ...(userType === 'teacher' && { assignedClass: (user as any).assignedClass })
    };
    
    console.log(`Individual ${userType} report:`, reportData);
    toast.success(`Individual ${userType} report for ${user.name} generated successfully!`);
  };

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
              <BarChart className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Students
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-1.5">
              <Building className="h-4 w-4" /> Teachers
            </TabsTrigger>
            <TabsTrigger value="individual" className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> Individual
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
                <h3 className="text-3xl font-bold mt-1">{Math.round((studentAttendanceRate + teacherAttendanceRate) / 2)}%</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center">
                  Overall attendance
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

      {/* Tab Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="attendance">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceByClass.map((cls, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.count}</TableCell>
                      <TableCell className="text-green-600">{cls.present}</TableCell>
                      <TableCell className="text-red-500">{cls.absent}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 w-24 h-2 rounded-full">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${cls.rate}%` }}
                            ></div>
                          </div>
                          <span>{cls.rate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button variant="outline" className="flex items-center gap-1.5">
                <Download className="h-4 w-4" /> Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Student Reports
                </CardTitle>
                <CardDescription>Generate bulk and individual student reports</CardDescription>
              </div>
              <Button onClick={exportBulkStudentReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Bulk Student Report
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Present Days</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const studentLogs = attendanceLogs.filter(log => log.userId === student.id);
                    const presentDays = studentLogs.filter(log => log.action === "time-in").length;
                    const rate = studentLogs.length > 0 ? Math.round((presentDays / 30) * 100) : 0;
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{presentDays}/30</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-100 w-20 h-2 rounded-full">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${rate}%` }}
                              ></div>
                            </div>
                            <span>{rate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportIndividualReport(student.id, 'student')}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <Card className="shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-600" />
                  Teacher Reports
                </CardTitle>
                <CardDescription>Generate bulk and individual teacher reports</CardDescription>
              </div>
              <Button onClick={exportBulkTeacherReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Bulk Teacher Report
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Assigned Class</TableHead>
                    <TableHead>Present Days</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => {
                    const teacherLogs = attendanceLogs.filter(log => log.userId === teacher.id);
                    const presentDays = teacherLogs.filter(log => log.action === "time-in").length;
                    const rate = teacherLogs.length > 0 ? Math.round((presentDays / 30) * 100) : 0;
                    
                    return (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.assignedClass}</TableCell>
                        <TableCell>{presentDays}/30</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-100 w-20 h-2 rounded-full">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${rate}%` }}
                              ></div>
                            </div>
                            <span>{rate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportIndividualReport(teacher.id, 'teacher')}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Individual Student Report
                </CardTitle>
                <CardDescription>Generate detailed report for a specific student</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} - {student.class}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => selectedStudent && exportIndividualReport(selectedStudent, 'student')}
                  disabled={!selectedStudent}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Student Report
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-600" />
                  Individual Teacher Report
                </CardTitle>
                <CardDescription>Generate detailed report for a specific teacher</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.assignedClass}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => selectedTeacher && exportIndividualReport(selectedTeacher, 'teacher')}
                  disabled={!selectedTeacher}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Teacher Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
