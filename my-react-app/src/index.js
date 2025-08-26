// src/App.js
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import ApproveTokens from "./pages/approve";
import Stake from "./pages/stake";
import UpdatePlatform from "./pages/updatePlatform";
import Withdraw from "./pages/withdrawTokens";
import Reward from "./pages/rewards";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="stake" element={<Stake />} />
          <Route path="update" element={<UpdatePlatform />} />
          <Route path="reward" element={<Reward />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="contact" element={<Contact />} />
          <Route path="approve" element={<ApproveTokens />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
