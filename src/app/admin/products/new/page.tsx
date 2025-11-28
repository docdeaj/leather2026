
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { addProduct } from '@/services/products';
import { useToast } from '@/hooks/use-toast';
import { ProductForm, ProductFormValues } from '@/components/admin/product-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewProductPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create a product.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await addProduct(firestore, user.uid, data);
      toast({
        title: 'Product Created',
        description: `"${data.name}" has been successfully added to your inventory.`,
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create the product. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return <NewProductSkeleton />;
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-4 mb-2 text-muted-foreground">
            <Link href="/admin/products">
                <ChevronLeft />
                Back to Products
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          <p className="mt-1 text-muted-foreground">
            Fill in the details below to add a new product to your inventory.
          </p>
        </div>
      </div>
      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Add Product"
      />
    </>
  );
}


function NewProductSkeleton() {
    return (
        <>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-40 mb-2" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-64 mt-2" />
                </div>
            </div>
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="lg:col-span-1">
                         <Skeleton className="h-64 w-full" />
                    </div>
                </div>
                <Skeleton className="h-48 w-full" />
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </>
    )
}
