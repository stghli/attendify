
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface AttendanceSummaryProps {
  studentsCount: number;
  presentCount: number;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ studentsCount, presentCount }) => {
  const attendanceRate = studentsCount > 0 ? Math.round((presentCount / studentsCount) * 100) : 0;
  
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-none rounded-xl">
      <div className="absolute h-1.5 w-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
      <CardHeader className="pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-teal-500" />
            Attendance Summary
          </CardTitle>
          <Badge variant="outline" className="bg-teal-50 text-teal-700 font-medium">
            {studentsCount} students
          </Badge>
        </div>
        <CardDescription>Class attendance overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3 hover:bg-muted/10 p-2 rounded-lg transition-colors duration-200">
            <span className="font-medium">Present:</span>
            <span className="font-medium text-green-600">{presentCount} students</span>
          </div>
          <div className="flex items-center justify-between border-b pb-3 hover:bg-muted/10 p-2 rounded-lg transition-colors duration-200">
            <span className="font-medium">Absent:</span>
            <span className="font-medium text-rose-600">{studentsCount - presentCount} students</span>
          </div>
          <div className="flex items-center justify-between border-b pb-3 hover:bg-muted/10 p-2 rounded-lg transition-colors duration-200">
            <span className="font-medium">Attendance Rate:</span>
            <span className="font-medium">{attendanceRate}%</span>
          </div>
          <div className="mt-4">
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-700 ease-in-out" 
                style={{ width: `${attendanceRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceSummary;
