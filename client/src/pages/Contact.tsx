import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContactMessage } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const res = await fetch(api.contact.submit.path, {
        method: api.contact.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Message Sent", description: "We'll get back to you shortly." });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary py-16 text-center">
        <div className="container-custom">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Have questions about our products or need expert advice? We're here to help.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-primary">Get in Touch</h2>
            <div className="grid gap-6">
              {[
                { icon: MapPin, title: "Visit Us", content: "123 Farm Road, Green Valley, Punjab, India 141001" },
                { icon: Phone, title: "Call Us", content: "+91 98765 43210" },
                { icon: Mail, title: "Email Us", content: "info@rajacattlefeed.com" },
                { icon: Clock, title: "Opening Hours", content: "Mon - Sat: 9:00 AM - 6:00 PM" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-secondary">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">{item.title}</h3>
                    <p className="text-muted-foreground">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Static Map Image */}
            <div className="mt-8 rounded-xl overflow-hidden shadow-lg border border-secondary h-64 bg-gray-200 relative">
               <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium">
                  Map Placeholder
               </div>
               {/* In a real app, use an iframe or map component here */}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-secondary">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">Send a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+91..." {...field} value={field.value || ""} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How can we help you?" className="min-h-[120px] bg-background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
