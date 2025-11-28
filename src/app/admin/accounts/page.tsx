
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
import type { Account } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getAccountsQuery } from '@/services/accounts';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(price).replace('LKR', 'LKR ');
};

const TypeBadge = ({ type }: { type: string }) => {
  let className = '';
  switch (type?.toLowerCase()) {
    case 'asset':
      className = 'bg-green-800/30 text-green-300 border-green-700/50';
      break;
    case 'liability':
      className = 'bg-red-800/30 text-red-300 border-red-700/50';
      break;
    case 'equity':
      className = 'bg-blue-800/30 text-blue-300 border-blue-700/50';
      break;
    case 'revenue':
        className = 'bg-cyan-800/30 text-cyan-300 border-cyan-700/50';
        break;
    case 'expense':
        className = 'bg-yellow-800/30 text-yellow-300 border-yellow-700/50';
        break;
    default:
      className = 'bg-gray-700/50 text-gray-300 border-gray-600/50';
  }
  return <Badge variant="outline" className={`capitalize ${className}`}>{type || 'Unknown'}</Badge>;
};

export default function AdminAccountsPage() {
  const firestore = useFirestore();
  const accountsQuery = useMemoFirebase(() => getAccountsQuery(firestore), [firestore]);
  const { data: accounts, isLoading } = useCollection<Account>(accountsQuery);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Chart of Accounts</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all financial accounts in the general ledger.
          </p>
        </div>
        <div className='flex gap-2'>
            <Button className="gap-2" variant='outline'>
                <File />
                Export
            </Button>
            <Button className="gap-2">
                <PlusCircle />
                Add Account
            </Button>
        </div>
      </div>

      <Card className="bg-muted/50 border-border/50">
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
          <CardDescription>
            A list of all accounts in your chart of accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead>Account Number</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {!isLoading && accounts && accounts.map((account) => (
                <TableRow key={account.id} className="border-border/30 hover:bg-muted/60">
                  <TableCell className="font-mono text-muted-foreground">
                    {account.accountNumber}
                  </TableCell>
                  <TableCell className='font-medium text-white'>{account.name}</TableCell>
                  <TableCell>
                    <TypeBadge type={account.type} />
                  </TableCell>
                  <TableCell className='text-right font-mono text-white'>{formatPrice(account.balance)}</TableCell>
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
                        <DropdownMenuItem>View Ledger</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && (!accounts || accounts.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No accounts found.
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
