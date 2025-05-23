
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, AlertCircle } from "lucide-react";

interface SmsLog {
  id: string;
  studentName: string;
  parentPhone: string;
  message: string;
  status: string;
  timestamp: string;
}

interface SmsNotificationsProps {
  logs: SmsLog[];
}

const SmsNotifications: React.FC<SmsNotificationsProps> = ({ logs }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-none rounded-xl">
      <div className="absolute h-1.5 w-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
      <CardHeader className="pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bell className="h-5 w-5 mr-2 text-pink-500" />
            SMS Notifications
          </CardTitle>
          <Badge variant="outline" className="bg-pink-50 text-pink-700 font-medium">
            {logs.length} sent
          </Badge>
        </div>
        <CardDescription>Recent notifications to parents</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
            <p className="text-muted-foreground">No SMS logs yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-auto pr-2 custom-scrollbar">
            {logs.slice(0, 7).map((log) => (
              <div key={log.id} className="flex items-center justify-between border-b pb-3 last:border-0 hover:bg-muted/20 p-2 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-sm
                    ${log.status === 'delivered' ? 'bg-green-100' : 'bg-amber-100'}`}>
                    {log.status === 'delivered' ? 
                      <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
                      <Bell className="h-5 w-5 text-amber-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">{log.studentName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {log.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      To: {log.parentPhone}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-right font-medium">
                    {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p className="text-xs text-muted-foreground text-right capitalize">
                    {log.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmsNotifications;
