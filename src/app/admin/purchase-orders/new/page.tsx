
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { addPurchaseOrder } from '@/services/purchase-orders';
import { useToast } from '@/hooks/use-toast';
import { PurchaseOrderForm, PurchaseOrderFormValues } from '@/components/admin/purchase-order-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getSuppliersQuery } from '@/services/suppliers';
import { getProductsQuery } from '@/services/products';
import { Supplier, Product } from '@/lib/types';

export default function NewPurchaseOrderPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suppliersQuery = useMemoFirebase(() => getSuppliersQuery(firestore), [firestore]);
  const { data: suppliers, isLoading: areSuppliersLoading } = useCollection<Supplier>(suppliersQuery);

  const productsQuery = useMemoFirebase(() => getProductsQuery(firestore), [firestore]);
  const { data: products, isLoading: areProductsLoading } = useCollection<Product>(productsQuery);

  const handleSubmit = async (data: PurchaseOrderFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create a purchase order.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      await addPurchaseOrder(firestore, user.uid, data, totalAmount);
      toast({
        title: 'Purchase Order Created',
        description: `PO #${data.poNumber} has been successfully created.`,
      });
      router.push('/admin/purchase-orders');
    } catch (error) {
      console.error('Error adding purchase order:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create the purchase order. Please try again.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const isLoading = isUserLoading || areSuppliersLoading || areProductsLoading;

  if (isLoading) {
    return <NewPurchaseOrderSkeleton />;
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-4 mb-2 text-muted-foreground">
            <Link href="/admin/purchase-orders">
                <ChevronLeft />
                Back to Purchase Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white">Create Purchase Order</h1>
          <p className="mt-1 text-muted-foreground">
            Fill in the details below to create a new PO for a supplier.
          </p>
        </div>
      </div>
      <PurchaseOrderForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        suppliers={suppliers || []}
        products={products || []}
        submitButtonText="Create Purchase Order"
      />
    </>
  );
}


function NewPurchaseOrderSkeleton() {
    return (
        <>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-5 w-72 mt-2" />
                </div>
            </div>
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                         <Skeleton className="h-48 w-full" />
                         <Skeleton className="h-24 w-full" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>
        </>
    )
}
