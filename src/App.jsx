import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import "./App.css";

const ParsiCalculator = lazy(() => import("./pages/ParsiCalculator"));
const ChristianCalculator = lazy(() => import("./pages/ChristianCalculator"));
const Article = lazy(() => import("./pages/Article"));

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
};

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 rounded-full border-2 border-accent-400/30 border-t-accent-400 animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/parsi"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
              <Suspense fallback={<PageFallback />}>
                <ParsiCalculator />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/christian"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
              <Suspense fallback={<PageFallback />}>
                <ChristianCalculator />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/article"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
              <Suspense fallback={<PageFallback />}>
                <Article />
              </Suspense>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}
