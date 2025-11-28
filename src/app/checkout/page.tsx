
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Check, ChevronRight, CreditCard, Home, Loader2, Truck, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CartItem } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { getCartQuery } from '@/services/cart';
import { Skeleton } from '@/components/ui/skeleton';
import { createOrder } from '@/services/orders';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const steps = [
    { name: 'Sign In', icon: User, status: 'complete' },
    { name: 'Shipping', icon: Home, status: 'current' },
    { name: 'Delivery', icon: Truck, status: 'upcoming' },
    { name: 'Payment', icon: CreditCard, status: 'upcoming' },
];

const shippingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'Postal code is required'),
  saveInfo: z.boolean().optional(),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export default function CheckoutPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartQuery = useMemoFirebase(() => {
    if (!user) return null;
    return getCartQuery(firestore, user.uid);
  }, [firestore, user]);

  const { data: cartItems, isLoading: isCartLoading } = useCollection<CartItem>(cartQuery);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      address: '',
      city: '',
      country: 'LK',
      zip: '',
      saveInfo: false,
    },
  });

   // Effect to reset form when user changes
  useEffect(() => {
    if (user?.email) {
      form.reset({
        ...form.getValues(),
        email: user.email,
      });
    }
  }, [user, form]);


  const subtotal = useMemo(() => {
    return cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;
  }, [cartItems]);

  const shipping = 500;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
      }).format(price).replace('LKR', 'LKR ');
  };
  
  const isLoading = isUserLoading || isCartLoading;

  const handlePlaceOrder: SubmitHandler<ShippingFormValues> = async (data) => {
    if (!user || !cartItems || cartItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot place order. Your cart is empty or you are not signed in.',
      });
      return;
    }
    
    setIsProcessing(true);

    try {
      // For now, we simulate a successful payment and proceed to create the order.
      const orderId = await createOrder(firestore, user.uid, cartItems, total, data);
      
      toast({
        title: 'Order Placed!',
        description: `Your order #${orderId.slice(0,7)} has been successfully placed.`,
      });

      // Redirect to a confirmation page
      router.push(`/account/orders/${orderId}`);

    } catch (error) {
      console.error('Failed to create order:', error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: 'There was a problem placing your order. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-12 pt-28 px-6 sm:px-12 lg:px-24">
      <div className="mb-12">
        <h1 className="section-title text-center">Checkout</h1>
        <div className="mt-8 max-w-2xl mx-auto">
            <ol className="flex items-center">
                {steps.map((step, stepIdx) => (
                <li key={step.name} className="relative flex-1">
                    <div className="flex items-center text-sm font-medium">
                        <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                            step.status === 'complete' ? 'bg-primary' :
                            step.status === 'current' ? 'border-2 border-primary text-primary' :
                            'border-2 border-muted-foreground text-muted-foreground'
                        }`}>
                            {step.status === 'complete' ? <Check className="h-5 w-5 text-primary-foreground" /> : <step.icon className="h-5 w-5" />}
                        </span>
                        <span className={`ml-4 hidden sm:block ${step.status === 'current' ? 'text-primary' : 'text-muted-foreground'}`}>{step.name}</span>
                    </div>
                    {stepIdx !== steps.length - 1 ? (
                    <>
                        <div className="absolute top-4 left-4 -ml-px mt-px hidden h-0.5 w-full bg-primary/30 sm:block" />
                        <ChevronRight className="absolute top-1 left-[calc(100%-1rem)] h-6 w-6 text-border sm:hidden" />
                    </>
                    ) : null}
                </li>
                ))}
            </ol>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePlaceOrder)} className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          
          {/* Shipping Form */}
          <div className="lg:col-span-3">
              <div className="rounded-lg border-2 border-border bg-muted/20 p-6">
                   <h2 className="text-2xl font-semibold text-white mb-6">Shipping Information</h2>
                   <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} className="mt-1 bg-background/50 border-border/70" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Doe" {...field} className="mt-1 bg-background/50 border-border/70" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                      </div>
                      <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john.doe@example.com" {...field} className="mt-1 bg-background/50 border-border/70"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                       <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Leather Lane" {...field} className="mt-1 bg-background/50 border-border/70"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                       <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Colombo" {...field} className="mt-1 bg-background/50 border-border/70"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="mt-1 bg-background/50 border-border/70">
                                      <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="LK">Sri Lanka</SelectItem>
                                    <SelectItem value="US">United States</SelectItem>
                                    <SelectItem value="UK">United Kingdom</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="10100" {...field} className="mt-1 bg-background/50 border-border/70"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>
                      <div className="pt-4 flex items-center space-x-2">
                          <FormField
                            control={form.control}
                            name="saveInfo"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className='text-sm font-medium text-muted-foreground'>
                                    Save this information for next time
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                      </div>
                   </div>
              </div>
               <div className="mt-8 flex justify-end">
                  <Button type="submit" size="xl" className="h-12 text-base font-bold" disabled={isProcessing || isLoading || !cartItems || cartItems.length === 0}>
                    {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        'Place Order'
                      )}
                  </Button>
              </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
              <div className="sticky top-28 rounded-lg border-2 border-border bg-muted/20 p-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>
                   {isLoading ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                          <Skeleton className="h-5 w-20" />
                        </div>
                         <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-12" />
                            </div>
                          </div>
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </div>
                  ) : !cartItems || cartItems.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
                  ) : (
                  <div className="space-y-4">
                      {cartItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between gap-4">
                               <div className="flex items-center gap-4">
                                  <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover aspect-square"/>
                                  <div>
                                      <p className="font-semibold text-foreground">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                  </div>
                               </div>
                               <p className="font-medium font-mono">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                      ))}
                  </div>
                  )}


                  <Separator className="my-6 bg-border"/>

                   <div className="space-y-2">
                      <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span className="font-medium text-foreground font-mono">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                          <span>Shipping</span>
                          <span className="font-medium text-foreground font-mono">{formatPrice(shipping)}</span>
                      </div>
                   </div>

                  <Separator className="my-6 bg-border"/>
                  
                  <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span className='font-mono'>{formatPrice(total)}</span>
                  </div>
              </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
