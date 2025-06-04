
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
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 border border-white/50 shadow-xl hover:shadow-2xl hover:scale-105 rounded-2xl relative group">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ 
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          borderRadius: 'inherit'
        }}
      ></div>
      
      {/* Top accent bar */}
      <div 
        className="absolute h-2 w-full" 
        style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
      ></div>
      
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 pt-8 relative z-10">
        <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={cn(`inline-flex items-center justify-center rounded-xl ${iconBgColor} p-3 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`)}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pb-6">
        <div className="text-4xl font-black mb-3 tracking-tight text-gray-900 group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
          {value}
        </div>
        {subtitle && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 font-medium">
              {subtitleHighlight && (
                <span className={`font-bold ${subtitleHighlight.color} text-lg`}>
                  {subtitleHighlight.value}{" "}
                </span>
              )}
              {subtitle}
            </p>
            {badgeText && (
              <Badge variant="outline" className={cn(`${badgeBgClass} text-xs font-bold px-3 py-1 rounded-full border-2`)}>
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
