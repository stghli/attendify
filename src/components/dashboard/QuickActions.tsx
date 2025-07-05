
import React from "react";
import { QrCode, UserPlus, Bell, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  userRole: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <Button 
        variant="outline" 
        className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 sm:gap-3 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={() => window.location.href = '/qr-scanner'}
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
            onClick={() => window.location.href = '/students'}
          >
            <div className="bg-emerald-100 p-2 sm:p-3 rounded-full shadow-md">
              <UserPlus className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">Add Student</span>
          </Button>

          <Button 
            variant="outline"
            className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 sm:gap-3 border-2 border-dashed border-pink-300 hover:border-pink-500 hover:bg-pink-50 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
            onClick={() => window.location.href = '/my-students'}
          >
            <div className="bg-purple-100 p-2 sm:p-3 rounded-full shadow-md">
              <UserPlus className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">My Students</span>
          </Button>

          <Button 
            variant="outline"
            className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 sm:gap-3 border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
        onClick={() => window.location.href = '/attendance'}
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
