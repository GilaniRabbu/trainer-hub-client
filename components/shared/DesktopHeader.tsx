"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Sun,
  Moon,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slice/authSlice";
import Logo from "./Logo";
import MobileHeader from "./MobileHeader";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slice/authSlice";
import { useRouter } from "next/navigation";
import ContainerWrapper from "@/components/common/ContainerWrapper";

interface IServiceProvider {
  _id: string;
  firstName: string;
  lastName: string;
  profession: string;
  hourlyRate: string;
  location: string;
}

export default function DesktopHeader() {
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<IServiceProvider[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleSearch = async (value: string) => {
    if (value.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASEURL
        }/service-providers/search?searchTerm=${encodeURIComponent(value)}`
      );

      if (!res.ok) throw new Error("Failed to fetch search results");

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    }
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigationItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Services",
      href: "/service-providers",
      items: [
        {
          title: "Fitness",
          href: "/service-providers?category=fitness",
          description: "Find personal trainers for strength and fitness",
        },
        {
          title: "Yoga",
          href: "/service-providers?category=yoga",
          description: "Hire certified yoga and flexibility trainers",
        },
        {
          title: "Nutrition",
          href: "/service-providers?category=nutrition",
          description: "Get expert dietary and wellness coaching",
        },
        {
          title: "Therapy",
          href: "/service-providers?category=therapy",
          description: "Book chiropractors and physical therapy experts",
        },
      ],
    },
    {
      title: "Actions",
      href: "/service-providers",
      items: [
        {
          title: "Hire A Service Provider",
          href: "/service-providers",
          description: "Find and connect with verified professionals",
        },
        {
          title: "Become A Service Provider",
          href: "/signup",
          description: "Join our platform and offer your services",
        },
        {
          title: "Contact Support",
          href: "/contact",
          description: "Reach out with your queries, issues, or feedback",
        },
      ],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-background/95 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-5 flex h-16 items-center">
          {/* Logo */}
          <div>
            <Logo />
          </div>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-center">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger className="cursor-pointer bg-transparent">
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                              {item.items.map((subItem) => (
                                <li key={subItem.title}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={subItem.href}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary hover:text-background"
                                    >
                                      <div className="font-bold leading-none">
                                        {subItem.title}
                                      </div>
                                      <p className="line-clamp-2 text-sm leading-snug">
                                        &#8226; {subItem.description}
                                      </p>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 px-0 cursor-pointer"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 px-0 cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 px-0 cursor-pointer md:hidden"
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="pr-0 [&>button]:hidden overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <Logo onClick={() => setOpen(false)} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 cursor-pointer rounded bg-transparent dark:bg-transparent"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <div>
                  <MobileHeader closeSidebar={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            {!user?._id ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer hidden md:block bg-transparent dark:bg-transparent"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer hidden md:block bg-transparent dark:bg-transparent"
                >
                  <Link href="/login">Login</Link>
                </Button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex cursor-pointer items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-slate-700 hover:opacity-85 transition-all"
                >
                  <User className="w-4 h-4" />
                </button>
                {isOpen && (
                  <div className="absolute right-0 z-50 pt-3">
                    <div className="w-40 shadow-md rounded-b-md overflow-hidden bg-gray-100 dark:bg-slate-800">
                      <Link
                        href="/user/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:opacity-85"
                      >
                        <LayoutDashboard className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        Dashboard
                      </Link>
                      <Link
                        href="/user/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:opacity-85"
                      >
                        <Settings className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full cursor-pointer text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:opacity-85"
                      >
                        <LogOut className="h-4 w-4 text-red-600 dark:text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            handleSearch(value);
          }}
        />
        <CommandList>
          {results.length > 0 ? (
            <div className="shadow-sm w-full z-40 relative">
              <ContainerWrapper className="py-4">
                <div className="space-y-4">
                  {results.map((provider) => (
                    <div
                      key={provider._id}
                      className="p-4 border rounded-md transition"
                    >
                      <p className="font-bold">
                        {provider.firstName} {provider.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {provider.profession}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {provider.hourlyRate}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {provider.location}
                      </p>
                      <Link
                        href={`/service-providers/${provider._id}`}
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        Contact Provider
                      </Link>
                    </div>
                  ))}
                </div>
              </ContainerWrapper>
            </div>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
