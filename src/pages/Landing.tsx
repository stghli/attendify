
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Key, LogIn, ArrowLeft, Users, UserCheck, UserX } from "lucide-react";

const Landing: React.FC = () => {
  // Timer state - starts from 1 hour 7 minutes 30 seconds
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 7,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Dark Background with QR Code */}
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

        {/* Expires Timer */}
        <div className="text-center mb-8">
          <p className="text-white/70 text-sm mb-4 flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            Expires in
          </p>
          <div className="flex items-center justify-center gap-4 text-white font-mono">
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-white/60 mt-1">Hours</div>
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-white/60">:</div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-white/60 mt-1">Minutes</div>
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-white/60">:</div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-white/60 mt-1">Seconds</div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl">
          <QRCodeSVG 
            value="attendance-qr-9768-sunday-service"
            size={250}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      {/* Right Side - Light Background with Event Info */}
      <div className="lg:w-1/2 bg-gray-50 flex flex-col justify-center p-8">
        {/* Dashboard Link */}
        <div className="absolute top-6 right-6 lg:static lg:mb-8">
          <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Link to="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
