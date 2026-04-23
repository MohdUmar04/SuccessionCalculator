import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// HashRouter keeps URLs like site.github.io/repo/#/parsi so GitHub Pages
// doesn't need an SPA 404.html fallback — every navigation stays client-side.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
