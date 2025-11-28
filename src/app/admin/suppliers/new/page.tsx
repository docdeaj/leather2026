
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { addSupplier } from '@/services/suppliers';
import { useToast } from '@/hooks/use-toast';
import { SupplierForm, SupplierFormValues } from '@/components/admin/supplier-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewSupplierPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SupplierFormValues) => {
    setIsSubmitting(true);
    try {
      await addSupplier(firestore, data);
      toast({
        title: 'Supplier Created',
        description: `"${data.name}" has been successfully added to your list of suppliers.`,
      });
      router.push('/admin/suppliers');
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create the supplier. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-4 mb-2 text-muted-foreground">
            <Link href="/admin/suppliers">
                <ChevronLeft />
                Back to Suppliers
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white">Add New Supplier</h1>
          <p className="mt-1 text-muted-foreground">
            Fill in the details below to add a new supplier to your database.
          </p>
        </div>
      </div>
      <SupplierForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Add Supplier"
      />
    </>
  );
}
