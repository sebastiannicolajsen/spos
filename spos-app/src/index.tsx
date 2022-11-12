import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./index.css";
import AdminPage from "./pages/admin/AdminPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LoginPage from "./pages/login/LoginPage";
import MobilePage from "./pages/mobile/MobilePage";
import PosPage from "./pages/pos/PosPage";
import { TransactionPage } from "./pages/transactions/TransactionPage";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

document.body.className = "font-sans bg-slate-50";

root.render(
  <React.StrictMode>
    <div>
      <BrowserRouter>
        {"/login" !== window.location.pathname && <Header />}
        <Toaster />
        <div className="container mx-auto bg-white p-10  w-2/3">
          <Routes>
            <Route path="/" element={<MobilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="*" element={<MobilePage />} />
          </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
