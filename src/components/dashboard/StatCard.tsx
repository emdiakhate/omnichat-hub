import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'secondary' | 'danger';
}

const colorClasses = {
  primary: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  secondary: 'text-secondary bg-secondary/10',
  danger: 'text-danger bg-danger/10',
};

export const StatCard = ({ title, value, trend, icon: Icon, color = 'primary' }: StatCardProps) => {
  return (
    <Card className="hover-lift card-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-danger" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  trend.direction === 'up' ? 'text-success' : 'text-danger'
                )}>
                  {trend.value}%
                </span>
                <span className="text-sm text-muted-foreground">vs hier</span>
              </div>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
