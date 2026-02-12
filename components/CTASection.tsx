import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="relative z-10 container-victoria">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Siap Menemukan Properti Impian Anda?
          </h2>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">
            Hubungi tim kami sekarang untuk konsultasi gratis dan temukan
            properti yang sesuai dengan kebutuhan dan budget Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* CTA 1 */}
            <Button
              asChild
              size="lg"
              className="bg-victoria-red hover:bg-victoria-red/90 text-primary-foreground font-semibold text-lg px-8 h-14 gap-2 shadow-lg"
            >
              <Link href="/properties">
                Mulai Pencarian
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            {/* CTA 2 */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-victoria-navy font-semibold text-lg px-8 h-14 gap-2"
            >
              <Link href="/contact">
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-primary-foreground/20">
            <div className="text-primary-foreground/70 text-sm">
              Dipercaya oleh:
            </div>
            {["Bank Mandiri", "BCA", "BRI", "BTN"].map((bank) => (
              <div key={bank} className="text-primary-foreground font-semibold">
                {bank}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;