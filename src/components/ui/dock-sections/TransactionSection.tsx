import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, User, TrendingUp } from 'lucide-react';
const transactionData = [{
  id: 1,
  type: 'Tesco Market',
  category: 'Shopping',
  date: '13 Dec 2020',
  amount: '$75.67',
  icon: ShoppingBag
}, {
  id: 2,
  type: 'ElectroMan Market',
  category: 'Shopping',
  date: '14 Dec 2020',
  amount: '$250.00',
  icon: ShoppingBag
}, {
  id: 3,
  type: 'Fiergio Restaurant',
  category: 'Food',
  date: '15 Dec 2020',
  amount: '$19.50',
  icon: User
}, {
  id: 4,
  type: 'John Mathew Kayne',
  category: 'Sports',
  date: '16 Dec 2020',
  amount: '$350',
  icon: TrendingUp
}, {
  id: 5,
  type: 'Ann Martin',
  category: 'Shopping',
  date: '17 Nov 2020',
  amount: '$430',
  icon: ShoppingBag
}];
export const TransactionSection = () => {
  return <Card className="shadow-sm">
      
      
    </Card>;
};