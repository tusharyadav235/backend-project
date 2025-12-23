import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Leaf, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Using the hero image from user assets */}
          <img 
            src="/images/hero.png" 
            alt="Cattle grazing in green field" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="container-custom relative z-10 text-center text-white space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/90 text-sm font-bold tracking-wide mb-4">
              PREMIUM QUALITY FEED
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6">
              RAJA CATTLE FEED
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-light">
              Nourishing the future of livestock with scientifically balanced, nutrient-rich feed for healthier cattle and better yields.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-8 h-12 shadow-lg hover:transform hover:-translate-y-1 transition-all">
                  Shop Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 font-bold text-lg px-8 h-12 bg-transparent">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Leaf, title: "100% Natural", desc: "Made from organic ingredients without harmful additives." },
              { icon: ShieldCheck, title: "Quality Assured", desc: "Lab tested for optimal nutrition and safety standards." },
              { icon: Truck, title: "Fast Delivery", desc: "Reliable shipping across the region directly to your farm." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-6 rounded-2xl bg-secondary/20 border border-secondary hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-2 text-primary">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent font-bold uppercase tracking-wider text-sm">Best Sellers</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 text-primary">Featured Products</h2>
            </div>
            <Link href="/products">
              <Button variant="link" className="text-primary font-bold group">
                View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-primary text-white overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
              <img 
                src="/images/farmer.png" 
                alt="Farmer with cattle" 
                className="rounded-2xl shadow-2xl relative z-10 border-4 border-white/10"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent p-6 rounded-xl shadow-xl z-20 max-w-xs hidden md:block">
                <p className="font-serif font-bold text-xl mb-1">"Best feed I've used in 15 years."</p>
                <p className="text-sm opacity-80">- Ram Singh, Dairy Farmer</p>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Committed to Farmer Prosperity</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                At Raja Cattle Feed, we understand that healthy cattle mean a wealthy farmer. 
                Our scientifically formulated feed blends traditional wisdom with modern nutritional science 
                to ensure your livestock thrives.
              </p>
              <ul className="space-y-3">
                {["Increased Milk Yield", "Better Immunity", "Improved Digestion", "Cost Effective"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium">
                    <CheckCircle2 className="text-accent h-6 w-6" /> {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/about">
                  <Button className="bg-white text-primary hover:bg-gray-100 font-bold">Learn Our Story</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
