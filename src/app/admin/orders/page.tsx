
'use client';

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
import { MoreHorizontal, File } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { getAllOrdersQuery } from '@/services/orders';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';

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
    case 'delivered':
    case 'shipped':
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
      className = 'bg-gray-700/50 text-gray-300 border-gray-600/50';
  }
  return <Badge variant="outline" className={`capitalize ${className}`}>{status}</Badge>;
};

export default function AdminOrdersPage({ isAuthorized }: { isAuthorized?: boolean }) {
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!isAuthorized) return null;
    return getAllOrdersQuery(firestore);
  }, [firestore, isAuthorized]);

  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all customer orders.
          </p>
        </div>
        <Button className="gap-2">
          <File />
          Export
        </Button>
      </div>

      <Card className="bg-muted/50 border-border/50">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            A list of all orders from your store.
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
              {!isLoading && orders && orders.map((order) => (
                <TableRow key={order.id} className="border-border/30 hover:bg-muted/60">
                  <TableCell className="font-medium text-white">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-primary">
                        #{order.id.substring(0, 7)}
                    </Link>
                  </TableCell>
                  <TableCell>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</TableCell>
                  <TableCell className="font-mono">{formatPrice(order.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>{order.orderDate ? format(order.orderDate.toDate(), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">Cancel Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && (!orders || orders.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
