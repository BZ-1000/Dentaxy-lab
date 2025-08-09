import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const events = [
  { date: '15', title: 'Team Meeting', time: '10:00 AM' },
  { date: '18', title: 'Project Review', time: '2:00 PM' },
  { date: '22', title: 'Client Call', time: '4:00 PM' },
];

const members = [
  { name: 'John D.', avatar: '👨‍💼', status: 'online' },
  { name: 'Sarah M.', avatar: '👩‍💻', status: 'away' },
  { name: 'Mike R.', avatar: '👨‍🎨', status: 'online' },
  { name: 'Anna K.', avatar: '👩‍🔬', status: 'offline' },
];

export const SidebarSection = () => {
  return (
    <div className="w-48 p-2 border-r border-gray-200 space-y-2">
      {/* Eventos y actualizaciones */}
      <Card className="shadow-sm">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-semibold flex items-center gap-1">
            <Calendar size={12} />
            Eventos y actualizaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-2">
          <div className="space-y-1">
            <div className="text-xs font-semibold">20 September</div>
            <div className="text-xs text-gray-500">Sunday - All day</div>
            {events.map((event, index) => (
              <div key={index} className="text-xs p-1 rounded hover:bg-gray-50">
                <div className="font-medium">{event.title}</div>
                <div className="text-gray-500">{event.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <Card className="shadow-sm">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-semibold">Members</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-2">
          <div className="flex -space-x-1 mb-2">
            {members.slice(0, 4).map((member, index) => (
              <div key={index} className="w-5 h-5 bg-gray-100 rounded-full border border-white flex items-center justify-center">
                <span className="text-xs">{member.avatar}</span>
              </div>
            ))}
            <div className="w-5 h-5 bg-gray-200 rounded-full border border-white flex items-center justify-center">
              <span className="text-xs text-gray-600">+</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="text-xs h-5 px-2">Cancel</Button>
            <Button size="sm" className="text-xs h-5 px-2 bg-purple-600 hover:bg-purple-700">More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};