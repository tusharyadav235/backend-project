import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to checkout.",
        variant: "destructive"
      });
      return;
    }

    // Mock checkout flow for MVP since Razorpay integration requires API keys
    toast({
      title: "Order Placed!",
      description: "Thank you for your order. We will contact you shortly.",
    });
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-primary">Your cart is empty</h2>
          <p className="text-muted-foreground">Looks like you haven't added any feed yet.</p>
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-serif font-bold">Shopping Cart</h1>
          <p className="opacity-80 mt-2">{items.length} items in your cart</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = Number(item.price);
              const discount = item.discount || 0;
              const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
              
              return (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 flex gap-4">
                    <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold text-primary">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">₹{(finalPrice * item.quantity).toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">₹{finalPrice.toFixed(2)} / unit</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-1">
                          <button 
                            className="p-1 hover:bg-white rounded-md transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-white rounded-md transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <Link href="/products">
              <Button variant="link" className="pl-0 text-primary font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-serif font-bold text-xl text-primary">Order Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{(total * 0.05).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{(total * 1.05).toFixed(2)}</span>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
                
                {!user && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    You'll need to sign in to complete your order.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
