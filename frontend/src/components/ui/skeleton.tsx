import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={cn("rounded-md bg-primary/10", className)}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      {...props}
    />
  );
}

export { Skeleton };
