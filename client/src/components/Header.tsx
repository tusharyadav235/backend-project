import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Menu, ShoppingCart, User, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { items } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container-custom flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-serif font-bold text-xl">R</span>
          </div>
          <span className="hidden md:inline-block font-serif font-bold text-xl text-primary tracking-tight">
            RAJA CATTLE FEED
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive(item.href) ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {user?.role === 'admin' && (
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-bold shadow-md"
            >
              ADMIN
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2 text-sm font-medium text-muted-foreground border-b mb-1">
                  Hi, {user.username}
                </div>
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm" className="hidden md:flex bg-primary hover:bg-primary/90">Sign In</Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-serif font-bold text-xl">R</span>
                  </div>
                  <span className="font-serif font-bold text-xl text-primary">
                    RAJA CATTLE
                  </span>
                </div>
                
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {user?.role === 'admin' && (
                   <Link
                    href="/admin"
                    className="text-lg font-bold text-red-600 hover:text-red-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="pt-8 border-t mt-auto">
                  {user ? (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        logoutMutation.mutate();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary">Sign In</Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
