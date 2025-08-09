import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

export const GreatLoanSection = () => {
  return (
    <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg h-full">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">6</span>
        </div>
        <h3 className="text-sm font-bold mb-1">Get great loan!</h3>
        <div className="flex items-center justify-between">
          <ChevronRight size={14} className="text-white/80" />
        </div>
      </CardContent>
    </Card>
  );
};