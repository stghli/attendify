
import React from "react";
import { QrCode, UserPlus, Bell, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAttendance } from "@/context/attendance/AttendanceContext";
import { useSmsNotifications } from "@/context/sms/SmsContext";
import { useStudents } from "@/context/students/StudentsContext";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

interface QuickActionsProps {
  userRole: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { recordAttendance } = useAttendance();
  const { addSmsLog } = useSmsNotifications();
  const { students } = useStudents();
  const { profile: user } = useUserProfile();

  const handleQrScan = () => {
    navigate('/app/qr-scanner');
  };

  const handleAddStudent = () => {
    navigate('/app/students');
  };

  const handleSendAlert = () => {
    // Send alert to all parents
    const currentTime = new Date().toLocaleTimeString();
    const alertMessage = `Important Alert: Please ensure your child arrives on time for school. Sent at ${currentTime}`;
    
    let sentCount = 0;
    students.forEach(student => {
      if (student.parentPhone) {
        addSmsLog({
          studentId: student.id,
          studentName: student.name,
          parentPhone: student.parentPhone,
          message: alertMessage,
        });
        sentCount++;
      }
    });

    toast({
      title: "Alert Sent Successfully",
      description: `Alert sent to ${sentCount} parent${sentCount !== 1 ? 's' : ''}`,
    });
  };

  const handleMyStudents = () => {
    navigate('/app/my-students');
  };

  const handleMarkPresent = () => {
    // For teachers to mark their students present
    if (!user || user.role !== 'teacher') return;

    // This would typically open a dialog to select students to mark present
    // For now, we'll show a toast indicating the feature
    toast({
      title: "Mark Present Feature",
      description: "This will open a dialog to mark your students as present. Feature coming soon!",
    });
  };

  const handleViewRecords = () => {
    navigate('/app/attendance');
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <Button 
        variant="outline" 
        className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 sm:gap-3 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={handleQrScan}
      >
        <div className="bg-blue-100 p-2 sm:p-3 rounded-full shadow-md">
          <QrCode className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
        </div>
        <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">Scan QR Code</span>
      </Button>

      {userRole === "admin" && (
        <>
          <Button 
            variant="outline"
            className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 sm:gap-3 border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={handleAddStudent}
          >
            <div className="bg-emerald-100 p-2 sm:p-3 rounded-full shadow-md">
              <UserPlus className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">Add Student</span>
          </Button>

          <Button 
            variant="outline"
            className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 sm:gap-3 border-2 border-dashed border-pink-300 hover:border-pink-500 hover:bg-pink-50 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={handleSendAlert}
          >
            <div className="bg-pink-100 p-2 sm:p-3 rounded-full shadow-md">
              <Bell className="h-4 w-4 sm:h-6 sm:w-6 text-pink-600" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">Send Alert</span>
          </Button>
        </>
      )}

      {userRole === "teacher" && (
        <>
          <Button 
            variant="outline"
            className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 sm:gap-3 border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={handleMyStudents}
          >
            <div className="bg-purple-100 p-2 sm:p-3 rounded-full shadow-md">
              <UserPlus className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">My Students</span>
          </Button>

          <Button 
            variant="outline"
            className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 sm:gap-3 border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={handleMarkPresent}
          >
            <div className="bg-amber-100 p-2 sm:p-3 rounded-full shadow-md">
              <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">Mark Present</span>
          </Button>
        </>
      )}

      <Button 
        variant="outline" 
        className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 sm:gap-3 border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={handleViewRecords}
      >
        <div className="bg-indigo-100 p-2 sm:p-3 rounded-full shadow-md">
          <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-indigo-600" />
        </div>
        <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">View Records</span>
      </Button>
    </div>
  );
};

export default QuickActions;
