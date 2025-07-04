
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Clock } from "lucide-react";

interface EventCardProps {
  currentTime: Date;
}

const EventCard: React.FC<EventCardProps> = ({ currentTime }) => {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const currentMonth = monthNames[currentTime.getMonth()];
  const currentDate = currentTime.getDate().toString().padStart(2, '0');

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = dayNames[currentTime.getDay()];

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="bg-pink-500 text-white rounded-lg p-2 sm:p-3 text-center min-w-[60px] sm:min-w-[80px]">
            <div className="text-xs font-medium">{currentMonth}</div>
            <div className="text-lg sm:text-2xl font-bold">{currentDate}</div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">9768</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{currentDay}</h2>
            <div className="flex items-center gap-2 text-sm sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <span className="text-gray-600 font-mono">
                {displayHours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')} {ampm}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
