import { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./global.css";
import { toast } from "sonner";
import { Unplug } from "lucide-react";

import MainLoader from "./components/Loaders/MainLoader";

const Chat = lazy(() => import("./pages/Chat"));
const HospitalPingChatRoom = lazy(
  () => import("./components/HospitalPingChatRoom")
);
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/Notfound"));
const PingChat = lazy(() => import("./components/PingChatRoom"));
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Login = lazy(() => import("./pages/auth/Login"));
const AboutPage = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const Blog = lazy(() => import("./pages/Blog/Blog"));

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!navigator.onLine) {
      toast("You are currently offline!", {
        style: {
          backgroundColor: "gray",
          color: "#fff",
        },
        icon: <Unplug />,
      });
    }
  }, [pathname]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <>
      <Suspense fallback={<MainLoader />}>
        {!["/login", "/#/login", "/signup", "/#/signup"].includes(pathname) && (
          <></>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/ping-chat" element={<PingChat />} />
          <Route path="/h-ping-chat" element={<HospitalPingChatRoom />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
 
export default App;
