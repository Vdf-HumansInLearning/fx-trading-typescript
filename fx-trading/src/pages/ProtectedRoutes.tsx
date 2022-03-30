import { Navigate, Outlet } from "react-router-dom";

const getCookie = (cname: string): string => {
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
};

const useAuth = (): boolean => {
    let cookie = getCookie("username");
    const user = { loggedIn: cookie ? true : false };
    return user && user.loggedIn;
};

const ProtectedRoutes = (): JSX.Element => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes; 