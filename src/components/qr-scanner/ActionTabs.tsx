
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, LogOut } from "lucide-react";

interface ActionTabsProps {
  selectedAction: "time-in" | "time-out";
  onActionChange: (action: "time-in" | "time-out") => void;
}

const ActionTabs: React.FC<ActionTabsProps> = ({ selectedAction, onActionChange }) => {
  return (
    <Tabs 
      defaultValue="time-in" 
      value={selectedAction} 
      onValueChange={(value) => onActionChange(value as "time-in" | "time-out")}
      className="w-full mb-5"
    >
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="time-in" className="flex items-center gap-1.5">
          <LogIn className="h-4 w-4" />
          Check In
        </TabsTrigger>
        <TabsTrigger value="time-out" className="flex items-center gap-1.5">
          <LogOut className="h-4 w-4" />
          Check Out
        </TabsTrigger>
      </TabsList>
      <TabsContent value="time-in" className="mt-3 text-center text-sm text-muted-foreground">
        Students and teachers will be marked as present
      </TabsContent>
      <TabsContent value="time-out" className="mt-3 text-center text-sm text-muted-foreground">
        Students and teachers will be marked as departed
      </TabsContent>
    </Tabs>
  );
};

export default ActionTabs;
