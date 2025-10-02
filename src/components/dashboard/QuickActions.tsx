
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Button 
        variant="outline" 
        className="h-24 flex flex-col items-center justify-center gap-2"
        onClick={handleQrScan}
      >
        <QrCode className="h-5 w-5" />
        <span className="text-sm font-medium">Scan QR Code</span>
      </Button>

      {userRole === "admin" && (
        <>
          <Button 
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={handleAddStudent}
          >
            <UserPlus className="h-5 w-5" />
            <span className="text-sm font-medium">Add Student</span>
          </Button>

          <Button 
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={handleSendAlert}
          >
            <Bell className="h-5 w-5" />
            <span className="text-sm font-medium">Send Alert</span>
          </Button>
        </>
      )}

      {userRole === "teacher" && (
        <>
          <Button 
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={handleMyStudents}
          >
            <UserPlus className="h-5 w-5" />
            <span className="text-sm font-medium">My Students</span>
          </Button>

          <Button 
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={handleMarkPresent}
          >
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Mark Present</span>
          </Button>
        </>
      )}

      <Button 
        variant="outline" 
        className="h-24 flex flex-col items-center justify-center gap-2"
        onClick={handleViewRecords}
      >
        <Calendar className="h-5 w-5" />
        <span className="text-sm font-medium">View Records</span>
      </Button>
    </div>
  );
};

export default QuickActions;
