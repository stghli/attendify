
import React from "react";
import { QrCode, UserPlus, Bell, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  userRole: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button 
        variant="outline" 
        className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-dashed hover:border-primary hover:bg-primary/5"
        onClick={() => window.location.href = '/qr-scanner'}
      >
        <div className="bg-primary/10 p-3 rounded-full">
          <QrCode className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm font-medium">Scan QR Code</span>
      </Button>

      {userRole === "admin" && (
        <>
          <Button 
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-dashed hover:border-green-500 hover:bg-green-50"
            onClick={() => window.location.href = '/students'}
          >
            <div className="bg-green-100 p-3 rounded-full">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium">Add Student</span>
          </Button>

          <Button 
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-dashed hover:border-pink-500 hover:bg-pink-50"
          >
            <div className="bg-pink-100 p-3 rounded-full">
              <Bell className="h-5 w-5 text-pink-600" />
            </div>
            <span className="text-sm font-medium">Send Notification</span>
          </Button>
        </>
      )}

      {userRole === "teacher" && (
        <>
          <Button 
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-dashed hover:border-violet-500 hover:bg-violet-50"
            onClick={() => window.location.href = '/my-students'}
          >
            <div className="bg-violet-100 p-3 rounded-full">
              <UserPlus className="h-5 w-5 text-violet-600" />
            </div>
            <span className="text-sm font-medium">My Students</span>
          </Button>

          <Button 
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-dashed hover:border-amber-500 hover:bg-amber-50"
          >
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium">Mark Attendance</span>
          </Button>
        </>
      )}

      <Button 
        variant="outline" 
        className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-dashed hover:border-blue-500 hover:bg-blue-50"
        onClick={() => window.location.href = '/attendance'}
      >
        <div className="bg-blue-100 p-3 rounded-full">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <span className="text-sm font-medium">View Records</span>
      </Button>
    </div>
  );
};

export default QuickActions;
