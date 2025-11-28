
'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Order, OrderItem } from '@/lib/types';
import { getOrderItemsQuery, updateOrderStatus } from '@/services/orders';
import { doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, Package, Truck, User as UserIcon, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

const orderStatuses: Order['status'][] = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const orderRef = useMemoFirebase(() => doc(firestore, 'orders', params.id), [firestore, params.id]);
  const { data: order, isLoading: isOrderLoading } = useDoc<Order>(orderRef);
  
  const orderItemsQuery = useMemoFirebase(() => getOrderItemsQuery(firestore, params.id), [firestore, params.id]);
  const { data: orderItems, isLoading: areItemsLoading } = useCollection<OrderItem>(orderItemsQuery);

  const isLoading = isOrderLoading || areItemsLoading;

  const handleStatusChange = async (newStatus: Order['status']) => {
    setIsUpdatingStatus(true);
    try {
        await updateOrderStatus(firestore, params.id, newStatus);
        toast({
            title: 'Status Updated',
            description: `Order status has been updated to "${newStatus}".`,
        });
    } catch (error) {
        console.error("Failed to update status:", error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update the order status. Please try again.',
        });
    } finally {
        setIsUpdatingStatus(false);
    }
  };


  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    notFound();
  }

  const subtotal = orderItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const shipping = order.amount - subtotal;


  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-4 mb-2 text-muted-foreground">
            <Link href="/admin/orders">
                <ChevronLeft />
                Back to Orders
            </Link>
          </Button>
          <div className='flex items-center gap-4'>
            <h1 className="text-3xl font-bold text-white">Order #{order.id.substring(0, 7)}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-muted-foreground">
            Placed on {order.orderDate ? format(order.orderDate.toDate(), 'MMMM d, yyyy, h:mm a') : 'N/A'}
          </p>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button disabled={isUpdatingStatus}>
                    {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Truck className="mr-2 h-4 w-4" />}
                    Change Status
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {orderStatuses.map(status => (
                    <DropdownMenuItem 
                        key={status} 
                        onClick={() => handleStatusChange(status)}
                        disabled={order.status === status}
                    >
                        {status}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card className="bg-muted/50 border-border/50">
                <CardHeader>
                    <CardTitle>Order Items ({orderItems?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="space-y-6">
                        {orderItems?.map(item => (
                            <div key={item.id} className="flex items-start gap-4">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="aspect-square rounded-md object-cover border border-border"
                                />
                                <div className="flex-grow">
                                    <Link href={`/products/${item.productId}`} className="font-semibold text-foreground hover:text-primary">{item.name}</Link>
                                    <p className="text-sm text-muted-foreground">SKU: {item.id}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p className="font-medium text-primary">{formatPrice(item.price)} x {item.quantity}</p>
                                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card className="bg-muted/50 border-border/50">
                 <CardHeader>
                    <CardTitle className='flex items-center gap-2'><UserIcon className='h-5 w-5'/> Customer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerId}</p>
                </CardContent>
            </Card>
             <Card className="bg-muted/50 border-border/50">
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Home className='h-5 w-5'/> Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <address className="not-italic text-muted-foreground">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.zip}<br/>
                        {order.shippingAddress.country === 'LK' ? 'Sri Lanka' : order.shippingAddress.country}
                    </address>
                </CardContent>
            </Card>
             <Card className="bg-muted/50 border-border/50">
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Package className='h-5 w-5'/> Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                     <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                    </div>
                     <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span className="font-medium text-foreground">{formatPrice(shipping)}</span>
                    </div>
                    <Separator className="my-2 bg-border/50"/>
                    <div className="flex justify-between text-lg font-bold text-white">
                        <span>Total</span>
                        <span>{formatPrice(order.amount)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}

function OrderDetailSkeleton() {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-36 mb-2" />
          <div className='flex items-center gap-4'>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
          <Skeleton className="h-5 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="bg-muted/50 border-border/50">
            <CardHeader>
              <Skeleton className="h-7 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-grow space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-5 w-24 ml-auto" />
                    <Skeleton className="h-5 w-20 ml-auto" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </>
  );
}
