
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';

const applications = [
  {
    title: 'Wallets & Card Cases',
    recommendation: 'Top-Grain (Grade B) or Full-Grain (Grade A)',
    image: 'https://images.unsplash.com/photo-1615436666136-1b91e2e7c3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxsZWF0aGVyJTIwd2FsbGV0fGVufDB8fHx8MTc2MzIxMTIzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    specs: [
      { label: 'Thickness', value: '1.2-1.4mm' },
      { label: 'Finish', value: 'Sealed or waxed for durability' },
    ],
    why: 'Requires durability for daily handling and develops a nice patina over time. The thickness provides structure.',
    forProducers: 'Ordering for 100 wallets? You\'ll need approximately 3 hides of Grade B at 1.3mm. We can cut to your pattern or provide full hides.',
    aiHint: 'leather wallet'
  },
  {
    title: 'Leather Belts',
    recommendation: 'Full-Grain (Grade A) or Top-Grain (Grade B)',
    image: 'https://images.unsplash.com/photo-1557890941-6b28f5b4a048?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxsZWF0aGVyJTIwYmVsdHxlbnwwfHx8fDE3NjI3Njk3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: [
        { label: 'Thickness', value: '1.4-1.6mm (for strength)' },
        { label: 'Finish', value: 'Natural or sealed' },
    ],
    why: 'Belts need significant thickness and structure. Full-grain develops a beautiful, unique patina and offers maximum durability.',
    forProducers: 'Manufacturing 500 belts annually? Start with 100-120 hides of Grade B. Our custom cutting services can minimize waste and maximize your yield per hide.',
    aiHint: 'leather belt'
  },
  {
    title: 'Bags & Backpacks',
    recommendation: 'Water Buffalo, Full-Grain, or Top-Grain',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb68c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxsZWF0aGVyJTIwYmFnfGVufDB8fHx8MTc2MzIxMTI1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
     specs: [
        { label: 'Thickness', value: '1.4-1.6mm (for structure)' },
        { label: 'Finish', value: 'Waxed or sealed for water resistance' },
    ],
    why: 'Bags require durable leather that can handle stress and weight. A water-resistant finish is crucial for protecting the contents.',
    forProducers: 'Producing 100 bags monthly? You will need approximately 15 hides of waxed Top-Grain per month. We can adjust your supply based on seasonality.',
    aiHint: 'leather bag'
  },
   {
    title: 'Leather Shoes & Footwear',
    recommendation: 'Specialized Full-Grain or Top-Grain',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxsZWF0aGVyJTIwc2hvZXN8ZW58MHx8fHwxNzYzMjExMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: [
        { label: 'Thickness', value: '1.0-1.2mm (for flexibility)' },
        { label: 'Finish', value: 'Professional shoe finishes' },
    ],
    why: 'Footwear requires leather that is both durable and flexible for comfort. The material\'s breathability is also a key factor.',
    forProducers: 'Contact us with your shoe specifications. We can source leather that meets your exact requirements for comfort, durability, and aesthetics.',
    aiHint: 'leather shoes'
  },
  {
    title: 'Leather Accessories',
    recommendation: 'Goat Leather or Top-Grain',
    image: 'https://images.unsplash.com/photo-1608221835632-386229a8523c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsZWF0aGVyJTIwa2V5Y2hhaW58ZW58MHx8fHwxNzYzMjExMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: [
        { label: 'Thickness', value: '0.8-1.2mm (thin & flexible)' },
        { label: 'Finish', value: 'Sealed for scratch resistance' },
    ],
    why: 'Smaller accessories showcase fine craftsmanship. Thinner, flexible leather is ideal for fitting contours and detailed work.',
    forProducers: 'For small accessories, even 1-2 hides can support significant production. This is perfect for testing new designs and colors with a high material yield.',
    aiHint: 'leather keychain'
  },
  {
    title: 'Professional Leather Goods',
    recommendation: 'Premium Full-Grain (Grade A)',
    image: 'https://images.unsplash.com/photo-1594243684521-235e2193ea65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYnJpZWZjYXNlfGVufDB8fHx8MTc2MzIxMTM0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    specs: [
        { label: 'Thickness', value: '1.4-1.6mm' },
        { label: 'Finish', value: 'Sealed, professional appearance' },
    ],
    why: 'Professional items demand durability and a premium image. Grade A leather develops a rich patina that adds value over time.',
    forProducers: 'For premium briefcases, material quality is non-negotiable. It can represent 40-50% of the final product value.',
    aiHint: 'leather briefcase'
  },
];

export default function ApplicationsPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1599958334462-887b282c069c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxsZWF0aGVyJTIwY3JhZnR8ZW58MHx8fHwxNzYzMjExMDQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Leather crafting tools"
            fill
            className="object-cover"
            priority
            data-ai-hint="leather craft"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6 sm:px-12 lg:px-24">
          <h1 className="section-title">Leather Materials for Every Application</h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Supply your craft with premium leather. From wallets to accessories, find the perfect material for your production needs.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app, index) => (
              <Card key={index} className="bg-muted/30 border-border/50 overflow-hidden flex flex-col">
                <div className="relative h-56 w-full">
                    <Image src={app.image} alt={app.title} fill className="object-cover" data-ai-hint={app.aiHint}/>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-white">{app.title}</CardTitle>
                  <CardDescription>
                    <span className="font-semibold text-primary">Recommended:</span> {app.recommendation}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="space-y-1 mb-4">
                     {app.specs.map(spec => (
                          <div key={spec.label} className="flex justify-between text-sm">
                            <span className="font-semibold text-foreground/80">{spec.label}:</span>
                            <span className="text-muted-foreground text-right">{spec.value}</span>
                        </div>
                     ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow"><span className="font-semibold text-white">Why it works:</span> {app.why}</p>
                  <div className="mt-auto pt-4 border-t border-border/30">
                    <p className="text-xs italic text-primary/80 bg-primary/10 p-2 rounded-md">{app.forProducers}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

       <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 text-center">
          <h2 className="section-title mb-4">Have a Project in Mind?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We provide materials consultation, samples, and production support for any design you can imagine. Let&apos;s build something great together.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact?subject=Custom+Project+Inquiry">Discuss Your Project</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/leathers">Explore Our Leathers</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
