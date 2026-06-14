"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
  exit: { opacity: 0, y: -8, transition: { when: "afterChildren" } },
};

const staggerVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  enter: { opacity: 1, y: 0 },
};

export function PageMotion({ children, className, ...props }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={className}
      {...(props as ComponentProps<"div">)}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, ...props }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerVariants} initial="hidden" animate="enter" className={className} {...(props as ComponentProps<"div">)}>
      {children}
    </motion.div>
  );
}

export function MotionButton(props: ComponentProps<"button">) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(16,24,40,0.08)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
      {...props}
    />
  );
}

export const cardHover = {
  whileHover: { scale: 1.02, boxShadow: "0 14px 35px rgba(16,24,40,0.12)" },
  whileTap: { scale: 0.995 },
  transition: { duration: 0.22, ease: [0.2, 0.9, 0.15, 1] },
};

export default null;
