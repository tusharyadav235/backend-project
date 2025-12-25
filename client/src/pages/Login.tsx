import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export default function Login() {
  const { loginMutation, registerMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-serif font-bold text-3xl">R</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Raja Cattle Feed
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isRegister ? "Create a new account" : "Sign in to your account"}
          </p>
        </div>

        <Card className="border-secondary shadow-xl">
          <CardHeader>
            <CardTitle>{isRegister ? "Sign Up" : "Sign In"}</CardTitle>
            <CardDescription>
              {isRegister ? "Enter your details below to create your account" : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRegister ? (
              <RegisterForm onSuccess={() => setLocation("/")} mutation={registerMutation} />
            ) : (
              <LoginForm onSuccess={() => setLocation("/")} mutation={loginMutation} toast={toast} />
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 bg-gray-50 rounded-b-xl">
            <Button variant="ghost" onClick={() => setIsRegister(!isRegister)} className="text-primary font-bold hover:bg-transparent">
              {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function LoginForm({ onSuccess, mutation, toast }: { onSuccess: () => void, mutation: any, toast: any }) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    mutation.mutate(data, { onSuccess });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            type="button"
            className="px-0 text-xs text-muted-foreground hover:bg-transparent"
            onClick={() => {
              toast({
                title: "Forgot Password",
                description: "Please contact support at ggoswami240@gmail.com to reset your password.",
              });
            }}
          >
            Forgot Password?
          </Button>
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm({ onSuccess, mutation }: { onSuccess: () => void, mutation: any }) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", fullName: "", email: "" },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    mutation.mutate(data, { onSuccess });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Choose a username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Choose a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
