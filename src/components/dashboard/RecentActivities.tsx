
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, Bell, Clock, MessageSquare } from "lucide-react";

interface ActivityLog {
  id: string;
  timestamp: string;
  [key: string]: any;
}

interface RecentActivitiesProps {
  logs: ActivityLog[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ logs }) => {
  const getActivityDetails = (log: ActivityLog) => {
    // Attendance log
    if ('userId' in log && 'action' in log) {
      return {
        icon: log.action === 'time-in' ? CheckCircle2 : Clock,
        iconBg: log.action === 'time-in' ? 'bg-green-100' : 'bg-amber-100',
        iconColor: log.action === 'time-in' ? 'text-green-600' : 'text-amber-600',
        title: `${log.userName} ${log.action.replace('-', ' ')}`,
        description: `${log.userRole} attendance recorded`,
        badge: log.action === 'time-in' ? 'Check In' : 'Check Out',
        badgeColor: log.action === 'time-in' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700',
      };
    }
    
    // SMS log
    if ('studentName' in log && 'message' in log) {
      return {
        icon: Bell,
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600',
        title: `SMS to ${log.studentName}'s parent`,
        description: log.message.length > 50 ? `${log.message.substring(0, 50)}...` : log.message,
        badge: log.status,
        badgeColor: log.status === 'delivered' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700',
      };
    }
    
    // Default fallback
    return {
      icon: MessageSquare,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      title: 'Activity',
      description: 'System activity recorded',
      badge: 'Info',
      badgeColor: 'bg-gray-50 text-gray-700',
    };
  };
  
  return (
    <Card className="border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          <Badge variant="outline">
            {logs.length}
          </Badge>
        </div>
        <CardDescription>Latest system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-auto">
          {logs.map((log) => {
            const { icon: Icon, iconBg, iconColor, title, description, badge, badgeColor } = getActivityDetails(log);
            
            return (
              <div key={log.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${iconBg}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={`${badgeColor} text-xs`}>
                    {badge}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          
          {logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
              <p className="text-muted-foreground">No recent activities</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
