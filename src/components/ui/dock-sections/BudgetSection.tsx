import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

const productivityData = [
  { name: 'Ene', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 25 },
  { name: 'Abr', value: 22 },
  { name: 'May', value: 30 },
  { name: 'Jun', value: 28 },
  { name: 'Jul', value: 35 },
];

export const BudgetSection = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">5</span>
          Budget
          <Calendar size={12} className="ml-auto text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-2">
        <div className="mb-2">
          <div className="text-xl font-bold text-gray-900">$25,000</div>
          <p className="text-xs text-gray-500">Weekly budget</p>
        </div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productivityData}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis hide />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUv)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};