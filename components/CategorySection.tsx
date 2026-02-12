import Link from "next/link";
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
  return (
    <section className="section-padding bg-victoria-cream">
      <div className="container-victoria">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mb-4">
            Cari Berdasarkan Kategori
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Temukan properti ideal sesuai kebutuhan Anda dari berbagai kategori pilihan
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href="/properties"
              className="group bg-card rounded-xl p-6 text-center shadow-card hover:shadow-card-hover-blue transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-8 rounded-xl bg-victoria-light flex items-center justify-center group-hover:bg-victoria-navy transition-colors duration-300">
                <category.icon className="w-8 h-8 text-victoria-red group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.count} properti
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;