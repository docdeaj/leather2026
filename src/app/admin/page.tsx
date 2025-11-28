
'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Users,
  CreditCard,
  ShoppingCart,
  MoreVertical,
} from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Order } from '@/lib/types';
import { getAllOrdersQuery } from '@/services/orders';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(price).replace('LKR', 'LKR ');
};


const StatusBadge = ({ status }: { status: string }) => {
  let className = '';
  switch (status.toLowerCase()) {
    case 'shipped':
    case 'delivered':
      className = 'bg-green-800/30 text-green-300 border-green-700/50';
      break;
    case 'processing':
    case 'confirmed':
      className = 'bg-yellow-800/30 text-yellow-300 border-yellow-700/50';
      break;
    case 'cancelled':
      className = 'bg-red-800/30 text-red-300 border-red-700/50';
      break;
    default:
      className = 'bg-blue-800/30 text-blue-300 border-blue-700/50';
  }
  return <Badge variant="outline" className={`capitalize ${className}`}>{status}</Badge>;
};

export default function AdminDashboardPage({ isAuthorized }: { isAuthorized?: boolean }) {
  const firestore = useFirestore();
  
  const ordersQuery = useMemoFirebase(() => {
    if (!isAuthorized) return null;
    return getAllOrdersQuery(firestore);
  }, [firestore, isAuthorized]);

  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  const usersQuery = useMemoFirebase(() => {
    if (!isAuthorized) return null;
    return query(collection(firestore, 'users'));
  }, [firestore, isAuthorized]);

  const { data: users, isLoading: areUsersLoading } = useCollection(usersQuery);

  const isLoading = areOrdersLoading || areUsersLoading;

  const kpiData = useMemo(() => {
    if (isLoading || !orders || !users) {
      return [
        { title: 'Total Revenue', value: 'LKR 0.00', change: '+0.0% from last month', icon: DollarSign },
        { title: 'Total Orders', value: '+0', change: '+0.0% from last month', icon: ShoppingCart },
        { title: 'Average Order Value', value: 'LKR 0.00', change: '+0.0% from last month', icon: CreditCard },
        { title: 'Customer Count', value: '0', change: '+0.0% from last month', icon: Users },
      ];
    }
    
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const customerCount = users.length;

    return [
      { title: 'Total Revenue', value: formatPrice(totalRevenue), change: '', icon: DollarSign },
      { title: 'Total Orders', value: `+${totalOrders}`, change: '', icon: ShoppingCart },
      { title: 'Average Order Value', value: formatPrice(avgOrderValue), change: '', icon: CreditCard },
      { title: 'Customer Count', value: `${customerCount}`, change: '', icon: Users },
    ];
  }, [orders, users, isLoading]);

  const recentOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders]
        .sort((a, b) => b.orderDate.toDate().getTime() - a.orderDate.toDate().getTime())
        .slice(0, 5);
  }, [orders]);


  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          An overview of your store's performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="bg-muted/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {isLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                  {/* <p className="text-xs text-muted-foreground">{kpi.change}</p> */}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8">
        <Card className="bg-muted/50 border-border/50">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              A list of the most recent orders from your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/30">
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))}
                {!isLoading && recentOrders.map((order) => (
                   <TableRow key={order.id} className="border-border/30 hover:bg-muted/60">
                    <TableCell className="font-medium text-white">#{order.id.substring(0, 7)}</TableCell>
                    <TableCell>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</TableCell>
                    <TableCell className="font-mono">{formatPrice(order.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>{order.orderDate ? format(order.orderDate.toDate(), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Order Actions</span>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No recent orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
