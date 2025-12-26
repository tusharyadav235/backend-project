import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct, type Product } from "@shared/schema";
import { useCreateProduct, useProducts, useDeleteProduct } from "@/hooks/use-products";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trash2, 
  Package, 
  MapPin, 
  Phone, 
  User as UserIcon,
  LayoutDashboard,
  PlusCircle,
  ShoppingCart,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("products");

  if (authLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user || user.role !== 'admin') {
    setLocation("/login");
    return null;
  }

  const tabs = [
    { id: "products", label: "Inventory", icon: Package },
    { id: "add-product", label: "Add Product", icon: PlusCircle },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "notifications", label: "Notifications", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white p-6 space-y-8 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">Admin Panel</h2>
          <p className="text-primary-foreground/60 text-sm">Raja Cattle Feed</p>
        </div>
        
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? "bg-white text-primary font-bold shadow-sm" 
                  : "hover:bg-white/10 text-white/80"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-auto">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <Link href="/">
            <Button variant="outline" data-testid="button-view-site">View Site</Button>
          </Link>
        </header>

        {activeTab === "products" && <ProductList />}
        {activeTab === "add-product" && <AddProductForm />}
        {activeTab === "orders" && <OrderManagement />}
        {activeTab === "notifications" && <MessageManagement />}
      </div>
    </div>
  );
}

function MessageManagement() {
  const { data: messages, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/messages"],
  });

  if (isLoading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="grid gap-6">
      {messages?.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500">No Notifications</h3>
          <p className="text-muted-foreground">Customer queries will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages?.map((msg) => (
            <Card key={msg.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{msg.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    New Query
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{msg.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-bold text-primary">Email:</span>
                    <span className="font-medium text-foreground">{msg.email}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="max-w-xs"
                          data-testid="input-product-image-file"
                        />
                        {isUploading && <span className="text-sm text-muted-foreground animate-pulse">Uploading...</span>}
                      </div>
                      <div className="h-40 w-40 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted">
                        {field.value ? (
                          <img src={field.value} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-muted-foreground text-center p-2">No image selected</span>
                        )}
                      </div>
                      <Input type="hidden" {...field} />
                    </div>
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
