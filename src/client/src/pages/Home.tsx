import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "scrollreveal";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
  HospitalIcon,
  MessageCircleDashed,
  Search,
  Send,
  MessageCircle,
  Hospital,
} from "lucide-react";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";

import Footer from "../components/Footer";
import PingForm from "../components/PingForm";
import {Hospital as THospital } from "../types"; 
import { getDistanceFromLatLonInKm } from "../utils/formatter";
const demoHospitals: THospital[] = [
  {
    $id: "1",
    hospitalName: "Yusuf Dantsoho Memorial Hospital",
    hospitalNumber: "1234", 
    avatar: "https://example.com/hospital1.jpg",
    status: "available", 
    email: '', 
    phone: '', 
    coordinates: "10.5272,7.4396", 
  },
  {
    $id: "2",
    hospitalName: "Ahmadu Bello University Teaching Hospital",
    hospitalNumber: "5678", 
    avatar: "https://example.com/hospital2.jpg",
    status: 'unavailable', 
    email: '', 
    phone: '', 
    coordinates: "11.0801,7.7069", 
  },
  {
    $id: "3",
    hospitalName: "Garki Hospital",
    hospitalNumber: "91011", 
    avatar: "https://example.com/hospital3.jpg",
    status: "available", 
    email: '', 
    phone: '', 
    coordinates: "9.0765,7.4983", 
  },
  {
    $id: "4",
    hospitalName: "Lagos University Teaching Hospital",
    hospitalNumber: "121314", 
    avatar: "https://example.com/hospital4.jpg",
    status: 'unavailable', 
    email: '', 
    phone: '', 
    coordinates: "6.5244,3.3792", 
  },
  {
    $id: "5",
    hospitalName: "Aminu Kano Teaching Hospital",
    hospitalNumber: "151617", 
    avatar: "https://example.com/hospital5.jpg",
    status: "available", 
    email: '', 
    phone: '', 
    coordinates: "12.0022,8.5167", 
  },
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hospitals, setHospitals] = useState<THospital[]>([]);
  const [userLocation, setUserLocation] = useState({
    lat: 0, 
    lng: 0, 
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("available");
  const [selectedDistance, setSelectedDistance] = useState("5");
  const [pingFormActive, setPingormActive] = useState<boolean>(false);
  const [selectedHospial, setSelectedHospital] = useState<THospital|null>(null);
 
  const handlePing = (hospital:THospital) => {
    setPingormActive(!pingFormActive);
    setSelectedHospital(hospital);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  useEffect(() => {
    setTimeout(() => {
      setHospitals(demoHospitals);
      setIsLoading(false);
    }, 2000);

    const sr = ScrollReveal();
    sr.reveal(".reveal-left", {
      origin: "left",
      distance: "50px",
      duration: 1000,
      delay: 300,
    });
    sr.reveal(".reveal-right", {
      origin: "right",
      distance: "50px",
      duration: 1000,
      delay: 300,
    });
    sr.reveal(".reveal-bottom", {
      origin: "bottom",
      distance: "50px",
      duration: 1000,
      delay: 300,
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        console.log("Error getting user location");
      }
    );
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (status:string) => {
    setSelectedStatus(status);
  };

  const handleDistanceFilter = (distance: string) => {
    setSelectedDistance(distance);
  };
  
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.hospitalName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "" || hospital.status === selectedStatus;
  
    // Calculate distance only if selected distance is provided
    const withinDistance =
      selectedDistance === "" ||
      getDistanceFromLatLonInKm(
        userLocation.lat,
        userLocation.lng,
        parseFloat(hospital.coordinates.split(',')[0]),
        parseFloat(hospital.coordinates.split(',')[1])
      ) <= parseFloat(selectedDistance);
  
    return matchesSearch && matchesStatus && withinDistance;
  });
  

  return (
    <div className="landing-page">
      <header className="bg-gradient-to-r from-teal-500 to-emerald-500 py-8 text-white relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url('https://example.com/healthcare-banner-bg.jpg')",
          }}
        ></div>
        <div className="container mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <img
              src="https://example.com/logo.png"
              alt="Logo"
              className="h-12 w-auto mr-4"
            />
            <h1 className="text-2xl font-bold text-white drop-shadow-md">
              Azra
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/blog"
              className="text-white hover:text-teal-200 transition duration-300"
            >
              Blog
            </Link>
            <Link
              to="/community"
              className="text-white hover:text-teal-200 transition duration-300"
            >
              Community
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-teal-200 transition duration-300"
            >
              About
            </Link>
            <Link
              to="/dashboard"
              className="text-white hover:text-teal-200 transition duration-300"
            >
              Dashboard
            </Link>
            <Link
              to="/signup"
              className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-300 shadow-md"
            >
              Register Hospital
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              className="text-white focus:outline-none"
              onClick={toggleMobileMenu}
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 z-50 ">
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 mx-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/blog"
                  className="text-white hover:text-teal-200 transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Blog
                </Link>
                <Link
                  to="/community"
                  className="text-white hover:text-teal-200 transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Community
                </Link>
                <Link
                  to="/about"
                  className="text-white hover:text-teal-200 transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-white hover:text-teal-200 transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Contact
                </Link>
                <Link
                  to="/signup"
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-300 shadow-md text-center"
                  onClick={toggleMobileMenu}
                >
                  Register Hospital
                </Link>
              </nav>
              <div className="flex justify-center space-x-4 mt-6">
                <a
                  href="https://twitter.com/yourhealthhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-teal-200 transition duration-300"
                >
                  <Twitter size={24} />
                </a>
                <a
                  href="https://instagram.com/yourhealthhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-teal-200 transition duration-300"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://linkedin.com/company/yourhealthhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-teal-200 transition duration-300"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="https://facebook.com/yourhealthhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-teal-200 transition duration-300"
                >
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          </div>
        )}
        <div className="container mx-auto h-[300px] mt-16 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="reveal-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
              Your Gateway to Exceptional Healthcare
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white drop-shadow-md">
              Discover top-rated hospitals, book appointments, and connect with
              healthcare providers seamlessly.
            </p>
            <div className="flex space-x-3">
              <Link
                to="/about"
                className="bg-white text-teal-600 px-3 py-3 rounded-lg hover:bg-teal-100 transition duration-300"
              >
                Learn More
              </Link>
              <Link
                to="/signup"
                className="bg-amber-500 text-white px-3 py-3 rounded-lg hover:bg-amber-600 transition duration-300"
              >
                Register Your Hospital
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-teal-500 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-teal-500 to-transparent"></div>
        <div className="absolute inset-0 bg-white opacity-10 rounded-lg backdrop-filter backdrop-blur-lg"></div>
      </header>

      <section className="w-full my-12 px-4 reveal-bottom">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <div className="flex items-center space-x-2">
              <Hospital className="w-8 h-8 text-purple-500" />
              <span className="text-gray-700 font-medium text-lg">
                Ping Hospital
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              Ping your preferred hospital to alert them about your needs and
              concerns instantly.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Get immediate hospital attention
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <span className="text-gray-700 font-medium text-lg">
                Send Complaints
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              Directly communicate complaints and concerns to the hospital,
              ensuring prompt resolution.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ensure quick issue resolution
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg">
            <div className="flex items-center space-x-2">
              <Send className="w-8 h-8 text-red-500" />
              <span className="text-gray-700 font-medium text-lg">
                Get Real-Time Responses
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              Receive instant responses from the hospital, keeping you informed
              about the progress.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Stay updated in real-time
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto my-12">
        <h2 className="text-2xl font-bold mb-8 text-center reveal-bottom text-gray-700">
          Find Nearby Hospitals
        </h2>
        <div className="flex justify-center mb-8 flex-wrap gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute w-5 h-5 top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border text-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">Available</option>
              <option value="not-available">Not Available</option>
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <select
              value={selectedDistance}
              onChange={(e) => handleDistanceFilter(e.target.value)}
              className="w-full px-4 py-2 border text-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="15">Within 15 km</option>
            </select>
          </div>
        </div>
        <div></div>
        {isLoading ? (
          <div className="spinner text-2xl text-center">Loading...</div>
        ) : filteredHospitals.length === 0 ? (
          <div className="alert text-xl text-blue-500 text-center">
            No hospitals found matching your search criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.$id}
                className={`card rounded-lg shadow-lg p-6 reveal-bottom hover:shadow-2xl transition duration-300 bg-white relative`}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={hospital.avatar}
                    alt={hospital.hospitalName}
                    className="rounded-full w-12 h-12 mr-4"
                  />
                  <div>
                    <div className="font-bold text-lg mb-1 text-teal-500">
                      {hospital.hospitalName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {hospital.coordinates}
                    </div>
                    <div
                      className={`text-sm ${
                        hospital.status === "available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {hospital.status === "available"
                        ? "Available"
                        : "Not Available"}
                      <span
                        className={
                          hospital.status === "available"
                            ? "ripple-animation"
                            : ""
                        }
                      ></span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Distance: {getDistanceFromLatLonInKm(
        userLocation.lat,
        userLocation.lng,
        parseFloat(hospital.coordinates.split(',')[0]),
        parseFloat(hospital.coordinates.split(',')[1])
      )} km
                    </div>
                  </div>
                </div>
                <div className="divider h-px bg-gray-200 mb-4"></div>
                <div className="flex justify-between">
                  <button
                    onClick={() => handlePing(hospital)}
                    className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-300 shadow-md flex items-center"
                  >
                    <HospitalIcon className="mr-2" /> Ping
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto my-12">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-700 reveal-bottom">
          Health Facility Locator
        </h2>
        {isLoaded && userLocation ? (
          <GoogleMap
            mapContainerClassName="map-container h-96 rounded-lg shadow-lg glassmorphism"
            center={userLocation}
            zoom={12}
          >
            <Marker
              position={userLocation}
              icon={{ url: "https://example.com/location-marker.png" }}
            />
            {hospitals.map((hospital) => (
              <Marker
                key={hospital.$id}
                position={{ lat: hospital.coordinates.split(',')[0], lng: hospital.coordinates.split(',')[1] }}
                icon={{ url: "https://example.com/hospital-marker.png" }}
                label={{
                  text: hospital.hospitalName,
                  color: "white",
                  fontSize: "12px",
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="text-center text-gray-500">Loading map...</div>
        )}
      </section>

      <section className="bg-green-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 reveal-bottom text-teal-500 flex items-center justify-center">
            <MessageCircleDashed className="mr-2" /> Connect with Other
            Hospitals
          </h2>
          <p className="text-lg mb-8 reveal-bottom text-gray-700">
            Join a network of care providers. Chat with fellow hospitals, share
            space availability, and exchange ideas to enhance patient care.
          </p>
          <Link
            to="/chat"
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300 shadow-md reveal-bottom"
          >
            Start Collaborating
          </Link>
        </div>
      </section>
      {pingFormActive && (
        <PingForm
          selectedHospital={selectedHospial}
          onClose={() => setPingormActive(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Home;
