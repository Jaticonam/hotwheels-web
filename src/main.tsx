import { createRoot } from "react-dom/client";
import AOS from "aos";

import "aos/dist/aos.css";
import "./index.css";
import "./styles/base/themes.css";

import ThemeToggle from "./shared/components/theme/ThemeToggle";
import { initializeTheme } from "./shared/theme/theme";

import App from "./App.tsx";

AOS.init({
  duration: 600,
  easing: "ease-out-cubic",
  once: true,
  offset: 60,
});

initializeTheme();

createRoot(document.getElementById("root")!).render(<>
        <App />
        <ThemeToggle />
      </>);
