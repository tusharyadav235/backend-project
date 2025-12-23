import { type Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  // Calculate discounted price
  const price = Number(product.price);
  const discount = product.discount || 0;
  const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col group bg-white">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl || "/images/products.png"} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
              {discount}% OFF
            </div>
          )}
        </div>
        
        <CardHeader className="p-4 pb-0 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-accent uppercase tracking-wider">Cattle Feed</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
          </div>
          <h3 className="font-serif font-bold text-lg text-primary line-clamp-1">{product.name}</h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 bg-gray-50/50 mt-auto">
          <div className="flex flex-col">
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">₹{price.toFixed(2)}</span>
            )}
            <span className="font-bold text-xl text-primary">₹{discountedPrice.toFixed(2)}</span>
          </div>
          
          <Button 
            onClick={() => addToCart(product)} 
            size="sm"
            className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
