import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, User, TrendingUp } from 'lucide-react';

const transactionData = [
  { id: 1, type: 'Tesco Market', category: 'Shopping', date: '13 Dec 2020', amount: '$75.67', icon: ShoppingBag },
  { id: 2, type: 'ElectroMan Market', category: 'Shopping', date: '14 Dec 2020', amount: '$250.00', icon: ShoppingBag },
  { id: 3, type: 'Fiergio Restaurant', category: 'Food', date: '15 Dec 2020', amount: '$19.50', icon: User },
  { id: 4, type: 'John Mathew Kayne', category: 'Sports', date: '16 Dec 2020', amount: '$350', icon: TrendingUp },
  { id: 5, type: 'Ann Martin', category: 'Shopping', date: '17 Nov 2020', amount: '$430', icon: ShoppingBag },
];

export const TransactionSection = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
          Transaction history
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-2">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left pb-1 font-medium">Receiver</th>
                <th className="text-left pb-1 font-medium">Type</th>
                <th className="text-left pb-1 font-medium">Date</th>
                <th className="text-right pb-1 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-1.5 pr-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                        <transaction.icon size={10} className="text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="py-1.5 text-gray-600">{transaction.category}</td>
                  <td className="py-1.5 text-gray-500">{transaction.date}</td>
                  <td className="py-1.5 text-right font-semibold text-gray-900">{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};