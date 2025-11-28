
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Minus, Plus, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/product-card';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, query, where, getDocs } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { getRelatedProductsQuery } from '@/services/products';
import { addToCart } from '@/services/cart';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const productRef = useMemoFirebase(() => doc(firestore, 'products', params.id), [firestore, params.id]);
  const { data: product, isLoading: isProductLoading } = useDoc<Product>(productRef);
  
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [areRelatedProductsLoading, setAreRelatedProductsLoading] = useState(true);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!product) return;

      setAreRelatedProductsLoading(true);
      try {
        const recommendations = await getProductRecommendations({
          productDescription: product.description,
          productCategory: product.category,
          numberOfRecommendations: 4,
        });

        const recommendedIds = recommendations.map(r => r.id).filter(id => id !== product.id && id);

        if (recommendedIds.length > 0) {
          const q = query(
              collection(firestore, 'products'), 
              where('id', 'in', recommendedIds),
              where('status', '==', 'Published'),
              where('stock', '>', 0)
            );
          const snapshot = await getDocs(q);
          const products = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Product[];
          setRecommendedProducts(products);
        } else {
            // Fallback to category based recommendations
            const fallbackQuery = getRelatedProductsQuery(firestore, product.category, product.id);
            const snapshot = await getDocs(fallbackQuery);
            const products = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Product[];
            setRecommendedProducts(products);
        }

      } catch (e) {
        console.error("Failed to fetch AI recommendations, falling back to category.", e);
        // Fallback to category based recommendations on error
        const fallbackQuery = getRelatedProductsQuery(firestore, product.category, product.id);
        const snapshot = await getDocs(fallbackQuery);
        const products = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Product[];
        setRecommendedProducts(products);
      } finally {
        setAreRelatedProductsLoading(false);
      }
    }

    if(product){
        fetchRecommendations();
    }
  }, [product, firestore]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart(firestore, user.uid, product, quantity);
      toast({
        title: 'Added to Cart',
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add item to cart. Please try again.',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isProductLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price).replace('LKR', 'LKR ');
  };

  const getStockBadgeInfo = (status: typeof stockStatus) => {
    switch (status) {
      case 'in-stock':
        return { text: 'In Stock', className: 'bg-green-800/20 text-green-300 border-green-700/50' };
      case 'low-stock':
        return { text: 'Low Stock', className: 'bg-yellow-800/20 text-yellow-300 border-yellow-700/50' };
      case 'out-of-stock':
        return { text: 'Out of Stock', className: 'bg-red-800/20 text-red-300 border-red-700/50' };
      default:
        return { text: 'Unknown', className: 'bg-gray-700/20 text-gray-300' };
    }
  };

  const stockInfo = getStockBadgeInfo(stockStatus);

  return (
    <div className="bg-background pt-20">
      <div className="container mx-auto py-12 sm:px-6 lg:px-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-xl border-2 border-primary transition-transform duration-200 ease-in-out hover:scale-105">
                {(selectedImage || product.image) && <Image
                src={selectedImage || product.image}
                alt={product.name}
                width={800}
                height={800}
                className="h-full w-full object-cover"
                />}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  className={cn(
                    'aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 ease-in-out',
                    selectedImage === img ? 'border-primary' : 'border-transparent hover:border-border'
                  )}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">{product.name}</h1>
             <p className="mt-2 text-sm text-muted-foreground">SKU: {product.sku}</p>
            
            <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("h-5 w-5", i < (product.reviews?.[0].rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-600")} />
                    ))}
                </div>
                <p className="text-sm text-muted-foreground">{product.reviews?.length || 0} reviews</p>
                <Badge variant="outline" className={stockInfo.className}>{stockInfo.text}</Badge>
            </div>

            <div className="mt-6">
                <p className="font-code text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
                {product.originalPrice && (
                    <p className="font-code text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                )}
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <p className="font-medium">Quantity:</p>
                <div className="flex h-10 items-center rounded-md border border-border">
                    <Button variant="ghost" size="icon" className="h-full" onClick={() => setQuantity(q => Math.max(1, q-1))}>
                        <Minus className="h-4 w-4"/>
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button variant="ghost" size="icon" className="h-full" onClick={() => setQuantity(q => q+1)}>
                        <Plus className="h-4 w-4"/>
                    </Button>
                </div>
            </div>

            <Button size="lg" className="mt-8 w-full h-12 text-base font-bold" disabled={stockStatus === 'out-of-stock' || isAddingToCart} onClick={handleAddToCart}>
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </Button>
             <div className="mt-12">
                <Tabs defaultValue="description">
                    <TabsList>
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="mt-6 p-1 text-foreground/80 leading-relaxed">
                       {product.description}
                    </TabsContent>
                    <TabsContent value="details" className="mt-6 p-1">
                        <ul className="space-y-2 text-foreground/80">
                            <li><span className="font-semibold text-foreground">Category:</span> {product.category}</li>
                            <li><span className="font-semibold text-foreground">SKU:</span> {product.sku}</li>
                            <li><span className="font-semibold text-foreground">Stock:</span> {product.stock} units</li>
                        </ul>
                    </TabsContent>
                    <TabsContent value="reviews" className="mt-6 p-1">
                        {product.reviews && product.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {product.reviews.map((review, index) => (
                                    <div key={index} className="border-b border-border/50 pb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("h-4 w-4", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600")} />
                                            ))}
                                            <p className="ml-2 font-semibold">{review.author}</p>
                                        </div>
                                        <p className="mt-2 text-foreground/80">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                           <p className="text-foreground/80">No reviews yet for this product.</p> 
                        )}
                    </TabsContent>
                </Tabs>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">
                You Might Also Like
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {areRelatedProductsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                      </div>
                    ))
                ) : (
                    recommendedProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}


function ProductDetailSkeleton() {
  return (
    <div className="bg-background pt-20">
      <div className="container mx-auto py-12 sm:px-6 lg:px-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery Skeleton */}
          <div>
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="mt-4 grid grid-cols-4 gap-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
          </div>
          {/* Product Info Skeleton */}
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-10 w-3/4 rounded-md" />
            <Skeleton className="h-5 w-1/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-28 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
            <Skeleton className="h-12 w-48 rounded-md" />
            
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
