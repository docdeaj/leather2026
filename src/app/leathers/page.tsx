
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const leatherTypes = [
  {
    name: 'Premium Full-Grain Leather',
    grade: 'Grade A Premium | Best Quality',
    description: 'The highest quality leather, retaining the complete grain surface with natural characteristics. Ideal for premium products requiring exceptional durability and patina development.',
    specs: [
      { label: 'Thickness', value: '1.4-1.6mm (customizable)' },
      { label: 'Finish', value: 'Natural or sealed options' },
      { label: 'Color Range', value: '12+ colors available' },
      { label: 'Tanning', value: 'Vegetable-tanned option available' },
    ],
    applications: ['Premium wallets', 'High-end belts', 'Professional briefcases', 'Investment-grade products'],
    durability: '10-15+ years',
    pricing: 'Premium',
    moq: '5-10 hides'
  },
  {
    name: 'Top-Grain Premium Leather',
    grade: 'Grade B Quality | Professional Standard',
    description: 'Premium leather with surface finishing for uniform appearance while maintaining durability. Ideal for daily-use products and professional applications.',
    specs: [
      { label: 'Thickness', value: '1.2-1.4mm' },
      { label: 'Finish', value: 'Smooth, sealed, water-resistant' },
      { label: 'Color Range', value: '15+ colors' },
      { label: 'Stain Resistance', value: 'Enhanced' },
    ],
    applications: ['Daily-use wallets', 'Work bags', 'Casual leather goods', 'Structured items'],
    durability: '8-12 years',
    pricing: 'Mid-Premium',
    moq: '3-5 hides'
  },
  {
    name: 'Genuine Full-Leather (Grade C)',
    grade: 'Grade C Quality | Value Tier',
    description: 'Quality leather from full hides with natural variations. Perfect for developing craftspeople, bulk projects, and cost-conscious production.',
    specs: [
      { label: 'Thickness', value: '1.0-1.2mm' },
      { label: 'Finish', value: 'Natural or basic seal' },
      { label: 'Color Range', value: '8-10 colors' },
    ],
    applications: ['Learning projects', 'Training materials', 'Casual accessories', 'Prototyping'],
    durability: '5-8 years',
    pricing: 'Value/Economy',
    moq: '2-3 hides'
  },
  {
    name: 'Water Buffalo Leather',
    grade: 'Professional Grade | Heavy-Duty',
    description: 'Exceptionally durable leather from water buffalo. Thicker, more resistant to damage, with distinctive natural grain.',
    specs: [
      { label: 'Thickness', value: '1.5-2.0mm (extra thick)' },
      { label: 'Resistance', value: 'Excellent water/scratch resistance' },
      { label: 'Characteristics', value: 'Unique texture, dark natural patina' },
    ],
    applications: ['Heavy-duty work accessories', 'Protective gear', 'Industrial applications', 'Items requiring maximum durability'],
    durability: '12-15+ years',
    pricing: 'Premium High-Durability',
    moq: '2-4 hides (special order)'
  },
    {
    name: 'Goat Leather',
    grade: 'Premium Fine-Grain',
    description: 'Soft, supple, yet durable leather. Ideal for detailed work and fashion-forward pieces requiring flexibility.',
    specs: [
      { label: 'Thickness', value: '0.8-1.0mm (thinner, flexible)' },
      { label: 'Flexibility', value: 'High - suitable for detailed stitching' },
      { label: 'Water Resistance', value: 'Naturally good' },
    ],
    applications: ['Detailed accessories', 'Fashion leather goods', 'Fitted items', 'Delicate wallets and cases'],
    durability: '8-10 years',
    pricing: 'Mid-Premium',
    moq: '2-3 hides'
  },
    {
    name: 'Cow Leather',
    grade: 'Versatile Professional Standard',
    description: 'The most versatile leather option. Reliable, available in numerous finishes, suitable for diverse applications.',
    specs: [
      { label: 'Thickness', value: '1.0-1.4mm (customizable)' },
      { label: 'Finish', value: '8+ finish options' },
      { label: 'Availability', value: 'Consistent stock' },
    ],
    applications: ['General-purpose leather work', 'Educational/training projects', 'Custom manufacturing', 'Prototype development'],
    durability: '8-10 years',
    pricing: 'Standard/Mid-Range',
    moq: '2-5 hides'
  },
];

const finishes = [
  { name: 'Natural/Oil', appearance: 'Raw, authentic grain', bestFor: 'Premium/artisan work', resistance: 'Low-Medium', cost: 'Standard' },
  { name: 'Waxed', appearance: 'Rich, warm appearance', bestFor: 'Outdoor items, travel goods', resistance: 'High', cost: 'Premium' },
  { name: 'Sealed/Polished', appearance: 'Uniform, professional', bestFor: 'Daily-use items, work', resistance: 'Very High', cost: 'Premium' },
  { name: 'Vegetable-Tanned', appearance: 'Patina-developing, eco', bestFor: 'Premium/sustainable work', resistance: 'Medium', cost: 'Premium' },
  { name: 'Chrome-Tanned', appearance: 'Soft, consistent', bestFor: 'Industrial, high-volume', resistance: 'Medium', cost: 'Standard' },
  { name: 'Combination', appearance: 'Custom finish', bestFor: 'Specialized applications', resistance: 'Custom', cost: 'Custom Quote' },
];

const wholesaleTiers = [
    { quantity: '5-10 hides', discount: 'Standard pricing', leadTime: '2-3 weeks' },
    { quantity: '10-25 hides', discount: '10% discount', leadTime: '2-3 weeks' },
    { quantity: '25-50 hides', discount: '15% discount', leadTime: '3-4 weeks' },
    { quantity: '50+ hides', discount: 'Custom quote', leadTime: '4+ weeks' },
]

export default function LeathersPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1603225243924-d8339a095749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwbWF0ZXJpYWxzfGVufDB8fHx8MTc2MzIwOTU4NHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Various leather material rolls"
            fill
            className="object-cover"
            priority
            data-ai-hint="leather materials"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6 sm:px-12 lg:px-24">
          <h1 className="section-title">Premium Leather Materials for Your Craft</h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            100% Pure Leather | Hand-Selected | Custom Cuts & Sizes | Direct Supply to Artisans & Manufacturers
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <Link href="/contact?subject=Leather+Samples+Request">Order Leather Samples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Leather Types Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary">Leather Types & Material Grades</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Understanding leather types helps you select the perfect material for your specific craft.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leatherTypes.map(leather => (
              <Card key={leather.name} className="bg-muted/30 border-border/50 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl text-white">{leather.name}</CardTitle>
                  <p className="text-sm text-primary font-semibold">{leather.grade}</p>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground text-sm mb-4">{leather.description}</p>
                  <div className="space-y-2 text-sm mb-4">
                    {leather.specs.map(spec => (
                        <div key={spec.label} className="flex justify-between">
                            <span className="font-semibold text-foreground/80">{spec.label}:</span>
                            <span className="text-muted-foreground text-right">{spec.value}</span>
                        </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-border/30">
                    <h4 className="font-semibold text-white mb-2">Best Applications:</h4>
                    <div className="flex flex-wrap gap-2">
                        {leather.applications.map(app => (
                            <span key={app} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{app}</span>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Finishes Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary">Available Finishes & Treatments</h2>
                <p className="mt-2 text-muted-foreground">What finish is right for your application?</p>
            </div>
            <Card className="bg-muted/50 border-border/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/50">
                            <TableHead>Finish Type</TableHead>
                            <TableHead>Appearance</TableHead>
                            <TableHead>Best For</TableHead>
                            <TableHead>Water Resistance</TableHead>
                            <TableHead>Cost</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {finishes.map(finish => (
                             <TableRow key={finish.name} className="border-border/30">
                                <TableCell className="font-semibold text-white">{finish.name}</TableCell>
                                <TableCell className="text-muted-foreground">{finish.appearance}</TableCell>
                                <TableCell className="text-muted-foreground">{finish.bestFor}</TableCell>
                                <TableCell className="text-muted-foreground">{finish.resistance}</TableCell>
                                <TableCell className="text-muted-foreground">{finish.cost}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
      </section>

      {/* Custom Cutting Section */}
       <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                     <h2 className="text-3xl font-bold text-primary mb-4">We Specialize in Custom Orders</h2>
                     <p className="text-muted-foreground mb-6">From one-off prototypes to large production runs, we provide precision cutting and sizing to meet your exact manufacturing needs.</p>
                    <ul className="space-y-3 text-foreground">
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0"/><span><span className="font-semibold">Custom Dimensions:</span> Any size you need for your patterns.</span></li>
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0"/><span><span className="font-semibold">Thickness Options:</span> From a delicate 0.8mm to a sturdy 2.5mm.</span></li>
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0"/><span><span className="font-semibold">Color Matching:</span> Match our leather to your design requirements.</span></li>
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0"/><span><span className="font-semibold">Bulk Cutting:</span> Optimize material yield for your production line.</span></li>
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0"/><span><span className="font-semibold">Flexible MOQ:</span> We support you from a single hide to full-scale production.</span></li>
                    </ul>
                     <div className="mt-8">
                        <Button asChild size="lg">
                            <Link href="/contact?subject=Custom+Cutting+Inquiry">Get a Custom Cut Quote</Link>
                        </Button>
                     </div>
                </div>
                 <div className="rounded-lg overflow-hidden">
                     <Image src="https://images.unsplash.com/photo-1594936586835-f755a7138334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxsZWF0aGVyJTIwY3V0dGluZ3xlbnwwfHx8fDE3NjMyMDk5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Leather cutting process" width={600} height={500} className="object-cover w-full h-full" data-ai-hint="leather cutting" />
                </div>
            </div>
        </div>
      </section>

        {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 max-w-4xl">
           <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary">Frequently Asked Questions</h2>
                <p className="mt-2 text-muted-foreground">Answers to common questions about our materials and ordering process.</p>
            </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What thickness of leather do I need for my project?</AccordionTrigger>
              <AccordionContent>
                It depends on the application. For wallets, 1.2-1.4mm is common. For bags, 1.4-1.6mm provides good structure. Belts are typically 1.4mm or thicker. For delicate items, 0.8-1.0mm is suitable. Contact us with your project details for a specific recommendation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can you cut leather to custom sizes?</AccordionTrigger>
              <AccordionContent>
                Yes! Custom cutting is our specialty. Provide the dimensions, thickness, and quantity you need. The lead time for custom orders is typically 2-3 weeks.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>Do you offer sample packs?</AccordionTrigger>
              <AccordionContent>
               Yes. We provide leather sample packs that include a variety of our different types, grades, colors, and finishes. They are a great way to test materials before placing a bulk order.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>What is your minimum order quantity (MOQ)?</AccordionTrigger>
              <AccordionContent>
                We are flexible! We work with orders as small as 1-2 hides for custom artisan work, and we can scale up to support full production runs for manufacturers.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>Do you offer vegetable-tanned leather?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer vegetable-tanned leather for those looking for an eco-friendly, traditional option that develops a beautiful patina over time. Please note it may have a slightly longer lead time and premium pricing.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

    </div>
  );
}
