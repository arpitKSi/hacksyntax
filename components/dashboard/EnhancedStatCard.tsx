import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface EnhancedStatCardProps {
  icon: LucideIcon
  title: string
  value: number | string
  subtitle?: string
  color: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function EnhancedStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  trend
}: EnhancedStatCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-400 font-normal text-xs">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}
