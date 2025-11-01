import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingAnimationProps {
  onComplete: () => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [stage, setStage] = useState<"split" | "pause" | "toNavbar" | "fade" | "done">("split");

  useEffect(() => {
    let timers: Array<number | ReturnType<typeof setTimeout>> = [];

    // 1) Split entrance
    timers.push(setTimeout(() => setStage("pause"), 1400));

    // 2) Brief pause while complete logo is visible
    timers.push(setTimeout(() => setStage("toNavbar"), 2300));

    // 3) Move assembled logo to navbar area (slower)
    timers.push(setTimeout(() => {
      // Signal Navbar to show its real logo before we fade the overlay
      try { sessionStorage.setItem('introDismissed', '1'); } catch {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('intro-dismissed'));
      }
      setStage("fade");
    }, 3400));

    // 4) Fade overlay and notify layout to reveal site
    timers.push(setTimeout(() => {
      setStage("done");
      onComplete();
    }, 4000));

    return () => {
      timers.forEach((t) => clearTimeout(t as number));
    };
  }, [onComplete]);

  const isVisible = stage !== "done";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: stage === "fade" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white text-black"
        >
          <div className="relative w-full h-full">
            <motion.div
              id="intro-logo"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={
                stage === "toNavbar"
                  ? { top: 24, left: 24, translateX: 0, translateY: 0, scale: 0.5 }
                : { scale: 1 }
              }
              transition={{ duration: 1.0, ease: "easeInOut" }}
            >
              <div className="relative flex items-center">
                {/* Icon from left */}
                <motion.div
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration:2, ease: "easeOut"}}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-md flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-10 h-10 md:w-12 md:h-12 text-white"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                      <path d="M2 17l10 5 10-5" stroke="white" />
                      <path d="M2 12l10 5 10-5" stroke="white" />
                    </svg>
                  </div>
                </motion.div>

                {/* Text from right */}
                <motion.div
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="ml-4"
                >
                  <h1 className="font-serif text-3xl md:text-4xl font-bold leading-none text-black">
                    TRILOK
                    <br />
                    <span className="text-2xl md:text-3xl">WOODEN ART</span>
                  </h1>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
