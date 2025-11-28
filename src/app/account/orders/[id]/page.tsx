
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Order, OrderItem } from '@/lib/types';
import { getOrderItemsQuery } from '@/services/orders';
import { doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, Package, ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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


export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();

  const orderRef = useMemoFirebase(() => {
    if (!params.id) return null;
    return doc(firestore, 'orders', params.id);
  }, [firestore, params.id]);

  const { data: order, isLoading: isOrderLoading } = useDoc<Order>(orderRef);
  
  const orderItemsQuery = useMemoFirebase(() => {
    if (!order) return null;
    return getOrderItemsQuery(firestore, params.id);
  }, [firestore, order, params.id]);
  
  const { data: orderItems, isLoading: areItemsLoading } = useCollection<OrderItem>(orderItemsQuery);

  const isLoading = isOrderLoading || areItemsLoading;

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    notFound();
  }
  
  const subtotal = orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) ?? 0;
  const shipping = order.amount - subtotal;

  return (
    <div className="container mx-auto py-12 pt-28 px-6 sm:px-12 lg:px-24">
        <div className="mb-8">
            <Button asChild variant="ghost" className='-ml-4'>
                <Link href="/account">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Order History
                </Link>
            </Button>
        </div>
      <div className="rounded-lg border-2 border-border bg-muted/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Order #{order.id.substring(0, 7)}</h1>
                <p className="text-muted-foreground">
                    Placed on {order.orderDate ? format(order.orderDate.toDate(), 'MMMM d, yyyy') : 'N/A'}
                </p>
            </div>
            <StatusBadge status={order.status} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary flex items-center gap-2"><Home className="w-5 h-5"/> Shipping Address</h2>
                <div className="text-muted-foreground">
                    <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                    <p>{order.shippingAddress.country === 'LK' ? 'Sri Lanka' : order.shippingAddress.country}</p>
                </div>
            </div>
             <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary flex items-center gap-2"><Package className="w-5 h-5"/> Order Summary</h2>
                <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium text-foreground">{formatPrice(shipping)}</span>
                    </div>
                    <Separator className="my-2 bg-border/50"/>
                    <div className="flex justify-between text-lg font-bold text-white">
                        <span>Total</span>
                        <span>{formatPrice(order.amount)}</span>
                    </div>
                </div>
            </div>
        </div>

        <Separator className="my-8 bg-border"/>

        <div>
            <h2 className="text-xl font-semibold text-white mb-6">Items in this order</h2>
            <div className="space-y-6">
                {orderItems?.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start gap-6">
                       <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="aspect-square w-full sm:w-24 rounded-md object-cover border border-border"
                        />
                        <div className="flex-grow">
                             <Link href={`/products/${item.productId}`} className="text-lg font-semibold text-foreground hover:text-primary">{item.name}</Link>
                             <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-lg font-medium text-primary">{formatPrice(item.price * item.quantity)}</p>
                             <p className="text-sm text-muted-foreground">({formatPrice(item.price)} each)</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="container mx-auto py-12 pt-28 px-6 sm:px-12 lg:px-24">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 rounded-md" />
      </div>
      <div className="rounded-lg border-2 border-border bg-muted/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <Skeleton className="h-9 w-40 mb-2 rounded-md" />
            <Skeleton className="h-5 w-56 rounded-md" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-4 w-32 mt-2 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 rounded-md" />
            <div className="flex justify-between mt-2">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <Separator className="my-2 bg-border/50" />
            <div className="flex justify-between">
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="h-7 w-28 rounded-md" />
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-border" />
        <div>
          <Skeleton className="h-7 w-48 mb-6 rounded-md" />
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start gap-6">
                <Skeleton className="h-24 w-full sm:w-24 rounded-md" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-6 w-24 ml-auto rounded-md" />
                  <Skeleton className="h-4 w-20 ml-auto rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
