
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Loader2, Trash2, CalendarIcon } from 'lucide-react';
import type { PurchaseOrder, Supplier, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const purchaseOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  unitPrice: z.coerce.number().positive('Unit price must be positive.'),
});

const purchaseOrderFormSchema = z.object({
  poNumber: z.string().min(1, { message: 'PO Number is required.' }),
  supplierId: z.string().min(1, { message: 'Supplier is required.' }),
  status: z.enum(['Draft', 'Sent', 'Confirmed', 'Received', 'Cancelled']),
  expectedDelivery: z.date({
    required_error: 'An expected delivery date is required.',
  }),
  items: z.array(purchaseOrderItemSchema).min(1, 'At least one item is required.'),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;

interface PurchaseOrderFormProps {
  initialData?: PurchaseOrder;
  suppliers: Supplier[];
  products: Product[];
  onSubmit: (data: PurchaseOrderFormValues) => void;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export function PurchaseOrderForm({
  initialData,
  suppliers,
  products,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Save Changes',
}: PurchaseOrderFormProps) {
  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: initialData
      ? { ...initialData, expectedDelivery: initialData.expectedDelivery.toDate(), items: initialData.items || [] }
      : {
          poNumber: `PO-${Math.floor(Date.now() / 1000)}`,
          supplierId: '',
          status: 'Draft',
          items: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchItems = form.watch('items');
  const totalAmount = watchItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-muted/50 border-border/50">
              <CardHeader>
                <CardTitle>Purchase Order Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="poNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PO Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PO-12345" {...field} />
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
                            <SelectValue placeholder="Select PO status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Sent">Sent</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-border/50">
              <CardHeader>
                  <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {fields.map((field, index) => (
                          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end p-4 rounded-md border border-border/50">
                              <FormField
                                  control={form.control}
                                  name={`items.${index}.productId`}
                                  render={({ field }) => (
                                      <FormItem className="sm:col-span-5">
                                      <FormLabel>Product</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Select a product" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                              {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name={`items.${index}.quantity`}
                                  render={({ field }) => (
                                      <FormItem className="sm:col-span-2">
                                          <FormLabel>Qty</FormLabel>
                                          <Input type="number" {...field} />
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name={`items.${index}.unitPrice`}
                                  render={({ field }) => (
                                      <FormItem className="sm:col-span-3">
                                          <FormLabel>Unit Price</FormLabel>
                                          <Input type="number" step="0.01" {...field} />
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <div className="sm:col-span-2 flex items-center gap-2">
                                  <p className="font-mono text-sm pt-5 text-center w-full">{watchItems[index] ? (watchItems[index].quantity * watchItems[index].unitPrice).toFixed(2) : '0.00'}</p>
                                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                              </div>
                          </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => append({ productId: '', quantity: 1, unitPrice: 0 })}>
                          Add Item
                      </Button>
                  </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-muted/50 border-border/50">
              <CardHeader>
                <CardTitle>Supplier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a supplier" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="expectedDelivery"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Expected Delivery Date</FormLabel>
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
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-border/50">
                 <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between font-bold text-lg text-primary">
                        <span>Total Amount</span>
                        <span>{totalAmount.toFixed(2)} LKR</span>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
