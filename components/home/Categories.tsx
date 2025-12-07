"use client";

import React, { useEffect, useState } from "react";
import ContainerWrapper from "@/components/common/ContainerWrapper";
import { User } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface Category {
  name: string;
  total: number;
}

const Categories = () => {
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/service-providers/categories`,
          {
            withCredentials: true, // 🔥 THIS LINE IS ESSENTIAL
          }
        );
        setServiceCategories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full py-16 px-4">
      <ContainerWrapper>
        <h2 className="text-3xl font-bold text-primary mb-12">
          Most Popular Categories
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-100 rounded-2xl p-6 h-56 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <Link
                href={`/service-providers/categories/${category.name}`}
                key={index}
              >
                <div className="group bg-slate-200 dark:bg-slate-800 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 flex items-center justify-center">
                    <User className="w-16 h-16 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-300 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    {category.total.toLocaleString()} Providers
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ContainerWrapper>
    </div>
  );
};

export default Categories;
