import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./index.css";
import CronPage from "./pages/admin/CronPage";
import SubscriberPage from "./pages/admin/SubscriberPage";
import UserPage from "./pages/admin/UserPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LoginPage from "./pages/login/LoginPage";
import MobilePage from "./pages/mobile/MobilePage";
import PosPage from "./pages/pos/PosPage";
import { TransactionPage } from "./pages/transactions/TransactionPage";
import reportWebVitals from "./reportWebVitals";
import api from "./spos-client";
import { SellerRole } from "./spos-client/types";

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
        <div className="mt-10"/>
        <div className="container mx-auto bg-white mt-20 w-2/3 p-10">
          <Routes>
            <Route path="/" element={<MobilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            {api.user.role() !== SellerRole.UNKNOWN && (
              <>
                <Route path="/transactions" element={<TransactionPage />} />
                <Route path="/pos" element={<PosPage />} />
                <Route path="/users" element={<UserPage />} />
                <Route path="/subscribers" element={<SubscriberPage />} />
                <Route path="/cron" element={<CronPage />} />
              </>
            )}

            <Route path="*" element={<MobilePage />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
