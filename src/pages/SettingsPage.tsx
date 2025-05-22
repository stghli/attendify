
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Shield, Smartphone, Globe, Mail } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const user = authState.user;
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    push: false,
    attendance: true,
    systemUpdates: true,
  });

  const handleNotificationChange = (settingName: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName as keyof typeof prev]
    }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <Card>
            <CardContent className="p-4">
              <Tabs 
                defaultValue="general" 
                orientation="vertical" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto items-stretch bg-transparent space-y-1">
                  <TabsTrigger 
                    value="general"
                    className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    General
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications"
                    className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security"
                    className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-3/4">
          <TabsContent value="general" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your basic account settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={user.role} disabled />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">System Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="theme" className="text-base">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable dark mode for the application
                        </p>
                      </div>
                      <Switch id="theme" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="timezone" className="text-base">Automatic Timezone</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically set timezone based on location
                        </p>
                      </div>
                      <Switch id="timezone" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={notificationSettings.email}
                        onCheckedChange={() => handleNotificationChange('email')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <div>
                          <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via SMS
                          </p>
                        </div>
                      </div>
                      <Switch 
                        id="sms-notifications" 
                        checked={notificationSettings.sms}
                        onCheckedChange={() => handleNotificationChange('sms')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Globe className="w-5 h-5 text-primary" />
                        <div>
                          <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications
                          </p>
                        </div>
                      </div>
                      <Switch 
                        id="push-notifications" 
                        checked={notificationSettings.push}
                        onCheckedChange={() => handleNotificationChange('push')}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Event Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="attendance-notifications" className="text-base">Attendance Events</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when students check in or out
                        </p>
                      </div>
                      <Switch 
                        id="attendance-notifications" 
                        checked={notificationSettings.attendance}
                        onCheckedChange={() => handleNotificationChange('attendance')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-notifications" className="text-base">System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify about system updates and maintenance
                        </p>
                      </div>
                      <Switch 
                        id="system-notifications" 
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={() => handleNotificationChange('systemUpdates')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor" className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="session-timeout" className="text-base">Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out after period of inactivity
                        </p>
                      </div>
                      <Switch id="session-timeout" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
