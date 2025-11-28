
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleAuthAction(
    action: 'signIn' | 'signUp',
    values: z.infer<typeof formSchema>
  ) {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      if (action === 'signIn') {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({
          title: 'Success',
          description: 'Signed in successfully.',
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;

        // Create a user document in Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        const newUser = {
          id: user.uid,
          email: user.email,
          firstName: '',
          lastName: '',
          role: 'Customer', // Default role
          lastActive: new Date().toISOString(),
          status: 'Active'
        };
        
        // Use non-blocking write
        setDocumentNonBlocking(userDocRef, newUser, { merge: true });

        toast({
          title: 'Success',
          description: 'Account created successfully.',
        });
      }
      router.push('/account');
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (errorCode === 'auth/user-not-found') {
        errorMessage = 'No user found with this email. Please sign up.';
      } else if (errorCode === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (errorCode === 'auth/email-already-in-use') {
        errorMessage =
          'This email is already in use. Please sign in instead.';
      }
      setAuthError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12 pt-28 px-6 sm:px-12 lg:px-24">
      <Card className="w-full max-w-md bg-muted/20 border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            Welcome
          </CardTitle>
          <CardDescription>
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={e => e.preventDefault()}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        className="bg-background/50 border-border/70"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-background/50 border-border/70"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {authError && (
                <p className="text-sm font-medium text-destructive">{authError}</p>
              )}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Button
                  type="button"
                  onClick={form.handleSubmit(values =>
                    handleAuthAction('signIn', values)
                  )}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit(values =>
                    handleAuthAction('signUp', values)
                  )}
                  variant="secondary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
