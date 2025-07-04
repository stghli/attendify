import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, GraduationCap, User } from "lucide-react";
import { useStudents } from "@/context/students/StudentsContext";
import { useTeachers } from "@/context/teachers/TeachersContext";
interface StatisticsCardsProps {
  totalAttendees: number;
  teachers: number;
  students: number;
  totalCheckedIn: number;
  checkedInTeachers: number;
  checkedInStudents: number;
  notCheckedInTeachers: number;
  notCheckedInStudents: number;
}
const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalAttendees,
  teachers,
  students,
  totalCheckedIn,
  checkedInTeachers,
  checkedInStudents,
  notCheckedInTeachers,
  notCheckedInStudents
}) => {
  const {
    teachers: teachersList
  } = useTeachers();
  const {
    students: studentsList
  } = useStudents();
  return <div className="space-y-4">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="shadow-md border-0 bg-gray-100">
          <CardContent className="p-4 sm:p-6 text-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalAttendees}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Attendees</div>
            <div className="text-xs text-gray-500 mt-1">
              {teachersList.length} Teachers • {studentsList.length} Students
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-0 bg-green-50">
          <CardContent className="p-4 sm:p-6 text-center">
            <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-2xl sm:text-3xl font-bold text-green-700">{totalCheckedIn}</div>
            <div className="text-xs sm:text-sm text-green-600 font-medium">Checked In</div>
            <div className="text-xs text-green-600 mt-1">
              {checkedInTeachers} Teachers • {checkedInStudents} Students
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-0 bg-orange-50">
          <CardContent className="p-4 sm:p-6 text-center">
            <UserX className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-2xl sm:text-3xl font-bold text-orange-700">{totalAttendees - totalCheckedIn}</div>
            <div className="text-xs sm:text-sm text-orange-600 font-medium">Not Checked</div>
            <div className="text-xs text-orange-600 mt-1">
              {notCheckedInTeachers} Teachers • {notCheckedInStudents} Students
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Lists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Teachers List */}
        

        {/* Students List */}
        <Card className="shadow-md border-0 bg-purple-50">
          
        </Card>
      </div>
    </div>;
};
export default StatisticsCards;