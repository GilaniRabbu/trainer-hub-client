"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";

interface IServiceProvider {
  _id: string;
  firstName: string;
  lastName: string;
  profession: string;
  hourlyRate: string;
  location: string;
}

export default function Hero() {
  const [results, setResults] = React.useState<IServiceProvider[]>([]);
  const [query, setQuery] = React.useState("");
  const [showDropdown, setShowDropdown] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Close dropdown & clear results when query is empty
  React.useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setShowDropdown(false);
    }
  }, [query]);

  // Outside click closes dropdown
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Optional: simple debounce to reduce API calls
  const debounceRef = React.useRef<number | null>(null);
  const handleSearch = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    // Debounce 250ms
    debounceRef.current = window.setTimeout(async () => {
      if (value.trim() === "") {
        // ensure clearing if user removed text
        setResults([]);
        setShowDropdown(false);
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
        setResults(Array.isArray(data.data) && data.success ? data.data : []);
        // show dropdown even if no results so CommandEmpty can display
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setShowDropdown(true);
      }
    }, 250);
  };

  return (
    <section className="relative bg-gradient-to-b from-sky-200 via-background to-background dark:from-black dark:via-background dark:to-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-10 md:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white">
            Trusted by 10,000+ Client
          </span>
          <h1 className="mb-6 mt-4 text-4xl font-bold md:text-6xl">
            Find the Perfect Personal Trainer Near You
          </h1>
          <p className="mb-6 text-sm text-foreground sm:text-xl lg:mb-8">
            Get matched with skilled trainers for strength, weight loss,
            flexibility, or overall wellness—anytime, anywhere.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto" ref={containerRef}>
            <div className="flex items-center gap-3 border rounded-xl px-3 py-3 bg-white dark:bg-slate-900 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="What service are you looking for?"
                className="w-full bg-transparent outline-none text-sm md:text-base text-gray-800 dark:text-gray-200 placeholder-gray-400"
              />
              <button className="px-4 py-1 cursor-pointer rounded-lg bg-foreground text-background">
                Search
              </button>
            </div>

            {showDropdown && (
              <div className="absolute mt-2 w-full rounded-xl shadow-lg border bg-white dark:bg-slate-900 z-50">
                <Command className="w-full">
                  <CommandList className="max-h-60 overflow-y-auto">
                    {results.length > 0 ? (
                      <CommandGroup heading="Service Providers">
                        {results.map((provider) => (
                          <CommandItem
                            key={provider._id}
                            className="cursor-pointer flex flex-col items-start gap-1 p-4"
                          >
                            <Link
                              href={`/service-providers/${provider._id}`}
                              className="w-full"
                              onClick={() => {
                                setShowDropdown(false);
                                // optionally setQuery to provider name if you want:
                                // setQuery(`${provider.firstName} ${provider.lastName}`)
                              }}
                            >
                              <p className="font-semibold">
                                {provider.firstName} {provider.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {provider.profession}
                              </p>
                              <p className="text-sm text-gray-500">
                                Rate: {provider.hourlyRate}
                              </p>
                              <p className="text-sm text-gray-500">
                                {provider.location}
                              </p>
                            </Link>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6">
          <div className="flex flex-wrap flex-row items-center justify-center gap-4 mx-auto">
            <Image
              src={"/play-btn.svg"}
              alt="Google Play Button"
              width={136}
              height={64}
              className="object-cover cursor-pointer"
            />
            <Image
              src={"/store-btn.svg"}
              alt="App Store Button"
              width={136}
              height={64}
              className="object-cover cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
