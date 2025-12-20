"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const hideHeader =
    pathname.startsWith("/user") || pathname.startsWith("/admin");

  if (hideHeader) return null;

  const pagesLinks = [
    { href: "/", label: "Home" },
    { href: "/service-providers", label: "Hire A Service Provider" },
    { href: "/signup", label: "Become A Service Provider" },
  ];

  const contactInfo = [
    { href: "#", label: "123 Main Street, Downtown" },
    { href: "#", label: "+880 123-456-789" },
    { href: "#", label: "support@trainerhub.com" },
  ];

  return (
    <footer className="py-12">
      <div className="container px-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8 mb-10">
          {/* Logo and Contact Info */}
          <div className="lg:w-4/5">
            <h2 className="text-lg font-semibold mb-4">TrainerHub</h2>
            <p className="text-sm text-muted-foreground">
              TrainerHub connects you with certified personal trainers, yoga
              instructors, nutrition coaches, and wellness experts. Find the
              right coach for your fitness, health, and lifestyle goals —
              anytime, anywhere.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              {pagesLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              {contactInfo.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-5 border-t">
          <p className="text-sm text-center">
            © 2025 TrainerHub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
