import { useEffect } from "react";
import AsideLogo from "../components/AsideLogo";
import AuthForm from "../components/AuthForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

let username: string;

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
     username = getCookie("username");
    if (username) {
      toast.error(`🦄 You are already logged in!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate("/");
    }
  }, []);

  function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  return (
    <div id="app">
      <div className="d-flex">
        <AsideLogo />
        <AuthForm page="login" />
      </div>
    </div>
  );
};

export default LoginPage;
