import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
// import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
// import ProtectedRoutes from "./pages/ProtectedRoutes";
// import TwoFactPage from "./pages/TwoFactPage";

// interface Props {
//   getCookie: (cname: string) => void;
// }

function App() {
  return (
    <BrowserRouter>
      {/* <ToastContainer /> */}
      <Routes>
         {/* <Route element={<ProtectedRoutes />}> */}
          <Route path="/" element={<DashboardPage />} />
        {/* </Route> */}
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/verify" element={<TwoFactPage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;

