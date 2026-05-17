import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "Prophub · PF 群英 — 自营交易公司大全";

createRoot(document.getElementById("root")!).render(<App />);
