import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import footerImage from "@/assets/footer.jpg";

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={footerImage}
          alt="CTA Background"
          fill
          className="hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--victoria-navy)/0.6)] via-[hsl(var(--victoria-navy)/0.5)] to-[hsl(var(--victoria-navy)/0.6)]" />
      </div>

      <div className="relative z-10 container-victoria">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-victoria-yellow mb-6" style={{ fontWeight: 800 }}>
            Siap Menemukan <span className="block">Properti Impian Anda?</span>
          </h2>

          <p className="text-lg md:text-xl text-[hsl(var(--victoria-light))] mb-10" style={{ fontWeight: 500 }}>
            Hubungi tim kami sekarang untuk konsultasi gratis dan temukan
            properti yang sesuai dengan kebutuhan dan budget Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* CTA 1 */}
            <Button
              asChild
              size="lg"
              className="bg-victoria-red hover:bg-victoria-red/90 text-victoria-cream font-semibold text-lg px-8 h-14 gap-2 shadow-lg"
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
              className="bg-transparent border-2 border-primary-foreground text-victoria-cream hover:bg-primary-foreground hover:text-victoria-navy font-semibold text-lg px-8 h-14 gap-2"
            >
              <Link href="/contact">
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-primary-foreground/20">
            <div className="text-victoria-cream text-sm">
              Dipercaya oleh:
            </div>
            {["Bank Mandiri", "BCA", "BRI", "BTN"].map((bank) => (
              <div key={bank} className="text-victoria-cream font-bold">
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