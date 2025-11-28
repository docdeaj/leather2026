
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
import { MoreHorizontal, PlusCircle, File, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllUsersQuery, updateUserRole, updateUserStatus } from '@/services/users';
import type { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';


const RoleBadge = ({ role }: { role: string }) => {
  let className = '';
  switch (role?.toLowerCase()) {
    case 'admin':
      className = 'bg-red-800/50 text-red-300 border-red-700/70';
      break;
    case 'manager':
      className = 'bg-purple-800/50 text-purple-300 border-purple-700/70';
      break;
    case 'accountant':
      className = 'bg-blue-800/50 text-blue-300 border-blue-700/70';
      break;
    case 'cashier':
      className = 'bg-yellow-800/50 text-yellow-300 border-yellow-700/70';
      break;
    case 'customer':
    default:
      className = 'bg-gray-700/50 text-gray-300 border-gray-600/50';
  }
  return <Badge variant="outline" className={`capitalize ${className}`}>{role || 'Unknown'}</Badge>;
};

const StatusBadge = ({ status }: { status: string }) => {
  let className = '';
  switch (status?.toLowerCase()) {
    case 'active':
      className = 'bg-green-800/50 text-green-300 border-green-700/70';
      break;
    case 'invited':
      className = 'bg-blue-800/50 text-blue-300 border-blue-700/70';
      break;
    case 'inactive':
    default:
      className = 'bg-gray-700/50 text-gray-300 border-gray-600/50';
  }
  return <Badge variant="outline" className={`capitalize ${className}`}>{status || 'Unknown'}</Badge>;
};

const userRoles: User['role'][] = ['Admin', 'Manager', 'Accountant', 'Cashier', 'Customer'];
const userStatuses: User['status'][] = ['Active', 'Inactive', 'Invited'];


export default function AdminUsersPage() {
  const firestore = useFirestore();
  const usersQuery = useMemoFirebase(() => getAllUsersQuery(firestore), [firestore]);
  const { data: users, isLoading } = useCollection<User>(usersQuery);
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      await updateUserRole(firestore, userId, newRole);
      toast({
        title: "Role Updated",
        description: `User's role has been successfully changed to ${newRole}.`,
      });
    } catch (error) {
      console.error("Failed to update role:", error);
      toast({
        variant: 'destructive',
        title: "Update Failed",
        description: "Could not update the user's role. Please try again.",
      });
    }
  };

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      await updateUserStatus(firestore, userId, newStatus);
      toast({
        title: "Status Updated",
        description: `User's status has been successfully changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        variant: 'destructive',
        title: "Update Failed",
        description: "Could not update the user's status. Please try again.",
      });
    }
  };


  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all user accounts and roles.
          </p>
        </div>
        <div className='flex gap-2'>
            <Button className="gap-2" variant='outline'>
                <File />
                Export
            </Button>
            <Button className="gap-2">
                <PlusCircle />
                Invite User
            </Button>
        </div>
      </div>

      <Card className="bg-muted/50 border-border/50">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all registered users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {!isLoading && users && users.map((user) => (
                <TableRow key={user.id} className="border-border/30 hover:bg-muted/60">
                  <TableCell className="font-medium text-white">
                    {user.firstName || ''} {user.lastName || 'Unnamed User'}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
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
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {userRoles.map(role => (
                                        <DropdownMenuItem key={role} onClick={() => handleRoleChange(user.id, role)}>
                                            {role}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                     {userStatuses.map(status => (
                                        <DropdownMenuItem key={status} onClick={() => handleStatusChange(user.id, status)}>
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">Delete User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && (!users || users.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No users found.
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
