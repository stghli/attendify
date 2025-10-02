
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  subtitle?: string;
  badgeText?: string;
  badgeBgClass?: string;
  subtitleHighlight?: {
    value: number | string;
    color: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  gradientFrom,
  gradientTo,
  subtitle,
  badgeText,
  badgeBgClass = "bg-primary/5",
  subtitleHighlight,
}) => {
  return (
    <Card className="border shadow-sm relative overflow-hidden group">
      {/* Subtle left accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", iconBgColor)} />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("inline-flex items-center justify-center rounded-lg", iconBgColor, "p-2.5")}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {value}
        </div>
        {subtitle && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              {subtitleHighlight && (
                <span className={`font-semibold ${subtitleHighlight.color}`}>
                  {subtitleHighlight.value}{" "}
                </span>
              )}
              {subtitle}
            </p>
            {badgeText && (
              <Badge variant="outline" className={cn(`${badgeBgClass} text-xs`)}>
                {badgeText}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
