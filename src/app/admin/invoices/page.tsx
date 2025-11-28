
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
import { Badge } from '@/components/ui/badge';
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
import type { Invoice } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';
import { getInvoicesQuery } from '@/services/invoices';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(price).replace('LKR', 'LKR ');
};

const StatusBadge = ({ status }: { status: string }) => {
  let className = '';
  switch (status?.toLowerCase()) {
    case 'paid':
      className = 'bg-green-800/30 text-green-300 border-green-700/50';
      break;
    case 'sent':
       className = 'bg-blue-800/30 text-blue-300 border-blue-700/50';
      break;
    case 'overdue':
      className = 'bg-red-800/30 text-red-300 border-red-700/50';
      break;
    case 'draft':
    default:
      className = 'bg-gray-700/50 text-gray-300 border-gray-600/50';
  }
  return <Badge variant="outline" className={`capitalize ${className}`}>{status || 'Unknown'}</Badge>;
};

export default function AdminInvoicesPage() {
  const firestore = useFirestore();
  const invoicesQuery = useMemoFirebase(() => getInvoicesQuery(firestore), [firestore]);
  const { data: invoices, isLoading } = useCollection<Invoice>(invoicesQuery);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage customer invoices.
          </p>
        </div>
        <div className='flex gap-2'>
            <Button className="gap-2" variant='outline'>
                <File />
                Export
            </Button>
            <Button asChild className="gap-2">
                <Link href="/admin/invoices/new">
                    <PlusCircle />
                    Create Invoice
                </Link>
            </Button>
        </div>
      </div>

      <Card className="bg-muted/50 border-border/50">
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            A list of all invoices issued.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {!isLoading && invoices && invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-border/30 hover:bg-muted/60">
                  <TableCell className="font-medium text-white">
                    #{invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{invoice.customerId}</TableCell>
                  <TableCell>{invoice.issueDate ? format(invoice.issueDate, 'yyyy-MM-dd') : 'N/A'}</TableCell>
                  <TableCell>{invoice.dueDate ? format(invoice.dueDate, 'yyyy-MM-dd') : 'N/A'}</TableCell>
                  <TableCell className='font-mono'>{formatPrice(invoice.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
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
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">Void Invoice</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && (!invoices || invoices.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No invoices found.
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
