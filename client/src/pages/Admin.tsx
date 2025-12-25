import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct, type Product } from "@shared/schema";
import { useCreateProduct, useProducts, useDeleteProduct } from "@/hooks/use-products";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Package, MapPin, Phone, User as UserIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (authLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user || user.role !== 'admin') {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-white py-8 shadow-md">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
          <div className="text-sm bg-white/10 px-4 py-2 rounded-full">Logged in as {user.username}</div>
        </div>
      </div>

      <div className="container-custom py-8">
        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="bg-white p-1 shadow-sm border">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductList />
          </TabsContent>
          
          <TabsContent value="add-product">
            <AddProductForm />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OrderManagement() {
  const { data: orders, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/orders"],
  });

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="grid gap-6">
      {orders?.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500">No Orders Yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders?.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-secondary/10 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-primary">Order #{order.id}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={order.status === 'confirmed' ? 'default' : 'outline'}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="w-4 h-4 text-primary" />
                    <span className="font-bold">{order.user?.fullName || order.user?.username || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{order.shippingAddress}, {order.city}, {order.state} {order.zipCode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{order.phone}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Products</p>
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product?.name} x {item.quantity}</span>
                      <span className="font-medium">₹{item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between mt-2 pt-2 border-t font-bold text-primary">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductList() {
  const { data: products, isLoading } = useProducts();
  const deleteMutation = useDeleteProduct();

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products?.map((product) => (
                  <tr key={product.id} className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden">
                        <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4">₹{product.price}</td>
                    <td className="px-6 py-4">{product.discount}%</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(product.id)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddProductForm() {
  const createMutation = useCreateProduct();
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      discount: 0,
      imageUrl: "/images/products.png",
      category: "feed",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("imageUrl", reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: InsertProduct) => {
    // Ensure price is string for decimal type in DB
    createMutation.mutate({ ...data, price: String(data.price) });
    if (!createMutation.error) {
      form.reset();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Premium Buffalo Feed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ""}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
