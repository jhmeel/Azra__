/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import signupImage from "../../assets/OnlineDoctor-bro .svg";
import { Countries } from "../../utils/formatter";
import { Link, useNavigate } from "react-router-dom";
import { SignupFormData } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { CLEAR_ERRORS } from "../../constants";
import { signup } from "../../actions";
import { LoaderIcon } from "lucide-react";

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>();
  const [message, setMessage] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(Countries[0]);
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
      toast.success("Signed up successfully");
      navigate("/dashboard");
    }
  }, [admin, dispatch, error, navigate]);
  const onSubmit = (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    dispatch<any>(signup(data));

    console.log(data);
  };

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setSelectedLocation(location);
        setValue("coordinates", location);
        setDrawerOpen(false);
      }
    },
    [setValue]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 lg:p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full lg:max-w-6xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <img
            src={signupImage}
            alt="Signup Illustration"
            className="w-full h-auto"
          />
        </div>
        <div className="lg:w-1/2 lg:pl-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>
          {message && (
            <p
              className={`mb-4 p-4 rounded ${
                message.includes("success")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="hospitalName"
                className="block mb-2 font-medium text-gray-700"
              >
                Hospital Name
              </label>
              <input
                id="hospitalName"
                type="text"
                {...register("hospitalName", {
                  required: "Hospital name is required",
                })}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.hospitalName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.hospitalName && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.hospitalName.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="hospitalNumber"
                className="block mb-2 font-medium text-gray-700"
              >
                Hospital Number
              </label>
              <input
                id="hospitalNumber"
                type="text"
                {...register("hospitalNumber", {
                  required: "Hospital number is required",
                })}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.hospitalNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.hospitalNumber && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.hospitalNumber.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="flex">
                <select
                  value={selectedCountry.code}
                  onChange={(e) =>
                    setSelectedCountry(
                      Countries.find((c) => c.code === e.target.value)!
                    )
                  }
                  className="custom-scrollbar px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                >
                  {Countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.domain}
                    </option>
                  ))}
                </select>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className={`w-full px-4 py-2 border rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div>
              <p className="mb-2 font-medium text-gray-700">Location</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="w-full px-4 py-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Select Hospital Location
              </button>
              {selectedLocation && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected Location: {selectedLocation.lat},{" "}
                  {selectedLocation.lng}
                </p>
              )}
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
              {!loading && "Sign Up"}
            </button>
            <p className="text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
            <div>
              <input
                type="checkbox"
                {...register("acceptTerms", {
                  required:
                    "Please accept the terms of service and privacy policy",
                })}
                className="mr-2"
              />
              <label htmlFor="acceptTerms" className="text-gray-700">
                I accept the{" "}
                <a href="/terms-of-service" className="text-blue-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" className="text-blue-500">
                  Privacy Policy
                </a>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 h-3/4 md:h-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-lg font-semibold">
                Select Hospital Location
              </h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 h-full">
              <LoadScript googleMapsApiKey={""}>
                <GoogleMap
                  mapContainerStyle={{ height: "100%", width: "100%" }}
                  center={{ lat: 0, lng: 0 }}
                  zoom={2}
                  onClick={handleMapClick}
                >
                  {selectedLocation && <Marker position={selectedLocation} />}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
