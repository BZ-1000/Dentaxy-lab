import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar } from 'lucide-react';

const outcomeStats = [
  { label: 'Shopping', percentage: 52, color: 'bg-blue-500' },
  { label: 'Electronics', percentage: 21, color: 'bg-green-500' },
  { label: 'Travels', percentage: 74, color: 'bg-purple-500' },
];

export const OutcomeStatsSection = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
          Outcome statistics
          <Calendar size={12} className="ml-auto text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-2 space-y-2">
        {outcomeStats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">{stat.label}</span>
              <span className="text-xs font-bold text-gray-900">{stat.percentage}%</span>
            </div>
            <Progress value={stat.percentage} className="h-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};