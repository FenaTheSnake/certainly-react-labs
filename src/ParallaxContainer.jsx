import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const pageAnimVariants = {
    initial: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.0, ease: [.33,.88,0,1.02] },
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: .5, ease: [.87,.02,.92,.45] },
    }),
  };
export const bgAnimVariants = {
    initial: (direction) => ({
      x: direction > 0 ? "5%" : "-5%",
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.0, ease: [.33,.88,0,1.02] },
    },
    exit: (direction) => ({
      x: direction > 0 ? "-5%" : "5%",
      opacity: 0,
      transition: { duration: .5, ease: [.87,.02,.92,.45] },
    }),
  };
export const bgAnimVariants2 = {
    initial: (direction) => ({
      x: direction > 0 ? "15%" : "-15%",
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.0, ease: [.33,.88,0,1.02] },
    },
    exit: (direction) => ({
      x: direction > 0 ? "-15%" : "15%",
      opacity: 0,
      transition: { duration: .5, ease: [.87,.02,.92,.45] },
    }),
  };

export const ParallaxContainer = ({ children, direction, animation }) => (
    <motion.div
      custom={direction}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animation}
  
      style={{width: '100%'}}
    >
          {children}
    </motion.div>
);