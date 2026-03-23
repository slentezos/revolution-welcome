import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

interface TestimonialsCarouselProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

const TestimonialsCarousel = ({
  title = "What People Say",
  subtitle,
  testimonials
}: TestimonialsCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setActiveIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setActiveIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
  };

  return (
    <section className="py-20 px-4 bg-muted/50 min-h-[80vh] flex items-center">
      <div className="container mx-auto max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex items-center gap-6"
        >
          {/* Main testimonial card */}
          <div className="flex-1 overflow-hidden rounded-xl bg-background shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid md:grid-cols-2 gap-0"
              >
                {/* Quote section */}
                <div className="p-10 md:p-14 flex flex-col justify-center">
                  {/* Large quote icon */}
                  <div className="text-primary text-6xl font-serif mb-8 leading-none">
                    "
                  </div>
                  <p className="text-lg md:text-xl text-foreground mb-8 leading-relaxed">
                    {testimonials[activeIndex].quote}
                  </p>
                  <div>
                    <p className="font-bold text-foreground text-xl">
                      {testimonials[activeIndex].name}
                    </p>
                    <p className="text-muted-foreground text-lg">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>

                {/* Image section */}
                <div className="relative h-80 md:h-auto min-h-[380px] md:min-h-[480px]">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Vertical navigation */}
          <div className="flex flex-col items-center gap-3">
            {/* Up arrow */}
            <button
              onClick={goToPrevious}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            {/* Pagination dots */}
            <div className="flex flex-col gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === activeIndex
                      ? "bg-primary scale-110"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Down arrow */}
            <button
              onClick={goToNext}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
