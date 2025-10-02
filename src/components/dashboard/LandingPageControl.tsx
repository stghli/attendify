
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Monitor, EyeOff, Settings, ExternalLink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LandingPageControl: React.FC = () => {
  const [isLandingEnabled, setIsLandingEnabled] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Fetch landing page settings
  useEffect(() => {
    fetchSettings();
    fetchAccessCode();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_page_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setIsLandingEnabled(data.is_enabled);
      }
    } catch (error) {
      console.error('Error fetching landing page settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccessCode = async () => {
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .select('code')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setAccessCode(data.code);
      }
    } catch (error) {
      console.error('Error fetching access code:', error);
    }
  };

  const handleToggleLanding = async () => {
    setIsUpdating(true);
    try {
      const newStatus = !isLandingEnabled;
      
      // Get the settings ID first
      const { data: settings, error: fetchError } = await supabase
        .from('landing_page_settings')
        .select('id')
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('landing_page_settings')
        .update({ 
          is_enabled: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;

      setIsLandingEnabled(newStatus);
      toast.success(`Landing page ${newStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating landing page settings:', error);
      toast.error('Failed to update landing page settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewLanding = () => {
    navigate("/landing");
  };

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Monitor className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Landing Page Control</CardTitle>
            <p className="text-sm text-muted-foreground">Manage public access to QR scanner</p>
          </div>
        </div>
        <Badge 
          variant={isLandingEnabled ? "default" : "secondary"}
          className={isLandingEnabled ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
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
            disabled={isUpdating}
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Access Code</p>
              <p className="text-sm text-muted-foreground">Current event access code</p>
            </div>
            <Badge variant="outline" className="font-mono text-lg px-3 py-1">
              {accessCode || "No active code"}
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
