
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { addInvoice, InvoiceFormValues } from '@/services/invoices';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCustomersQuery } from '@/services/customers';
import { getAllOrdersQuery } from '@/services/orders';
import type { Customer, Order } from '@/lib/types';


const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  customerId: z.string().min(1, 'Customer is required'),
  orderId: z.string().min(1, 'Order is required'),
  issueDate: z.date({ required_error: 'Issue date is required' }),
  dueDate: z.date({ required_error: 'Due date is required' }),
  amount: z.coerce.number().positive('Amount must be a positive number'),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Void']),
});


export default function NewInvoicePage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customersQuery = useMemoFirebase(() => getCustomersQuery(firestore), [firestore]);
  const { data: customers, isLoading: areCustomersLoading } = useCollection<Customer>(customersQuery);

  const ordersQuery = useMemoFirebase(() => getAllOrdersQuery(firestore), [firestore]);
  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: `INV-${Date.now()}`,
      status: 'Draft',
    },
  });

  const handleSubmit = async (data: InvoiceFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create an invoice.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await addInvoice(firestore, user.uid, data);
      toast({
        title: 'Invoice Created',
        description: `Invoice #${data.invoiceNumber} has been successfully created.`,
      });
      router.push('/admin/invoices');
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create the invoice. Please try again.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isLoading = isUserLoading || areCustomersLoading || areOrdersLoading;

  if (isLoading) {
    return (
        <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-96 w-full" />
        </div>
    )
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-4 mb-2 text-muted-foreground">
            <Link href="/admin/invoices">
                <ChevronLeft />
                Back to Invoices
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white">Create New Invoice</h1>
          <p className="mt-1 text-muted-foreground">
            Fill in the details below to generate a new invoice.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="bg-muted/50 border-border/50">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {customers?.map(c => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="orderId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Order</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an order" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {orders?.map(o => <SelectItem key={o.id} value={o.id}>Order #{o.id.substring(0,7)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Issue Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount (LKR)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Sent">Sent</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
          </Card>
          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              Create Invoice
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
