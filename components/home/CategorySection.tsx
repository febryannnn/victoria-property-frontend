"use client"
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Home,
  Building2,
  Store,
  TreePine,
  Building,
  Warehouse,
  Hotel,
} from "lucide-react";

const categories = [
  { name: "Rumah", icon: Home, count: "5,234" },
  { name: "Apartemen", icon: Building2, count: "3,128" },
  { name: "Ruko", icon: Store, count: "1,456" },
  { name: "Tanah", icon: TreePine, count: "2,891" },
  { name: "Villa", icon: Building, count: "876" },
  { name: "Gudang", icon: Warehouse, count: "432" },
  { name: "Gedung", icon: Building, count: "321" },
  { name: "Hotel", icon: Hotel, count: "210" },
];

const CategorySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate header
            const header = entry.target.querySelector(".cat-header");
            if (header) header.classList.add("cat-in");

            // Animate cards with stagger
            const cards = entry.target.querySelectorAll(".cat-card");
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add("cat-in"), i * 70);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Header ── */
        .cat-header {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                      transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .cat-header.cat-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Cards ── */
        .cat-card {
          opacity: 0;
          transform: translateY(32px) scale(0.97);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.3s ease,
                      translate 0.3s ease;
        }
        .cat-card.cat-in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ── Icon container bounce on hover ── */
        .cat-icon-wrap {
          transition: background-color 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .cat-card:hover .cat-icon-wrap {
          transform: scale(1.12) rotate(-4deg);
        }

        /* ── Icon ── */
        .cat-icon {
          transition: color 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .cat-card:hover .cat-icon {
          transform: scale(1.1);
        }

        /* ── Count pill appear on hover ── */
        .cat-count {
          transition: color 0.3s ease;
        }
        .cat-card:hover .cat-count {
          color: hsl(var(--color-victoria-red, 0 70% 37%));
        }
      `}</style>

      <section ref={sectionRef} className="section-padding bg-victoria-cream">
        <div className="container-victoria">

          {/* Header */}
          <div className="cat-header text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mb-4">
              Cari Berdasarkan Kategori
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Temukan properti ideal sesuai kebutuhan Anda dari berbagai kategori pilihan
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href="/properties"
                className="cat-card group bg-card rounded-2xl p-6 text-center
                  shadow-sm hover:shadow-lg hover:-translate-y-1"
              >
                <div className="cat-icon-wrap w-16 h-16 mx-auto mb-8 rounded-xl
                  bg-victoria-light
                  flex items-center justify-center
                  group-hover:bg-victoria-red">
                  <category.icon
                    className="cat-icon w-8 h-8
                      text-victoria-red
                      group-hover:text-white"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {category.name}
                </h3>
                <p className="cat-count text-sm text-muted-foreground">
                  {category.count} properti
                </p>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default CategorySection;