
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Monitor, Eye, EyeOff, Settings, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LandingPageControl: React.FC = () => {
  const [isLandingEnabled, setIsLandingEnabled] = useState(true);
  const [accessCode] = useState("9768");
  const navigate = useNavigate();

  const handleToggleLanding = () => {
    setIsLandingEnabled(!isLandingEnabled);
    toast.success(`Landing page ${!isLandingEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleViewLanding = () => {
    navigate("/landing");
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Monitor className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Landing Page Control</CardTitle>
            <p className="text-sm text-muted-foreground">Manage public access to QR scanner</p>
          </div>
        </div>
        <Badge 
          variant={isLandingEnabled ? "default" : "secondary"}
          className={isLandingEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
        >
          {isLandingEnabled ? "Active" : "Disabled"}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Public Access</p>
            <p className="text-sm text-muted-foreground">
              Allow public users to access the QR scanner landing page
            </p>
          </div>
          <Switch 
            checked={isLandingEnabled} 
            onCheckedChange={handleToggleLanding}
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Access Code</p>
              <p className="text-sm text-muted-foreground">Current event access code</p>
            </div>
            <Badge variant="outline" className="font-mono text-lg px-3 py-1">
              {accessCode}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewLanding}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Landing Page
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        {!isLandingEnabled && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-800 font-medium">
                Landing page is currently disabled
              </p>
            </div>
            <p className="text-xs text-orange-700 mt-1">
              Public users cannot access the QR scanner until you enable it again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LandingPageControl;
