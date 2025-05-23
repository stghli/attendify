
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
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-none rounded-xl relative group">
      {/* Hover effect gradient background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}10)`,
          borderRadius: 'inherit'
        }}
      ></div>
      
      {/* Top color bar */}
      <div 
        className="absolute h-1.5 w-full" 
        style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
      ></div>
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6 relative z-10">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className={cn(`inline-flex items-center justify-center rounded-xl ${iconBgColor} p-2.5 shadow-sm transform group-hover:scale-110 transition-transform duration-300`)}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold mb-2 tracking-tight group-hover:transform group-hover:translate-x-1 transition-transform duration-300">{value}</div>
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
              <Badge variant="outline" className={cn(`${badgeBgClass} text-xs font-medium px-2 py-0.5`)}>
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
