// interface Category {
//   name: string;
//   total: number;
// }

// const Categories = () => {
//   const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_BASEURL}/service-providers/categories`,
//           {
//             withCredentials: true, // 🔥 THIS LINE IS ESSENTIAL
//           }
//         );
//         setServiceCategories(res.data.data);
//       } catch (error) {
//         console.error("Failed to fetch categories", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div className="w-full py-16 px-4">
//       <ContainerWrapper>
//         <SectionTitle title="Most Popular Categories" />

//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 h-56 animate-pulse"
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {serviceCategories.map((category, index) => (
//               <Link
//                 href={`/service-providers/categories/${category.name}`}
//                 key={index}
//               >
//                 <div className="group bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-900 rounded-2xl p-6 h-full transition-all duration-300 shadow hover:shadow-lg cursor-pointer flex flex-col items-center text-center">
//                   <div className="w-32 h-32 mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
//                     <User className="w-16 h-16 text-primary" />
//                   </div>
//                   <h3 className="text-xl font-bold text-slate-900 dark:text-slate-300 mb-2 group-hover:text-blue-600 transition-colors">
//                     {category.name}
//                   </h3>
//                   <p className="text-sm text-slate-800 dark:text-slate-200">
//                     {category.total.toLocaleString()} Providers
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </ContainerWrapper>
//     </div>
//   );
// };

"use client";

import React from "react";
import ContainerWrapper from "@/components/common/ContainerWrapper";
import Link from "next/link";
import { SectionTitle } from "../common/SectionTitle";

import {
  FaDumbbell,
  FaSpa,
  FaUserMd,
  FaFistRaised,
  FaMusic,
  FaMicrophoneAlt,
  FaBrain,
  FaAppleAlt,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface Category {
  title: string;
  slug: string;
  icon: IconType;
}

const categories: Category[] = [
  {
    title: "Fitness",
    slug: "fitness",
    icon: FaDumbbell,
  },
  {
    title: "Yoga",
    slug: "yoga",
    icon: FaSpa,
  },
  {
    title: "Chiropractor",
    slug: "chiropractor",
    icon: FaUserMd,
  },
  {
    title: "Boxing",
    slug: "boxing",
    icon: FaFistRaised,
  },
  {
    title: "Dance",
    slug: "dance",
    icon: FaMusic,
  },
  {
    title: "Singing",
    slug: "singing",
    icon: FaMicrophoneAlt,
  },
  {
    title: "Meditation",
    slug: "meditation",
    icon: FaBrain,
  },
  {
    title: "Nutrition",
    slug: "nutrition",
    icon: FaAppleAlt,
  },
];

const Categories = () => {
  return (
    <section className="w-full py-16 px-4">
      <ContainerWrapper>
        <SectionTitle title="Most Popular Categories" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                href={`/service-providers`}
                key={category.slug}
                className="group"
              >
                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-900 rounded-2xl p-6 h-full transition-all duration-300 shadow hover:shadow-lg flex flex-col items-center text-center cursor-pointer">
                  {/* Icon with Backdrop Blur */}
                  <div
                    className="w-32 h-32 mb-4 rounded-2xl flex items-center justify-center
                      bg-white/40 dark:bg-white/10
                      backdrop-blur-md
                      border border-white/30 dark:border-white/10
                      shadow-sm
                      transition-all duration-300
                      group-hover:bg-white/60 dark:group-hover:bg-white/20"
                  >
                    <Icon className="w-16 h-16 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </ContainerWrapper>
    </section>
  );
};

export default Categories;
