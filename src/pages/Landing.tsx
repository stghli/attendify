
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QrScanner from "@/components/QrScanner";
import { Key, LogIn, ArrowLeft, Users, UserCheck, UserX, GraduationCap } from "lucide-react";

const Landing: React.FC = () => {
  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time components
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Dark Background with QR Scanner */}
      <div className="lg:w-1/2 bg-slate-800 flex flex-col items-center justify-center p-8 relative">
        {/* Admin Login Button */}
        <div className="absolute top-6 left-6">
          <Button asChild variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Admin Login
            </Link>
          </Button>
        </div>

        {/* Back to Code Entry Button */}
        <div className="absolute top-6 right-6">
          <Button asChild variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Link to="/code-entry">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Change Code
            </Link>
          </Button>
        </div>

        {/* Current Time Display */}
        <div className="text-center mb-8">
          <p className="text-white/70 text-sm mb-4 flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            Current Time
          </p>
          <div className="flex items-center justify-center gap-4 text-white font-mono">
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold">
                {displayHours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-white/60 mt-1">Hours</div>
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-white/60">:</div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold">
                {minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-white/60 mt-1">Minutes</div>
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-white/60">:</div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold">
                {seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-white/60 mt-1">Seconds</div>
            </div>
            <div className="text-center ml-4">
              <div className="text-3xl lg:text-4xl font-bold">
                {ampm}
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner */}
        <div className="w-full max-w-sm">
          <QrScanner />
        </div>
      </div>

      {/* Right Side - Light Background with Event Info */}
      <div className="lg:w-1/2 bg-gray-50 flex flex-col justify-center p-8">
        {/* Event Card */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Date Icon */}
              <div className="bg-pink-500 text-white rounded-lg p-3 text-center min-w-[80px]">
                <div className="text-xs font-medium">JUNE</div>
                <div className="text-2xl font-bold">01</div>
              </div>
              
              {/* Event Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-5 w-5 text-yellow-500" />
                  <span className="text-3xl font-bold text-blue-600">9768</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Sunday Service</h2>
                <p className="text-gray-600 text-lg">7:30 AM - 12:30 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-md border-0 bg-gray-100">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">670</div>
              <div className="text-sm text-gray-600 font-medium">Attendees</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0 bg-green-50">
            <CardContent className="p-6 text-center">
              <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-700">136</div>
              <div className="text-sm text-green-600 font-medium">Checked In</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0 bg-orange-50">
            <CardContent className="p-6 text-center">
              <UserX className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-orange-700">534</div>
              <div className="text-sm text-orange-600 font-medium">Not Checked</div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-blue-50">
            <CardContent className="p-6 text-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-700">8</div>
              <div className="text-sm text-blue-600 font-medium">Teachers In</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
          <p>Use Mobile or Web App to record your attendance.</p>
          <p>Contact branch administrators if you need any assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
