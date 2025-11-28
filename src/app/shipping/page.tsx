
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Globe, ShieldCheck, CornerDownLeft } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="bg-background pt-28 pb-16">
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <div className="text-center mb-12">
          <h1 className="section-title">Shipping & Returns</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Information about our shipping process and quality guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-muted/30 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-primary">
                <Package className="h-6 w-6" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-white">Local Shipping (Sri Lanka)</h3>
                <ul className="mt-2 space-y-1 text-muted-foreground text-sm list-disc list-inside">
                  <li>Processing Time: 2-3 business days</li>
                  <li>Delivery Time: 5-7 days island-wide</li>
                  <li>Tracking: Full tracking provided via email/SMS</li>
                  <li>Insurance: All shipments are fully insured</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white">International Shipping</h3>
                <ul className="mt-2 space-y-1 text-muted-foreground text-sm list-disc list-inside">
                  <li>Processing Time: 3-5 business days</li>
                  <li>Delivery Time: 2-3 weeks (varies by destination)</li>
                  <li>Shipping Cost: Quoted individually based on order size and destination</li>
                  <li>Customs & Duties: The international buyer is responsible for all customs fees and import duties. We provide all necessary export documentation.</li>
                </ul>
              </div>
               <div>
                <h3 className="font-semibold text-white">Packaging</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                 All our leather materials are professionally packed with protective wrapping to ensure they arrive in perfect condition. Each package is securely sealed and labeled with handling instructions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-primary">
                <ShieldCheck className="h-6 w-6" />
                Returns & Quality Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-white">Our Quality Guarantee</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  We stand by the quality of our leather. If any material you receive does not meet the agreed-upon specifications (e.g., wrong thickness, incorrect finish, defects), we will provide a full replacement or credit.
                </p>
              </div>
               <div>
                <h3 className="font-semibold text-white">How to Report an Issue</h3>
                 <ol className="mt-2 space-y-2 text-muted-foreground text-sm">
                    <li>1. Contact us via WhatsApp or Email within 7 days of receiving your order.</li>
                    <li>2. Provide your order number and photos of the material showing the issue.</li>
                    <li>3. We will review the issue and arrange for a replacement or account credit.</li>
                </ol>
              </div>
               <div>
                <h3 className="font-semibold text-white">Non-Returnable Items</h3>
                 <p className="mt-2 text-muted-foreground text-sm">
                    Please note that we cannot accept returns for:
                 </p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-sm list-disc list-inside">
                  <li>Custom-cut orders (unless defective).</li>
                  <li>Leather that has already been cut, stitched, or used in production.</li>
                </ul>
                 <p className="mt-2 text-muted-foreground text-sm">
                    We highly recommend ordering a sample pack to verify color and texture before placing a large or custom order.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
