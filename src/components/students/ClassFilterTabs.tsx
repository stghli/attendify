
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Student } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClassFilterTabsProps {
  classes: string[];
  selectedClass: string;
  onSelectClass: (className: string) => void;
  studentsCount: Record<string, number>;
}

const ClassFilterTabs: React.FC<ClassFilterTabsProps> = ({
  classes,
  selectedClass,
  onSelectClass,
  studentsCount,
}) => {
  return (
    <Tabs value={selectedClass} onValueChange={onSelectClass} className="w-full">
      <ScrollArea className="w-full">
        <div className="flex w-full overflow-x-auto pb-2">
          <TabsList className="h-10 inline-flex min-w-max">
            <TabsTrigger value="all" className="px-4">
              All Classes
              <span className="ml-2 bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full">
                {Object.values(studentsCount).reduce((a, b) => a + b, 0)}
              </span>
            </TabsTrigger>
            
            {classes.map((cls) => (
              <TabsTrigger key={cls} value={cls} className="px-4">
                {cls}
                <span className="ml-2 bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full">
                  {studentsCount[cls] || 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </ScrollArea>
    </Tabs>
  );
};

export default ClassFilterTabs;
