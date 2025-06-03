
export interface ScanHistoryItem {
  userId: string;
  name: string;
  role: "student" | "teacher";
  action: "time-in" | "time-out";
  timestamp: Date;
}
