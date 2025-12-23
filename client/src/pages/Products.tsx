import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Products() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary py-16 text-center">
        <div className="container-custom">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">Our Products</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Choose from our premium range of scientifically formulated cattle feed for optimal health and maximum yield.
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-white border-secondary h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Showing {filteredProducts.length} results
          </p>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed">
            <h3 className="text-xl font-bold text-muted-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
