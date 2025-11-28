
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { updateProduct } from '@/services/products';
import { useToast } from '@/hooks/use-toast';
import { ProductForm, ProductFormValues } from '@/components/admin/product-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProductPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productId = params.id as string;
  const productRef = useMemoFirebase(() => doc(firestore, 'products', productId), [firestore, productId]);
  const { data: product, isLoading } = useDoc<Product>(productRef);

  const handleSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      await updateProduct(firestore, productId, data);
      toast({
        title: 'Product Updated',
        description: `"${data.name}" has been successfully updated.`,
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update the product. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <EditProductSkeleton />;
  }
  
  if (!product) {
      // Optional: Add a "Not Found" state
      return <div className='text-white'>Product not found.</div>
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
          <h1 className="text-3xl font-bold text-white">Edit Product</h1>
          <p className="mt-1 text-muted-foreground">
            Modify the details for "{product.name}".
          </p>
        </div>
      </div>
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Save Changes"
      />
    </>
  );
}

function EditProductSkeleton() {
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
