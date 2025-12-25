import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
            RAJA CATTLE FEED
          </h3>
          <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
            Nourishing your livestock with premium quality feed since 2010. We are committed to agricultural excellence.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link href="/products" className="hover:text-accent transition-colors">Products</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-white">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-accent" />
              <span>Meerpur, Meerut, <br />India
                250202</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-accent" />
              <span>+91 9458681229</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-accent" />
              <span>ggoswami240@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-white">Newsletter</h4>
          <p className="text-sm text-primary-foreground/80">Subscribe for updates on new products and farming tips.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email" 
              className="flex-1 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 px-3 py-2 text-sm text-white placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent"
            />
            <button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="container-custom mt-16 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
        <p>&copy; {new Date().getFullYear()} Raja Cattle Feed. All rights reserved.</p>
      </div>
    </footer>
  );
}
