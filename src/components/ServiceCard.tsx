import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  index: number;
}

export default function ServiceCard({ title, description, image, index }: ServiceCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleLearnMore = () => {
    console.log(`Learn more about ${title}`);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card className="group overflow-hidden h-full hover-elevate active-elevate-2 transition-all duration-300 shadow-xl/30 border border-gray-200 bg-background/40 hover:shadow-xl p-2">
        <div className="aspect-[4/4] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 border-b-1 border-gray-200"
          />
        </div>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="font-serif text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base mb-4 line-clamp-3">
            {description}
          </CardDescription>
          <Button
            variant="ghost"
            className="px-0 font-semibold"
            onClick={handleLearnMore}
            data-testid={`button-learn-${title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            Explore More
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
