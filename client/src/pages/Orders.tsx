import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Calendar, Truck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const { user } = useAuth();
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!user,
  });

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <Package className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-serif font-bold">Login Required</h2>
          <p className="text-muted-foreground">Please login to view your orders.</p>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-serif font-bold">My Orders</h1>
          <p className="opacity-80 mt-2">Track and manage your deliveries</p>
        </div>
      </div>

      <div className="container-custom py-12">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No orders yet</p>
            <Link href="/products">
              <Button className="mt-6 bg-primary hover:bg-primary/90">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-primary text-white">₹{parseFloat(order.totalAmount).toFixed(2)}</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Delivery Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery Status</p>
                        <Badge className={getDeliveryStatusColor(order.deliveryStatus)}>
                          {getDeliveryStatusLabel(order.deliveryStatus)}
                        </Badge>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tracking</p>
                          <p className="font-mono text-sm">{order.trackingNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Delivery Address */}
                  {order.shippingAddress && (
                    <div className="flex gap-3 bg-secondary/30 p-4 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery Address</p>
                        <p className="text-sm font-medium">{order.shippingAddress}</p>
                        {order.city && <p className="text-sm text-muted-foreground">{order.city}, {order.state} {order.zipCode}</p>}
                      </div>
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  {order.estimatedDelivery && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-muted-foreground">Estimated Delivery: </span>
                        <span className="font-medium">
                          {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Payment Status */}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Payment Status:</span>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
