import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ChevronRight, Plane, Mountain, Gamepad2 } from 'lucide-react';

const goals = [
  { title: '$550', subtitle: 'Holidays', current: 450, target: 550, icon: Plane, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: '$200', subtitle: 'Renovation', current: 120, target: 200, icon: Mountain, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { title: '$820', subtitle: 'Xbox', current: 680, target: 820, icon: Gamepad2, color: 'text-green-500', bgColor: 'bg-green-50' },
];

export const GoalsSection = () => {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
          Goals
          <Plus size={12} className="ml-auto text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-2 space-y-2">
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50"
          >
            <div className={`p-1 rounded-lg ${goal.bgColor}`}>
              <goal.icon size={12} className={goal.color} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">{goal.title}</span>
                <span className="text-xs text-gray-500">12/12/20</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">{goal.subtitle}</p>
            </div>
            <ChevronRight size={10} className="text-gray-400" />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};