import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "Prophub — 自营交易公司大全";

createRoot(document.getElementById("root")!).render(<App />);
