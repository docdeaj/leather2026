
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ProductCard from '@/components/product-card';
import { getFeaturedProducts } from '@/services/products';
import { BadgeCheck, Ruler, Users, BookOpen, Wrench, Shapes, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';


export default async function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  const featuredProducts = await getFeaturedProducts(4);

  const offerings = [
    {
      title: 'Premium Grade Materials',
      description: 'From full-grain to top-grain, discover the perfect leather for your project. We supply ethically sourced, high-quality hides.',
      href: '/leathers',
      icon: BookOpen,
      image: 'https://images.unsplash.com/photo-1603225243924-d8339a095749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwbWF0ZXJpYWxzfGVufDB8fHx8MTc2MzIwOTU4NHww&ixlib=rb-4.1.0&q=80&w=1080',
      aiHint: 'leather materials'
    },
    {
      title: 'Leather Craft Tools',
      description: 'Equip your workshop with professional-grade tools. From cutters to stitching needles, find everything you need for your craft.',
      href: '/products',
      icon: Wrench,
      image: 'https://images.unsplash.com/photo-1599958334462-887b282c069c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxsZWF0aGVyJTIwY3JhZnR8ZW58MHx8fHwxNzYzMjExMDQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      aiHint: 'leather craft tools'
    },
    {
      title: 'Applications & Guides',
      description: 'Learn which materials and techniques are best suited for your project, from wallets and belts to bags and footwear.',
      href: '/applications',
      icon: Shapes,
      image: 'https://images.unsplash.com/photo-1594936586835-f755a7138334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxsZWF0aGVyJTIwY3V0dGluZ3xlbnwwfHx8fDE3NjMyMDk5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      aiHint: 'leather cutting'
    }
  ];

  const testimonials = [
    {
      quote: "The quality of the full-grain leather from M Leather Hub is unmatched. It has elevated my products to a new level. Their custom cutting service is a game-changer for my production line.",
      author: "Naveen Silva",
      title: "Artisan Wallet Maker"
    },
    {
      quote: "As a small-batch producer, sourcing consistent, high-quality material was my biggest challenge. M Leather Hub has been the perfect partner, providing both quality and flexibility.",
      author: "Fathima Rizwan",
      title: "Handbag Designer"
    },
    {
      quote: "Their knowledge of leather applications is incredible. They didn't just sell me leather; they helped me choose the perfect grade and thickness for my new line of footwear. Highly recommended.",
      author: "David Jones",
      title: "Footwear Manufacturer"
    },
      {
      quote: "The best supplier for genuine leather in Sri Lanka, hands down. The water buffalo leather I ordered was exceptional for my heavy-duty belt collection.",
      author: "K. Perera",
      title: "Belt Craftsman"
    }
  ];


  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative flex h-screen min-h-[700px] items-center justify-center text-center">
        <div className="absolute inset-0">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-4">
            The Soul of the Craft
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Supplying genuine leather materials to the artisans and manufacturers who build the future of craft. Create without compromise.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" size="lg">
              <Link href="/products">Explore The Collection</Link>
            </Button>
             <Button asChild size="lg">
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
      
        {/* Featured Products Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">
              New Arrivals
            </h2>
             <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Discover the latest additions to our curated collection of fine leathercrafting supplies.</p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="section-title">Our Commitment</h2>
                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">We are more than a supplier; we are a partner to the creators who work with leather.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center p-6">
                    <BadgeCheck className="h-12 w-12 mx-auto text-primary mb-4"/>
                    <h3 className="text-xl font-semibold text-white">Premium Materials</h3>
                    <p className="text-muted-foreground mt-2">100% pure, ethically sourced leather, hand-selected to ensure it meets the highest standards for your projects.</p>
                </div>
                <div className="text-center p-6">
                    <Users className="h-12 w-12 mx-auto text-primary mb-4"/>
                    <h3 className="text-xl font-semibold text-white">For the Creator</h3>
                    <p className="text-muted-foreground mt-2">Specializing in direct supply to artisans and manufacturers, providing materials ready for hand-cutting and hand-stitching.</p>
                </div>
                <div className="text-center p-6">
                    <Ruler className="h-12 w-12 mx-auto text-primary mb-4"/>
                    <h3 className="text-xl font-semibold text-white">Custom Solutions</h3>
                    <p className="text-muted-foreground mt-2">From custom cutting and sizing to flexible bulk orders, we provide the specific materials you need for your production.</p>
                </div>
            </div>
        </div>
      </section>
      
      {/* Offerings Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Explore Our Offerings</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Your one-stop source for premium leather, professional tools, and expert guidance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {offerings.map((offering) => (
              <Card key={offering.title} className="bg-muted/30 border-border/50 overflow-hidden group">
                 <Link href={offering.href}>
                    <div className="relative h-56">
                        <Image
                        src={offering.image}
                        alt={offering.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={offering.aiHint}
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <offering.icon className="h-6 w-6 text-primary" />
                            <h3 className="text-xl font-semibold text-white">{offering.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{offering.description}</p>
                        <Button variant="link" className="p-0 text-primary">Learn More &rarr;</Button>
                    </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">What Our Partners Say</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">We're proud to be the trusted material supplier for the best in the business.</p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full bg-muted/40 border-border/50 flex flex-col justify-between p-6">
                      <div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                        </div>
                        <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                      </div>
                      <div className="mt-4 text-right">
                        <p className="font-semibold text-white">{testimonial.author}</p>
                        <p className="text-sm text-primary">{testimonial.title}</p>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              {/* Replace '#' with your actual Google Review link */}
              <Link href="#">Leave a Review</Link>
            </Button>
          </div>

        </div>
      </section>
    </div>
  );
}
