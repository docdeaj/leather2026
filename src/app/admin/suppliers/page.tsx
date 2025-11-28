
'use client';

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
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, File } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { getSuppliersQuery } from '@/services/suppliers';
import type { Supplier } from '@/lib/types';
import Link from 'next/link';


export default function AdminSuppliersPage() {
  const firestore = useFirestore();
  const suppliersQuery = useMemoFirebase(() => getSuppliersQuery(firestore), [firestore]);
  const { data: suppliers, isLoading } = useCollection<Supplier>(suppliersQuery);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Suppliers</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all supplier records.
          </p>
        </div>
        <div className='flex gap-2'>
            <Button className="gap-2" variant='outline'>
                <File />
                Export
            </Button>
            <Button asChild className="gap-2">
                <Link href="/admin/suppliers/new">
                    <PlusCircle />
                    Add Supplier
                </Link>
            </Button>
        </div>
      </div>

      <Card className="bg-muted/50 border-border/50">
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>
            A list of all suppliers in your database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {!isLoading && suppliers && suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="border-border/30 hover:bg-muted/60">
                  <TableCell className="font-medium text-white">
                    {supplier.name}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>{supplier.email}</TableCell>
                  <TableCell className='text-muted-foreground'>{supplier.phone || 'N/A'}</TableCell>
                  <TableCell className='text-muted-foreground'>{supplier.address || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && (!suppliers || suppliers.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No suppliers found.
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
