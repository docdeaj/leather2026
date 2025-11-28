
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { getCartQuery, removeCartItem, updateCartItemQuantity } from '@/services/cart';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const cartQuery = useMemoFirebase(() => {
    if (!user) return null;
    return getCartQuery(firestore, user.uid);
  }, [firestore, user]);

  const { data: cartItems, isLoading: isCartLoading } = useCollection<CartItem>(cartQuery);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price).replace('LKR', 'LKR ');
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (!user) return;
    updateCartItemQuantity(firestore, user.uid, id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    if (!user) return;
    removeCartItem(firestore, user.uid, id);
  };

  const subtotal = useMemo(() => {
    return cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;
  }, [cartItems]);
  const shipping = 500; // Example shipping cost
  const total = subtotal + shipping;

  const isLoading = isUserLoading || isCartLoading;

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 pt-36 text-center px-6 sm:px-12 lg:px-24">
        <h1 className="section-title">Shopping Cart</h1>
        <p className="mt-4 text-muted-foreground">Please sign in to view your cart.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 pt-36 text-center px-6 sm:px-12 lg:px-24">
        <h1 className="section-title">Shopping Cart</h1>
        <p className="mt-4 text-muted-foreground">Your shopping cart is currently empty.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 pt-28 px-6 sm:px-12 lg:px-24">
      <h1 className="section-title mb-12 text-center">Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="hidden lg:block">
            <div className="grid grid-cols-6 gap-4 text-sm font-bold uppercase text-muted-foreground bg-muted/50 p-4 rounded-lg border-b-2 border-primary">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>
          </div>
            <div className="space-y-6 mt-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col rounded-lg bg-muted/30 p-4 border border-border lg:grid lg:grid-cols-6 lg:items-center lg:gap-4">
                        <div className="flex items-start gap-4 col-span-3">
                          <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="aspect-square w-20 rounded-md object-cover"
                          />
                          <div className="flex-grow">
                              <Link href={`/products/${item.id}`} className="font-semibold text-foreground hover:text-primary">{item.name}</Link>
                              <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive h-8 w-8 lg:hidden" onClick={() => handleRemoveItem(item.id)}>
                                <Trash2 className="h-4 w-4"/>
                              </Button>
                          </div>
                        </div>

                        <div className="text-center font-mono my-2 lg:my-0">{formatPrice(item.price)}</div>

                        <div className="flex items-center justify-center rounded-md border border-border h-9">
                            <Button variant="ghost" size="icon" className="h-full w-9" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                                <Minus className="h-4 w-4"/>
                            </Button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-full w-9" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </div>
                        <div className="text-right font-mono font-bold my-2 lg:my-0">{formatPrice(item.price * item.quantity)}</div>
                         <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive h-8 w-8 hidden lg:flex ml-auto" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 className="h-4 w-4"/>
                         </Button>
                    </div>
                ))}
            </div>
        </div>

        <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-xl border-2 border-primary bg-muted/40 p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>
                <div className="space-y-4 text-muted-foreground">
                    <div className="flex justify-between">
                        <span className="text-base text-gray-400">Subtotal</span>
                        <span className="font-medium font-mono text-lg text-foreground">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-base text-gray-400">Shipping</span>
                        <span className="font-medium font-mono text-lg text-foreground">{formatPrice(shipping)}</span>
                    </div>
                </div>
                <Separator className="my-6 bg-border"/>
                <div className="flex justify-between text-xl font-bold text-white bg-primary/10 p-3 rounded-md">
                    <span>Total</span>
                    <span className="font-mono">{formatPrice(total)}</span>
                </div>
                 <div className="mt-6 space-y-2">
                    <p className="text-sm font-medium">Discount Code</p>
                    <div className="flex gap-2">
                        <Input placeholder="Enter code" className="bg-background/50 border-border/70"/>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Apply</Button>
                    </div>
                </div>
                <Button asChild size="xl" className="mt-6 w-full font-bold" disabled={cartItems.length === 0}>
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="container mx-auto py-12 pt-28 px-6 sm:px-12 lg:px-24">
      <h1 className="section-title mb-12 text-center">Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start gap-6 rounded-lg bg-muted/30 p-4 border border-border">
              <Skeleton className="aspect-square w-full sm:w-32 rounded-md" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/4 rounded-md" />
                <Skeleton className="h-6 w-1/2 mt-4 rounded-md" />
              </div>
              <div className="flex flex-col items-start sm:items-end gap-4 w-full sm:w-auto">
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-lg border-2 border-border bg-muted/20 p-6 space-y-4">
            <Skeleton className="h-8 w-3/4 mb-4 rounded-md" />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-1/4 rounded-md" />
              <Skeleton className="h-5 w-1/3 rounded-md" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-1/4 rounded-md" />
              <Skeleton className="h-5 w-1/3 rounded-md" />
            </div>
            <Separator className="my-6 bg-border" />
            <div className="flex justify-between">
              <Skeleton className="h-7 w-1/4 rounded-md" />
              <Skeleton className="h-7 w-1/3 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full mt-6 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
    
