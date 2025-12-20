"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Nabila Islam",
    title: "Meditation Student",
    quote:
      "The meditation coach I hired helped me manage stress and build a daily mindfulness habit. The experience was seamless.",
  },
  {
    name: "Rafi Chowdhury",
    title: "Nutrition Client",
    quote:
      "Working with a nutrition coach transformed my eating habits. The platform made it easy to find certified professionals.",
  },
  {
    name: "Mithila Roy",
    title: "Dance Learner",
    quote:
      "I found an amazing dance instructor who matched my learning style perfectly. Booking and communication were effortless.",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : (prev - 1) % testimonials.length
    );

  const current = testimonials[index];

  return (
    <section className="py-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary">
        What Our Users Say
      </h2>
      <div className="relative max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="px-8 py-14 text-center rounded-2xl relative border italic"
          >
            <Quote className="absolute top-4 left-4 w-8 h-8 rotate-180 opacity-50" />
            <Quote className="absolute bottom-4 right-4 w-8 h-8 opacity-50" />
            <p className="mb-4 max-w-xl mx-auto text-balance">{`"${current.quote}"`}</p>
            <h4 className="text-lg font-semibold">{current.name}</h4>
            <p className="font-medium">{current.title}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center items-center gap-4 mt-10">
        <button className="cursor-pointer border rounded-md p-2" onClick={prev}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="cursor-pointer border rounded-md p-2" onClick={next}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
