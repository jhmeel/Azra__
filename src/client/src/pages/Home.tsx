import { useState, useEffect } from "react";
import ScrollReveal from "scrollreveal";
import {useLoadScript } from "@react-google-maps/api";
import {

  Menu,
  X,
} from "lucide-react";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";
import styled from "styled-components";
import { Hospital as THospital } from "../types";
import HospitalCards from "../components/HospitalItem";
import HealthFacilityLocator from "../components/HealthFacilityLocator";
const demoHospitals: THospital[] = [
  {
    $id: "1",
    hospitalName: "Yusuf Dantsoho Memorial Hospital",
    hospitalNumber: "1234",
    avatar: "https://example.com/hospital1.jpg",
    status: "available",
    email: "",
    phone: "",
    coordinates: "10.5272,7.4396",
  },
  {
    $id: "2",
    hospitalName: "Ahmadu Bello University Teaching Hospital",
    hospitalNumber: "5678",
    avatar: "https://example.com/hospital2.jpg",
    status: "unavailable",
    email: "",
    phone: "",
    coordinates: "11.0801,7.7069",
  },
  {
    $id: "3",
    hospitalName: "Garki Hospital",
    hospitalNumber: "91011",
    avatar: "https://example.com/hospital3.jpg",
    status: "available",
    email: "",
    phone: "",
    coordinates: "9.0765,7.4983",
  },
  {
    $id: "4",
    hospitalName: "Lagos University Teaching Hospital",
    hospitalNumber: "121314",
    avatar: "https://example.com/hospital4.jpg",
    status: "unavailable",
    email: "",
    phone: "",
    coordinates: "6.5244,3.3792",
  },
  {
    $id: "5",
    hospitalName: "Aminu Kano Teaching Hospital",
    hospitalNumber: "151617",
    avatar: "https://example.com/hospital5.jpg",
    status: "available",
    email: "",
    phone: "",
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
    sr.reveal(".reveal-top", {
      origin: "top",
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

  return (
    <div className="landing-page">
      <Header className="reveal-top">
        <Container>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Logo src="" alt="Logo" />
            <Title>Azra</Title>
          </div>
          <Nav>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <ButtonLink href="/signup">Register Hospital</ButtonLink>
          </Nav>

          <MobileNavToggle onClick={toggleMobileMenu}>
            <Menu />
          </MobileNavToggle>

          {isMobileMenuOpen && (
            <MobileNavContainer isOpen={isMobileMenuOpen}>
              <div
                style={{
                  position: "absolute",
                  left: "100%",
                  cursor: "pointer",
                }}
              >
                <X onClick={() => setIsMobileMenuOpen(false)} />
              </div>
              <MobileNavContent>
                <MobileNavLink href="/about" onClick={toggleMobileMenu}>
                  About
                </MobileNavLink>
                <MobileNavLink href="/contact" onClick={toggleMobileMenu}>
                  Contact
                </MobileNavLink>
                <MobileNavLink href="/blog" onClick={toggleMobileMenu}>
                  Blog
                </MobileNavLink>
                <MobileNavLink href="/dashboard" onClick={toggleMobileMenu}>
                  Dashboard
                </MobileNavLink>
                <ButtonLink primary href="/signup" onClick={toggleMobileMenu}>
                  Register Hospital
                </ButtonLink>
              </MobileNavContent>
            </MobileNavContainer>
          )}
        </Container>

        <Section>
          <SectionContent>
            <SectionTitle>Your Gateway to Exceptional Healthcare</SectionTitle>
            <SectionText>
              Discover top-rated hospitals, book appointments, and connect with
              healthcare providers seamlessly.
            </SectionText>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ButtonLink href="/about">Learn More</ButtonLink>
              <ButtonLink primary href="/signup">
                Register Your Hospital
              </ButtonLink>
            </div>
          </SectionContent>
        </Section>
      </Header>

      <section className="reveal-bottom">
        <HospitalCards
          isLoading={isLoading}
          hospitals={demoHospitals}
          userLocation={userLocation}
        />
      </section>

      <section className="reveal-bottom">
        <HealthFacilityLocator
          isLoaded={isLoaded}
          hospitals={demoHospitals}
          userLocation={userLocation}
          pinIconUrl={""}
        />
      </section>
    </div>
  );
};

export default Home;
const Header = styled.header`
  background: linear-gradient(to right, #4fd1c5, #38b2ac);
  padding: 2rem 0;
  color: white;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  padding: 5px 10px;
`;

const Logo = styled.img`
  height: 3rem;
  width: auto;
  margin-right: 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: white;
  margin-right: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #d2dd7f60;
  }
`;

const MobileNavToggle = styled.button`
  color: white;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavContainer = styled.div<{ isOpen: boolean }>`
  width: 90%;
  box-shadow: 0 2px 4px rgba(41, 138, 150, 0.1);
  padding: 16px;
  position: fixed;
  border-radius: 16px;
  z-index: 100;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-110%)"};

  @media (min-width: 768px) {
    width: 33%;
    max-width: 300px;
    position: relative;
    transform: translateX(0);
  }
`;

const MobileNavContent = styled.div`
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  padding: 1rem;
`;

const MobileNavLink = styled.a`
  display: block;
  color: white;
  margin-bottom: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #38b2ac;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 4rem;
  position: relative;
  padding: 0 15px;
  z-index: 10;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SectionContent = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SectionText = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
`;

const ButtonLink = styled.a`
  background-color: ${(props) => (props.primary ? "#ffc107" : "white")};
  color: ${(props) => (props.primary ? "white" : "#38b2ac")};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 14px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.primary ? "#ffca28" : "#38b2ac")};
    color: white;
  }
`;

