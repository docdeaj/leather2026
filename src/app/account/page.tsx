
'use client';

import Link from 'next/link';
import {
  Package,
  User,
  CreditCard,
  Heart,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { getOrdersQuery } from '@/services/orders';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const accountNavItems = [
  { name: 'My Profile', icon: User, href: '#' },
  { name: 'Order History', icon: Package, href: '/account', active: true },
  { name: 'Payment Methods', icon: CreditCard, href: '#' },
  { name: 'Wishlist', icon: Heart, href: '#' },
  { name: 'Log Out', icon: LogOut, href: '#' },
];

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
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
}


export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return getOrdersQuery(firestore, user.uid);
  }, [firestore, user]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection<Order>(ordersQuery);

  const isLoading = isUserLoading || isOrdersLoading;

  return (
    <div className="container mx-auto py-12 pt-28 px-6 sm:px-12 lg:px-24">
      <h1 className="section-title mb-12 text-center">My Account</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-lg border-2 border-border bg-muted/20 p-4">
                <nav className="flex flex-col space-y-2">
                    {accountNavItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors
                                ${item.active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                }
                                ${item.name === 'Log Out' && 'text-red-400 hover:bg-red-900/50 hover:text-red-300'}
                            `}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="rounded-lg border-2 border-border bg-muted/20 p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Order History</h2>
            <div className="space-y-4">
                {isLoading && Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i}/>)}
                {!isLoading && orders && orders.map(order => (
                    <Link href={`/account/orders/${order.id}`} key={order.id} className="block">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg bg-muted/30 p-4 border border-border hover:border-primary/50 transition-colors">
                          <div className="grid grid-cols-2 sm:grid-cols-3 text-left sm:text-center gap-4 flex-grow w-full">
                            <div>
                                  <p className="text-xs text-muted-foreground">Order ID</p>
                                  <p className="font-medium">#{order.id.substring(0, 7)}</p>
                            </div>
                              <div>
                                  <p className="text-xs text-muted-foreground">Date</p>
                                  <p className="font-medium">{order.orderDate ? format(order.orderDate.toDate(), 'MMMM d, yyyy') : 'N/A'}</p>
                            </div>
                            <div className="sm:text-right">
                                  <p className="text-xs text-muted-foreground">Total</p>
                                  <p className="font-bold text-primary">{formatPrice(order.amount)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                              <StatusBadge status={order.status}/>
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                                  <ChevronRight className="h-5 w-5" />
                              </Button>
                          </div>
                      </div>
                    </Link>
                ))}
                {!isLoading && (!orders || orders.length === 0) && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                        <Button asChild className="mt-4">
                            <Link href="/products">Start Shopping</Link>
                        </Button>
                    </div>
                )}
            </div>
             {/* <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More Orders</Button>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}

const OrderSkeleton = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg bg-muted/30 p-4 border border-border">
        <div className="grid grid-cols-2 sm:grid-cols-3 text-left sm:text-center gap-4 flex-grow w-full">
            <div>
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-5 w-20" />
            </div>
            <div>
                <Skeleton className="h-4 w-8 mb-2" />
                <Skeleton className="h-5 w-24" />
            </div>
            <div className="sm:text-right">
                <Skeleton className="h-4 w-10 mb-2 ml-auto" />
                <Skeleton className="h-5 w-24 ml-auto" />
            </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-md" />
        </div>
    </div>
)
