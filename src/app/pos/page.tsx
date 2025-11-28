
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Search, Trash2, X, Clock, LogOut, FileText, CreditCard, Landmark, Banknote, HelpCircle, Loader2 } from 'lucide-react';
import { Product, CartItem } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { getProductsQuery } from '@/services/products';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/services/orders';
import { useRouter } from 'next/navigation';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(price).replace('LKR', 'LKR ');
};

type PosCartItem = Product & { quantity: number };
type HeldBill = {
  id: string;
  customerName: string;
  cart: PosCartItem[];
  time: Date;
};

export default function PosPage() {
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);
  const [cashReceived, setCashReceived] = useState<number | string>('');

  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => getProductsQuery(firestore), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const categories = useMemo(() => {
    if (!products) return ['All'];
    return ['All', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);
  
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleHoldBill = () => {
    if (cart.length === 0) return;
    const newHeldBill: HeldBill = {
      id: `HB-${Date.now()}`,
      customerName: customerName || 'Unnamed',
      cart: cart,
      time: new Date(),
    };
    setHeldBills(prev => [...prev, newHeldBill]);
    setCart([]);
    setCustomerName('');
    setIsHoldModalOpen(false);
  };

  const recallBill = (bill: HeldBill) => {
    setCart(bill.cart);
    setHeldBills(prev => prev.filter(b => b.id !== bill.id));
    setIsRecallModalOpen(false);
  };

  const handlePaymentMethodSelection = (method: string) => {
    setIsPaymentModalOpen(false);
    if (method === 'cash') {
        setIsCashModalOpen(true);
    } else {
        toast({
            title: 'Not Implemented',
            description: `Payment method "${method}" is not yet available.`
        })
    }
  };

  const completeCashSale = async () => {
      if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to complete a sale.' });
        router.push('/login');
        return;
      }
      setIsProcessingPayment(true);
      
      try {
          const orderId = await createOrder(firestore, user.uid, cart, total);
          toast({
              title: 'Payment Successful',
              description: `Sale #${orderId.substring(0,7)} has been completed.`
          });
          setCart([]);
          setCashReceived('');
          setIsCashModalOpen(false);
      } catch (error) {
          console.error("Failed to create POS order:", error);
          toast({
              variant: 'destructive',
              title: 'Sale Failed',
              description: 'Could not record the sale. Please try again.'
          });
      } finally {
          setIsProcessingPayment(false);
      }
  }

  const changeDue = useMemo(() => {
      const received = typeof cashReceived === 'number' ? cashReceived : parseFloat(cashReceived);
      if (isNaN(received) || received < total) {
          return 0;
      }
      return received - total;
  }, [cashReceived, total]);

  return (
    <>
      <div className="flex h-screen flex-col bg-gray-900 text-white">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-primary/20 bg-background px-6">
          <div className="flex items-center gap-4">
            <p className="font-semibold">Jane Doe</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <h1 className="font-serif text-xl font-bold text-primary">M LEATHER - Point of Sale</h1>
          <div className="flex items-center gap-4">
              <p className='text-muted-foreground'>Till: <span className='font-mono font-bold text-white'>{formatPrice(50000)}</span></p>
              <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5 text-red-400"/>
              </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Products Section */}
          <div className="flex w-3/5 flex-col border-r border-primary/20 p-4">
            <div className="mb-4 flex gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search products or scan barcode..." 
                  className="h-12 bg-black/30 pl-10 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-4">
              <TabsList className="bg-transparent p-0">
                {categories.map(category => (
                  <TabsTrigger 
                      key={category} 
                      value={category} 
                      className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                      {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {isLoading && Array.from({length: 12}).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
                ))}
                {filteredProducts.map(product => (
                  <button key={product.id} onClick={() => addToCart(product)} className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-muted/30 text-left">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="font-mono text-primary">{formatPrice(product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart/Bill Section */}
          <div className="flex w-2/5 flex-col bg-background p-4">
              <h2 className="mb-4 text-xl font-bold text-white">Current Bill</h2>
              <div className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-3">
                      {cart.map(item => (
                          <div key={item.id} className="flex items-center gap-3 rounded-md bg-muted/40 p-2">
                              <Image src={item.image} alt={item.name} width={48} height={48} className="aspect-square rounded-md object-cover"/>
                              <div className="flex-grow">
                                  <p className="text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                              </div>
                              <div className="flex items-center rounded-md border border-border">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                      <Minus className="h-4 w-4"/>
                                  </Button>
                                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                      <Plus className="h-4 w-4"/>
                                  </Button>
                              </div>
                              <p className="w-20 text-right font-mono text-sm">{formatPrice(item.price * item.quantity)}</p>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => updateQuantity(item.id, 0)}>
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                          </div>
                      ))}
                      {cart.length === 0 && (
                          <div className="flex h-full items-center justify-center">
                              <p className="text-muted-foreground">Cart is empty</p>
                          </div>
                      )}
                  </div>
              </div>

              <div className="mt-4 border-t-2 border-primary/20 pt-4">
                  <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-mono">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="font-mono text-green-400">{formatPrice(0)}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax (18%)</span>
                          <span className="font-mono">{formatPrice(tax)}</span>
                      </div>
                  </div>
                  <div className="mt-4 flex justify-between rounded-md bg-primary p-3 text-primary-foreground">
                      <span className="text-lg font-bold">TOTAL</span>
                      <span className="font-mono text-xl font-bold">{formatPrice(total)}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button variant="secondary" className="bg-yellow-600 hover:bg-yellow-500" onClick={() => cart.length > 0 && setIsHoldModalOpen(true)}>Hold Bill</Button>
                      <Button variant="secondary" className="bg-blue-600 hover:bg-blue-500" onClick={() => setIsRecallModalOpen(true)}>Recall Bill</Button>
                  </div>
                  <Button variant="secondary" className="w-full mt-2 bg-red-700 hover:bg-red-600" onClick={() => setCart([])}>Clear Cart</Button>
                  <Button className="mt-2 h-16 w-full text-lg font-bold" onClick={() => cart.length > 0 && setIsPaymentModalOpen(true)}>Proceed to Payment</Button>
              </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={isHoldModalOpen} onOpenChange={setIsHoldModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Hold Bill</DialogTitle>
                <DialogDescription>
                    Enter a customer name or reference to hold this bill for later.
                </DialogDescription>
            </DialogHeader>
            <Input 
                placeholder="Customer Name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
            />
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsHoldModalOpen(false)}>Cancel</Button>
                <Button onClick={handleHoldBill} className='bg-yellow-600 hover:bg-yellow-500'>Hold</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
       <Dialog open={isRecallModalOpen} onOpenChange={setIsRecallModalOpen}>
        <DialogContent className='max-w-lg'>
            <DialogHeader>
                <DialogTitle>Recall a Held Bill</DialogTitle>
            </DialogHeader>
            <div className='max-h-96 overflow-y-auto space-y-2 p-1'>
                {heldBills.length > 0 ? (
                    heldBills.map(bill => (
                        <button key={bill.id} onClick={() => recallBill(bill)} className='w-full text-left p-3 rounded-md hover:bg-muted/80 border border-border flex justify-between items-center'>
                            <div>
                                <p className='font-semibold'>{bill.customerName}</p>
                                <p className='text-xs text-muted-foreground'>Held at: {bill.time.toLocaleTimeString()}</p>
                            </div>
                            <div className='text-right'>
                                <p className='font-mono font-bold text-primary'>{formatPrice(bill.cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 1.18)}</p>
                                <p className='text-xs text-muted-foreground'>{bill.cart.length} items</p>
                            </div>
                        </button>
                    ))
                ) : (
                    <p className='text-center text-muted-foreground py-8'>No bills are currently on hold.</p>
                )}
            </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Select Payment Method</DialogTitle>
                <DialogDescription>
                    Total Amount: <span className="font-bold text-white">{formatPrice(total)}</span>
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
                <Button className="h-20 text-lg bg-green-600 hover:bg-green-500" onClick={() => handlePaymentMethodSelection('cash')}>
                    <Banknote className="mr-2 h-6 w-6"/> Cash
                </Button>
                 <Button className="h-20 text-lg bg-blue-600 hover:bg-blue-500" onClick={() => handlePaymentMethodSelection('card')}>
                    <CreditCard className="mr-2 h-6 w-6"/> Card
                </Button>
                 <Button className="h-20 text-lg bg-yellow-600 hover:bg-yellow-500" onClick={() => handlePaymentMethodSelection('cheque')}>
                    <Landmark className="mr-2 h-6 w-6"/> Cheque
                </Button>
                 <Button className="h-20 text-lg bg-gray-600 hover:bg-gray-500" onClick={() => handlePaymentMethodSelection('other')}>
                    <HelpCircle className="mr-2 h-6 w-6"/> Other
                </Button>
            </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isCashModalOpen} onOpenChange={setIsCashModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Cash Payment</DialogTitle>
                <DialogDescription>
                    Enter the amount of cash received from the customer.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Due</p>
                    <p className="text-4xl font-bold font-mono text-primary">{formatPrice(total)}</p>
                </div>
                <div className="space-y-2">
                    <label htmlFor="cash-received" className="text-sm font-medium">Cash Received (LKR)</label>
                    <Input 
                        id="cash-received"
                        type="number"
                        placeholder="e.g., 15000"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        className="h-12 text-lg text-center font-mono"
                    />
                </div>
                <div className="text-center bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Change Due</p>
                    <p className="text-3xl font-bold font-mono text-green-400">{formatPrice(changeDue)}</p>
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsCashModalOpen(false)}>Back</Button>
                <Button 
                    className='bg-green-600 hover:bg-green-500' 
                    onClick={completeCashSale}
                    disabled={isProcessingPayment || (typeof cashReceived === 'number' ? cashReceived : parseFloat(cashReceived)) < total}
                >
                    {isProcessingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Payment & New Sale
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
