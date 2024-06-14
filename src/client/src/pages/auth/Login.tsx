/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import loginImage from "../../assets/OnlineDoctor-bro .svg";
import { Link, useNavigate } from "react-router-dom";
import { Mail, EyeOff, EyeIcon, Lock, LoaderIcon } from "lucide-react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { CLEAR_ERRORS } from "../../constants";
import { toast } from "sonner";
import { login } from "../../actions";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { admin, error, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERRORS });
    }
    if (admin) {
      toast.success("Logged in successfully");
      navigate("/dashboard");
    }
  }, [admin, dispatch, error, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch<any>(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 lg:p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full lg:max-w-6xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <img src={loginImage} className="w-full h-auto" />
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-gray-700"
              >
                Email
              </label>
              <div className="flex items-center">
                <Mail className="absolute left-3 top-14 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-gray-700"
              >
                Password
              </label>
              <div className="flex items-center">
                <Lock className="absolute left-3 top-14 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-14 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <button
              disabled={loading}
              type="submit"
              className={`w-full px-4 py-2 flex align-middle justify-center gap-5 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading && <LoaderIcon size={20} className="animate-spin" />}
              {!loading && "Login"}
            </button>
            <p className="text-gray-600 text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
