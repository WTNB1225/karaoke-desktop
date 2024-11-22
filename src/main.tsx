import ReactDOM from "react-dom/client";
import App from "@/pages/Home";
import "./App.css"
import Play from "@/pages/Play";
import Tauri from "@/pages/Tauri";

import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="play" element={<Play />}></Route>
      <Route path="tauri" element={<Tauri />}></Route>
    </Routes>
  </BrowserRouter>
);
