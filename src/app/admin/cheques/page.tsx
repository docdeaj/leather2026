
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
import type { Cheque } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { getChequesQuery } from '@/services/cheques';

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
    case 'cleared':
      className = 'bg-green-800/30 text-green-300 border-green-700/50';
      break;
    case 'bounced':
      className = 'bg-red-800/30 text-red-300 border-red-700/50';
      break;
    case 'deposited':
      className = 'bg-blue-800/30 text-blue-300 border-blue-700/50';
      break;
    case 'received':
    default:
      className = 'bg-yellow-800/30 text-yellow-300 border-yellow-700/50';
  }
  return <Badge variant="outline" className={`capitalize ${className}`}>{status || 'Unknown'}</Badge>;
};

export default function AdminChequesPage() {
  const firestore = useFirestore();
  const chequesQuery = useMemoFirebase(() => getChequesQuery(firestore), [firestore]);
  const { data: cheques, isLoading } = useCollection<Cheque>(chequesQuery);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Cheque Management</h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage all received and issued cheques.
          </p>
        </div>
        <div className='flex gap-2'>
            <Button className="gap-2" variant='outline'>
                <File />
                Export
            </Button>
            <Button className="gap-2">
                <PlusCircle />
                Add Cheque
            </Button>
        </div>
      </div>

      <Card className="bg-muted/50 border-border/50">
        <CardHeader>
          <CardTitle>All Cheques</CardTitle>
          <CardDescription>
            A list of all cheques in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead>Cheque #</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Drawer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {!isLoading && cheques && cheques.map((cheque) => (
                <TableRow key={cheque.id} className="border-border/30 hover:bg-muted/60">
                  <TableCell className="font-medium text-white font-mono">
                    {cheque.chequeNumber}
                  </TableCell>
                  <TableCell>{cheque.bank}</TableCell>
                  <TableCell className='text-muted-foreground'>{cheque.drawer}</TableCell>
                  <TableCell className='font-mono'>{formatPrice(cheque.amount)}</TableCell>
                  <TableCell>{cheque.dueDate ? format(cheque.dueDate.toDate(), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                  <TableCell>
                    <StatusBadge status={cheque.status} />
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
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">Void</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && (!cheques || cheques.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No cheques found.
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
