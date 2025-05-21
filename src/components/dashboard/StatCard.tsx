
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

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
    <Card className="overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-200 border-none">
      <div 
        className="absolute h-1 w-full" 
        style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
      ></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className={`inline-flex items-center justify-center rounded-lg ${iconBgColor} p-2`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        {subtitle && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {subtitleHighlight && (
                <span className={`font-medium ${subtitleHighlight.color}`}>
                  {subtitleHighlight.value}{" "}
                </span>
              )}
              {subtitle}
            </p>
            {badgeText && (
              <Badge variant="outline" className={badgeBgClass}>
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
