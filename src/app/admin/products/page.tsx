
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { getProductsQuery } from '@/services/products';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(price).replace('LKR', 'LKR ');
};

const StockBadge = ({ stock }: { stock: number }) => {
  let className = '';
  if (stock === 0) {
    className = 'bg-red-800/30 text-red-300 border-red-700/50';
  } else if (stock < 10) {
    className = 'bg-yellow-800/30 text-yellow-300 border-yellow-700/50';
  } else {
    className = 'bg-green-800/30 text-green-300 border-green-700/50';
  }
  return <Badge variant="outline" className={className}>{stock > 0 ? stock : 'Out of Stock'}</Badge>;
};

const StatusBadge = ({ status }: { status: string }) => {
    let className = '';
    switch (status.toLowerCase()) {
        case 'published':
            className = 'bg-green-800/30 text-green-300 border-green-700/50';
            break;
        case 'draft':
        default:
             className = 'bg-gray-700/50 text-gray-300 border-gray-600/50';
            break;
    }
    return <Badge variant="outline" className={className}>{status}</Badge>;
}

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => getProductsQuery(firestore), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-white">Products</h1>
            <p className="mt-1 text-muted-foreground">
            Manage your store's products and inventory.
            </p>
        </div>
        <Button asChild className='gap-2'>
            <Link href="/admin/products/new">
                <PlusCircle />
                Add Product
            </Link>
        </Button>
      </div>

      <Card className="bg-muted/50 border-border/50">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            An overview of all products in your inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                 <TableRow key={i} className="border-border/30">
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-24 ml-auto rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
              ))}
              {!isLoading && products && products.map((product) => (
                <TableRow key={product.id} className="border-border/30 hover:bg-muted/60">
                   <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="48"
                      src={product.image}
                      width="48"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-white">{product.name}</TableCell>
                  <TableCell className='text-muted-foreground'>{product.sku}</TableCell>
                   <TableCell>
                      <StatusBadge status={product.status} />
                    </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="hidden md:table-cell text-right font-mono">{formatPrice(product.price)}</TableCell>
                  <TableCell className='text-right'>
                    <StockBadge stock={product.stock} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          className='h-8 w-8 text-muted-foreground'
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                           <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && (!products || products.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
