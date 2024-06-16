import { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./global.css";
import { toast } from "sonner";
import { Unplug } from "lucide-react";
import ChatWindow from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/Notfound";
import MainLoader from "./components/Loaders/MainLoader";
const PingChat = lazy(() =>import("./components/PingChatRoom"))
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Login = lazy(() => import("./pages/auth/Login"));
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

  useEffect(() => {
    toast("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  }, []);

  return (
    <>
      <Suspense fallback={<MainLoader />}>
        {!["/login", "/#/login", "/signup", "/#/signup"].includes(pathname) && (
          <>{/* header*/}</>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/ping-chat" element={<PingChat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
