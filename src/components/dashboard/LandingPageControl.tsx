import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Monitor, EyeOff, Settings, ExternalLink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLandingPageSettings } from "@/hooks/useLandingPageSettings";
import { useAccessCodes } from "@/hooks/useAccessCodes";

const LandingPageControl: React.FC = () => {
  const navigate = useNavigate();
  const { settings, isLoading, updateSettings } = useLandingPageSettings();
  const { accessCodes, isLoading: codesLoading } = useAccessCodes();

  const handleToggleLanding = () => {
    if (settings) {
      updateSettings({ is_enabled: !settings.is_enabled });
    }
  };

  const handleViewLanding = () => {
    navigate("/landing");
  };

  if (isLoading || codesLoading) {
    return (
      <Card className="border rounded-lg p-6 bg-card shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  const isLandingEnabled = settings?.is_enabled ?? true;
  const activeCode = accessCodes?.[0]?.code || "No active code";

  return (
    <Card className="border rounded-lg p-6 bg-card shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-1 w-8 bg-primary rounded-full" />
        <h3 className="text-lg font-semibold">Landing Page Control</h3>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Manage public access to QR scanner</p>
        </div>
        <Badge 
          variant={isLandingEnabled ? "default" : "secondary"}
          className={isLandingEnabled ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
        >
          {isLandingEnabled ? "Active" : "Disabled"}
        </Badge>
      </div>
      
      <div className="space-y-4">
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
            <Badge variant="outline" className="font-mono text-lg px-3 py-1 bg-primary/5">
              {activeCode}
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
      </div>
    </Card>
  );
};

export default LandingPageControl;
