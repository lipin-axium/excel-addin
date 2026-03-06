import { createRoot } from "react-dom/client";
import { initAnalytics, trackEvent } from "../lib/analytics";
import App from "./components/app";
import "./index.css";

const title = "ExcelOS";

const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

Office.onReady(async () => {
  await initAnalytics();
  trackEvent("addin_opened");
  root?.render(<App title={title} />);
});
