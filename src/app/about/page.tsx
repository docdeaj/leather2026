
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award, Globe, Leaf, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524292330692-b353ac6e5227?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsZWF0aGVyJTIwd29ya3Nob3B8ZW58MHx8fHwxNzYzMjA5MzYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Leather workshop"
            fill
            className="object-cover"
            data-ai-hint="leather workshop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6 sm:px-12 lg:px-24">
          <h1 className="section-title">About M Leather Hub</h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Supplying genuine leather materials to the artisans and manufacturers who build the future of craft.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Our Leather Supply Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  At M Leather Hub, we specialize in supplying genuine, premium leather materials directly to artisans, designers, manufacturers, and leather craftspeople. Based in Puttalam, Sri Lanka with connections throughout the region, we provide hand-selected leather specifically sourced for quality-focused producers.
                </p>
                <p>
                  Our commitment is simple: to provide materials that are{' '}
                  <span className="font-semibold text-foreground">100% Pure Leather, 100% Hand-cut capable, and ready for 100% Hand-stitching.</span>
                </p>
                <p>
                  We don&apos;t mass-produce finished goods. We partner with craftspeople who value authenticity, sustainability, and excellence. We are here to be the foundation of your creations.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="rounded-lg bg-muted/50 p-6 text-center">
                    <Award className="h-10 w-10 mx-auto text-primary mb-3"/>
                    <h3 className="font-semibold text-white">Premium Quality</h3>
                    <p className="text-sm text-muted-foreground mt-1">Direct supplier of ethically sourced, hand-selected leathers.</p>
                </div>
                 <div className="rounded-lg bg-muted/50 p-6 text-center">
                    <Leaf className="h-10 w-10 mx-auto text-primary mb-3"/>
                    <h3 className="font-semibold text-white">Eco-Conscious</h3>
                    <p className="text-sm text-muted-foreground mt-1">Vegetable tanning and other sustainable processes available.</p>
                </div>
                 <div className="rounded-lg bg-muted/50 p-6 text-center">
                    <Users className="h-10 w-10 mx-auto text-primary mb-3"/>
                    <h3 className="font-semibold text-white">For Creators</h3>
                    <p className="text-sm text-muted-foreground mt-1">Specializing in wholesale and bulk orders for manufacturers.</p>
                </div>
                 <div className="rounded-lg bg-muted/50 p-6 text-center">
                    <Globe className="h-10 w-10 mx-auto text-primary mb-3"/>
                    <h3 className="font-semibold text-white">Global Reach</h3>
                    <p className="text-sm text-muted-foreground mt-1">Based in Sri Lanka with trusted tannery partners worldwide.</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 text-center">
          <h2 className="section-title mb-4">Ready to Create?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Let us be your trusted partner in sourcing the finest leather materials for your next project. Explore our offerings or get in touch for a custom quote.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/leathers">Explore Our Leathers</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact for a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
