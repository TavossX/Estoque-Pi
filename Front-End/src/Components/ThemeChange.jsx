import { useState, useEffect } from "react";

export default function ThemeChange() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return (
        savedTheme === "dark" ||
        (!savedTheme &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <label className="relative w-8 h-8 cursor-pointer text-gray-400 dark:text-yellow-300">
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="opacity-0 absolute inset-0 w-full h-full z-10 cursor-pointer"
      />
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
        stroke="none"
        className={`transition-transform duration-400 ease-in-out w-full h-full ${
          isDark ? "rotate-[90deg]" : "rotate-[40deg]"
        }`}
      >
        <mask id="moon-mask">
          <rect width="20" height="20" fill="white" />
          <circle
            cx="11"
            cy="3"
            r="8"
            fill="black"
            className={`transition-transform duration-[640ms] ease-[cubic-bezier(0.41,0.64,0.32,1.575)] ${
              isDark ? "translate-x-4 -translate-y-[0.75rem]" : ""
            }`}
          />
        </mask>

        <circle
          cx="10"
          cy="10"
          r="8"
          mask="url(#moon-mask)"
          className={`transition-transform origin-center ${
            isDark ? "scale-[0.55]" : "scale-[1]"
          }`}
        />

        <g>
          {[...Array(6)].map((_, i) => (
            <circle
              key={i}
              className={`origin-center transform transition-all duration-300 ${
                isDark ? "animate-[showRay1832_0.4s_ease_forwards]" : "scale-0"
              }`}
              cx={[18, 14, 6, 2, 6, 14][i]}
              cy={[10, 16.928, 16.928, 10, 3.1718, 3.1718][i]}
              r="1.2"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </g>
      </svg>

      <style>{`
        @keyframes showRay1832 {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>
    </label>
  );
}
