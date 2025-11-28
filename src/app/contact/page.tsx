
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log(data);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We will get back to you shortly.",
    });
    form.reset({name: '', email: '', phone: '', subject: '', message: ''});
  };

  return (
    <div className="bg-background pt-28 pb-16">
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <div className="text-center mb-12">
          <h1 className="section-title">Contact Us</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We are here to assist with your leather supply needs. Reach out for quotes, samples, or any questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-muted/30 border-border/50">
              <CardHeader className="flex-row items-center gap-4">
                <Phone className="w-8 h-8 text-primary" />
                <CardTitle className="text-xl">WhatsApp / Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary font-semibold text-lg">+94 71 248 0106</p>
                <p className="text-muted-foreground text-sm mt-1">Mon-Sat, 9 AM - 6 PM</p>
                <p className="text-muted-foreground text-sm">Best for material questions and quotes.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-border/50">
              <CardHeader className="flex-row items-center gap-4">
                <Mail className="w-8 h-8 text-primary" />
                <CardTitle className="text-xl">Email</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-primary font-semibold text-lg">Majesticleather2019@gmail.com</p>
                 <p className="text-muted-foreground text-sm mt-1">Response within 24-48 hours.</p>
                 <p className="text-muted-foreground text-sm">Best for detailed specifications.</p>
              </CardContent>
            </Card>
             <Card className="bg-muted/30 border-border/50">
              <CardHeader className="flex-row items-center gap-4">
                <MapPin className="w-8 h-8 text-primary" />
                <CardTitle className="text-xl">Location</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="font-semibold text-white">Prince Street, Colombo, Sri Lanka</p>
                 <p className="text-muted-foreground text-sm mt-1">Visits by appointment only.</p>
                 <p className="text-muted-foreground text-sm">Saturday: 9AM-4PM, Sun: Closed</p>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="bg-muted/30 border-border/50 p-4 sm:p-8">
              <CardHeader>
                <CardTitle className="text-2xl">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl><Input placeholder="e.g., Bulk Order Inquiry" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please describe your material requirements: type, thickness, quantity, etc."
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                      Send Message
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="section-title text-center mb-8">Our Location</h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-primary">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.672054923307!2d79.8488426758814!3d6.936131318465019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259265f433531%3A0x2359a722423377f!2sM%20Leather!5e0!3m2!1sen!2slk!4v1763300000000!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

    
