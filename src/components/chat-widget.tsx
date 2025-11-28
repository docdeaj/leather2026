'use client';

import { aiChatbotSupport } from '@/ai/flows/ai-chatbot-support';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Loader2, MessageSquare, Send, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type ChatMessage = {
  role: 'user' | 'bot';
  content: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      content: "Hello! I'm the M Leather Hub assistant. How can I help you find the perfect leather product today?",
    },
  ]);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: '',
    },
  });
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof chatSchema>) {
    setMessages((prev) => [...prev, { role: 'user', content: values.message }]);
    form.reset();

    try {
      const { response } = await aiChatbotSupport({ query: values.message });
      setMessages((prev) => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      console.error('AI Chatbot Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get a response from the assistant. Please try again.',
      });
       setMessages((prev) => [...prev, { role: 'bot', content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    }
  }

  return (
    <>
      <div className={cn('fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out', 
        isOpen ? 'scale-0' : 'scale-100'
      )}>
        <Button
          size="icon"
          className="h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-110 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary hover:bg-primary/30"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-8 w-8" />
        </Button>
      </div>

      <Card
        className={cn(
          'fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm transform-gpu transition-all duration-300 ease-in-out bg-background/80 backdrop-blur-md border-2 border-border',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-16 opacity-0 pointer-events-none'
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b bg-primary/10 p-4">
          <div className='flex items-center gap-3'>
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle className="text-base font-bold text-white">M Leather Assistant</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-white/10" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96 w-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'bot' && (
                    <Avatar className="h-8 w-8 border-2 border-primary/50">
                      <AvatarFallback className='bg-primary/20 text-primary'><Bot className='h-5 w-5'/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-xl p-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-foreground'
                    )}
                  >
                    {message.content}
                  </div>
                   {message.role === 'user' && (
                    <Avatar className="h-8 w-8 border border-muted-foreground/50">
                       <AvatarFallback className='bg-muted'><User className='h-5 w-5'/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isSubmitting && (
                <div className="flex items-start gap-3 justify-start">
                   <Avatar className="h-8 w-8 border-2 border-primary/50">
                      <AvatarFallback className='bg-primary/20 text-primary'><Bot className='h-5 w-5'/></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-xl p-3 text-sm bg-muted/50 text-foreground flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin"/>
                        <span>Thinking...</span>
                    </div>
                </div>
               )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder="Ask about our products..."
                        autoComplete="off"
                        {...field}
                        disabled={isSubmitting}
                        className="bg-black/20 border-border focus:ring-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </>
  );
}
