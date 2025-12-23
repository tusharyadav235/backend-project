import { Leaf, Droplets, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">About Raja Cattle Feed</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            A legacy of trust, quality, and commitment to the farming community since 2010.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <span className="text-accent font-bold uppercase tracking-wider">Our Mission</span>
            <h2 className="text-3xl font-serif font-bold text-primary">Nurturing Livestock, Empowering Farmers</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Our mission is simple: to provide the highest quality nutritional solutions for livestock that improve health, productivity, and profitability for farmers. We believe that when cattle thrive, farmers prosper.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We combine traditional knowledge of animal husbandry with modern nutritional science to create feed blends that deliver real results.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/10 rounded-2xl transform rotate-3"></div>
            <img 
              src="/images/hero.png" 
              alt="Farm landscape" 
              className="rounded-2xl shadow-xl relative z-10 w-full object-cover h-[400px]"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide every bag of feed we produce.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: "Purity", desc: "We use only the finest natural ingredients, free from harmful chemicals and fillers." },
              { icon: Droplets, title: "Nutrition", desc: "Scientifically balanced formulas ensuring complete nutrition for every stage of growth." },
              { icon: Shield, title: "Integrity", desc: "Honest pricing, consistent quality, and transparent business practices." }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-secondary text-center"
              >
                <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-3 text-primary">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team / Story */}
        <div className="bg-secondary/30 rounded-3xl p-8 md:p-16 text-center">
          <Users className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Community</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We don't just sell feed; we build relationships. With a network of over 5000+ satisfied farmers across the region, Raja Cattle Feed has become a household name trusted by generations.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-12">
            {[
              { label: "Years Experience", value: "14+" },
              { label: "Happy Farmers", value: "5000+" },
              { label: "Products", value: "25+" },
              { label: "Quality Checks", value: "100%" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
