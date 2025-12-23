import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDelivery, setShowDelivery] = useState(false);
  const [delivery, setDelivery] = useState({
    shippingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to checkout.",
        variant: "destructive"
      });
      return;
    }

    if (!delivery.shippingAddress || !delivery.city) {
      toast({
        title: "Complete Delivery Address",
        description: "Please fill in your delivery address.",
        variant: "destructive"
      });
      setShowDelivery(true);
      return;
    }

    if (items.length === 0) return;

    const firstItem = items[0];
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: firstItem.id,
          quantity: firstItem.quantity,
          ...delivery,
        }),
      });

      if (!response.ok) throw new Error('Checkout failed');
      
      const data = await response.json();
      toast({
        title: "Order Placed!",
        description: "Your order has been created. Processing payment...",
      });
      clearCart();
      setTimeout(() => window.location.href = '/orders', 1000);
    } catch (err) {
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order.",
        variant: "destructive"
      });
    }
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
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Order Summary */}
            <Card className="bg-secondary/30 sticky top-4">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Form */}
                {showDelivery ? (
                  <div className="space-y-3 mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Delivery Address</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">Address</Label>
                        <Input
                          placeholder="Street address"
                          value={delivery.shippingAddress}
                          onChange={(e) => setDelivery({...delivery, shippingAddress: e.target.value})}
                          className="text-sm h-8"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">City</Label>
                          <Input
                            placeholder="City"
                            value={delivery.city}
                            onChange={(e) => setDelivery({...delivery, city: e.target.value})}
                            className="text-sm h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">State</Label>
                          <Input
                            placeholder="State"
                            value={delivery.state}
                            onChange={(e) => setDelivery({...delivery, state: e.target.value})}
                            className="text-sm h-8"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">ZIP Code</Label>
                          <Input
                            placeholder="ZIP"
                            value={delivery.zipCode}
                            onChange={(e) => setDelivery({...delivery, zipCode: e.target.value})}
                            className="text-sm h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Phone</Label>
                          <Input
                            placeholder="Phone"
                            value={delivery.phone}
                            onChange={(e) => setDelivery({...delivery, phone: e.target.value})}
                            className="text-sm h-8"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full text-sm h-8 mt-4"
                    onClick={() => setShowDelivery(true)}
                  >
                    Add Delivery Address
                  </Button>
                )}

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
