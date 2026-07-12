"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  House,
  PackageSearch,
  PhoneCall,
  Menu,
  X,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CartButton from "./CartButton";
import UserMenuButton from "./UserMenuButton";
import SearchDropdown from "./SearchDropdown";
import Image from "next/image";
import { WhatsAppIcon } from "@/socialCustomSVGIcon/SocialCustomSVGIcon";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: House },
  { label: "Track Order", href: "/track-order", icon: PackageSearch },
  { label: "Contact", href: "/contact", icon: PhoneCall },
];

// ✅ Desktop Nav Links
function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string): boolean => {
    const [basePath, query] = href.split("?");
    if (basePath === "/") return pathname === "/";
    if (query) {
      const [key, value] = query.split("=");
      return pathname === basePath && searchParams.get(key) === value;
    }
    if (basePath === "/products") {
      const isOffersActive = searchParams.get("sale") === "true";
      if (isOffersActive) return false;
      return pathname.startsWith("/products");
    }
    return pathname.startsWith(basePath);
  };

  return (
    <div
      className="hidden lg:flex items-center gap-1"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
              active
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <Icon className="size-4" />
            <span>{label}</span>
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

// ✅ Mobile Nav Links
function MobileNavLinks({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string): boolean => {
    const [basePath, query] = href.split("?");
    if (basePath === "/") return pathname === "/";
    if (query) {
      const [key, value] = query.split("=");
      return pathname === basePath && searchParams.get(key) === value;
    }
    if (basePath === "/products") {
      const isOffersActive = searchParams.get("sale") === "true";
      if (isOffersActive) return false;
      return pathname.startsWith("/products");
    }
    return pathname.startsWith(basePath);
  };

  return (
    <nav
      className="container mx-auto px-4 py-3 space-y-1"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              active
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-colors",
                active ? "bg-primary/20" : "bg-accent/50",
              )}
            >
              <Icon className="size-4" />
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ✅ Route change হলে menu/search বন্ধ
function NavigationCloser({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onClose();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [pathname, searchKey, onClose]);

  return null;
}

export default function NavbarClient() {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  useEffect(() => {
    // Other window event listeners can go here if needed in the future
  }, []);

  // stable callback — route change এ সব বন্ধ
  const handleNavigationClose = useCallback(() => {
    setMobileOpen(false);
    setShowSearch(false);
  }, []);



  // Mobile toggle — search বন্ধ করে
  const handleMobileToggle = () => {
    setShowSearch(false);
    setMobileOpen((o) => !o);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-border/40 w-full h-12">
        <div className="container mx-auto flex h-full items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 active:scale-95 shrink-0"
            aria-label="Paikarian Homepage"
          >
            <Image
              src="/logo.svg"
              alt="Paikarian logo"
              width={64}
              height={64}
              priority
             
            />
            <span className="text-xl font-bold tracking-tight ">
              পাইকারিয়ান
            </span>
          </Link>

          {/* Desktop Nav */}
          <Suspense
            fallback={
              <div className="hidden lg:flex items-center gap-4">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground"
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            }
          >
            <NavLinks />
          </Suspense>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
              onClick={handleSearchToggle}
              aria-label="Search"
              aria-expanded={showSearch}
              aria-controls="navbar-search-dropdown"
            >
              {showSearch ? (
                <X className="size-4" />
              ) : (
                <Search className="size-4" />
              )}
            </Button> */}

            <CartButton />
            <UserMenuButton />

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:hidden rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
              onClick={handleMobileToggle}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Route change listener */}
      <Suspense fallback={null}>
        <NavigationCloser onClose={handleNavigationClose} />
      </Suspense>

      {/* Search Dropdown */}
      {showSearch && (
        <div
          id="navbar-search-dropdown"
          className="fixed top-12 left-0 right-0 z-60"
        >
          <SearchDropdown onClose={() => setShowSearch(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-12 z-45 bg-black/60 animate-in fade-in duration-200 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="fixed top-12 left-0 right-0 z-55 lg:hidden bg-popover/95 shadow-2xl animate-in slide-in-from-top-2 duration-200"
            style={{ backdropFilter: "blur(30px) saturate(180%)" }}
          >
            <Suspense
              fallback={
                <div className="p-4 text-sm text-muted-foreground">
                  লোডিং...
                </div>
              }
            >
              <MobileNavLinks onClose={() => setMobileOpen(false)} />
            </Suspense>
          </div>
        </>
      )}



      
    </>
  );
}
