
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = {
  "Materials & Ordering": [
    {
      q: "What leather types do you supply?",
      a: "We supply a wide range of 100% pure leather including Full-Grain, Top-Grain, Genuine Leather, Water Buffalo, Goat, and Cow leather. We can also source other types for custom bulk orders."
    },
    {
      q: "Can I order small quantities?",
      a: "Yes! We are happy to work with orders as small as 1-2 hides, which is perfect for prototyping, custom one-off projects, or small production runs."
    },
    {
      q: "Do you offer sample packs?",
      a: "Absolutely. We provide comprehensive sample packs that showcase our different leather types, grades, colors, and finishes. It's a great way to test materials before committing to a bulk order."
    },
    {
      q: "Can you custom cut leather to my patterns?",
      a: "Yes, custom cutting is one of our specialties. You can provide your dimensions or patterns, and we will precision-cut the leather for you. The typical lead time for custom work is 2-3 weeks."
    },
     {
      q: "What payment methods do you accept?",
      a: "We accept bank transfers and various digital payment methods, depending on the region. For international orders, please contact us to discuss the best options."
    },
  ],
  "Shipping & Delivery": [
    {
      q: "Do you ship internationally?",
      a: "Yes, we ship worldwide. Contact us with your order details and address for an accurate shipping quote. We handle all necessary export documentation."
    },
    {
      q: "How long does delivery take?",
      a: "For local orders within Sri Lanka, delivery typically takes 5-7 business days. For international orders, it can take 2-3 weeks depending on your location and customs clearance. Full tracking is provided for all shipments."
    },
     {
      q: "Can I pick up my order locally?",
      a: "Yes, local pickup can be arranged from our primary facility in Puttalam or through our connections in Colombo. Please contact us to coordinate a pickup time."
    },
  ],
  "Quality & Custom Orders": [
    {
      q: "What is the difference between your tanning methods?",
      a: "We offer both traditional vegetable-tanned leather, which is eco-friendly and develops a rich patina, and chrome-tanned leather, which is known for its softness and color consistency. We can help you decide which is best for your specific application."
    },
    {
        q: "Do you offer volume discounts for bulk orders?",
        a: "Yes. We offer a 10% discount for orders of 10-25 hides, and a 15% discount for 25-50 hides. For orders larger than 50 hides, please contact us for a custom quote."
    },
     {
        q: "What is the lead time for custom specifications?",
        a: "The standard lead time for custom cutting, coloring, or finishing is 2-3 weeks. This may vary based on the complexity and size of the order. Rush options are sometimes available."
    }
  ],
};


export default function FaqPage() {
  return (
    <div className="bg-background pt-28 pb-16">
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <div className="text-center mb-12">
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our materials, ordering, and shipping.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
            {Object.entries(faqs).map(([category, items]) => (
                <div key={category}>
                    <h2 className="text-2xl font-bold text-primary mb-6 pb-2 border-b-2 border-primary/20">{category}</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {items.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>{item.q}</AccordionTrigger>
                                <AccordionContent className="text-base leading-relaxed">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
