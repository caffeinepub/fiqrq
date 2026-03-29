import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import More from "./pages/More";
import QuranReader from "./pages/QuranReader";
import Study from "./pages/Study";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          minHeight: "100dvh",
          backgroundColor: "#0d0b06",
          position: "relative",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quran" element={<QuranReader />} />
          <Route path="/study" element={<Study />} />
          <Route path="/more" element={<More />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
