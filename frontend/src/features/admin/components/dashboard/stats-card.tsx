import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 통계 카드 Props
 */
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  valueColor?: string;
}

/**
 * 대시보드 통계 카드 컴포넌트
 */
export function StatsCard({
  title,
  value,
  subtitle,
  valueColor = "text-gray-900",
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
