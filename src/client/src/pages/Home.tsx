import { useState, useEffect } from "react";
import ScrollReveal from "scrollreveal";
import { Menu, X } from "lucide-react";
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import { Coordinate, Role } from "../types";
import azraLight from "../assets/azra_light.png";
import HospitalCards from "../components/HospitalItem";
import HealthFacilityLocator from "../components/HealthFacilityLocator";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import medicbag from '../assets/Medicbag.png'
import aider from '../assets/_0044.png'

interface ButtonLink {
  primary?: boolean;
}


const Home = () => {
  const [userLocation, setUserLocation] = useState<Coordinate>({
    lat: 0,
    lng: 0,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, role, accessToken } = useSelector((state: RootState) => state.auth);


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {

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
    <>
      <div className="landing-page">
        <Header className="reveal-top">
          <Container>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Logo src={azraLight} alt="Azra" />
            </div>
            <Nav>
              <NavMain>
                <NavLink className="active-nav" href="/">
                  Home
                </NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/blog">Blog</NavLink>
                {role?.toLowerCase() === Role.HOSPITAL.toLowerCase() ? (
                  <NavLink href="/dashboard">Dashboard</NavLink>
                ) : (
                  role?.toLowerCase() === Role.PATIENT.toLowerCase() && (
                    <NavLink href="/profile">Profile</NavLink>
                  )
                )}
              </NavMain>

              <div className="auth-btns">
                {!accessToken && (
                  <>
                    <ButtonLink href="/login">Login</ButtonLink>
                    <ButtonLink href="/signup" primary>
                      Register
                    </ButtonLink>
                  </>
                )}
              </div>
            </Nav>

            <MobileNavToggle onClick={toggleMobileMenu}>
              <Menu />
            </MobileNavToggle>

            <MobileNavContainer isOpen={isMobileMenuOpen}>
              <MobileNavContent>
                <CloseButton onClick={() => setIsMobileMenuOpen(false)}>
                  <X />
                </CloseButton>
                <MobileNavLink href="/" onClick={toggleMobileMenu}>
                  Home
                </MobileNavLink>
                <MobileNavLink href="/about" onClick={toggleMobileMenu}>
                  About
                </MobileNavLink>
                <MobileNavLink href="/blog" onClick={toggleMobileMenu}>
                  Blog
                </MobileNavLink>
                {role?.toLowerCase() === Role.HOSPITAL.toLowerCase()?  (
                  <MobileNavLink href="/dashboard" onClick={toggleMobileMenu}>
                    Dashboard
                  </MobileNavLink>
                ) : (
                  role?.toLowerCase() === Role.PATIENT.toLowerCase() && (
                    <MobileNavLink href="/profile" onClick={toggleMobileMenu}>
                      Profile
                    </MobileNavLink>
                  )
                )}

                {!user && (
                  <ButtonGroup>
                    {" "}
                    <ButtonLink href="/login" onClick={toggleMobileMenu}>
                      Login
                    </ButtonLink>
                    <ButtonLink
                      primary
                      href="/signup"
                      onClick={toggleMobileMenu}
                    >
                      Register
                    </ButtonLink>
                  </ButtonGroup>
                )}
              </MobileNavContent>
              <SocialIcons>
                <SocialIcon href="#">
                  <FaTwitter />
                </SocialIcon>
                <SocialIcon href="#">
                  <FaInstagram />
                </SocialIcon>
                <SocialIcon href="#">
                  <FaLinkedin />
                </SocialIcon>
                <SocialIcon href="#">
                  <FaFacebook />
                </SocialIcon>
              </SocialIcons>
            </MobileNavContainer>
          </Container>

          <Section className="banner">
            <SectionContent>
              <AnimatedSectionTitle>
                Your Gateway to{" "}
                <HighlightText>Exceptional Healthcare<img style={{display:'inline-block'}} width={60} src={medicbag}/></HighlightText>
              </AnimatedSectionTitle>
              <AnimatedSectionText>
                Discover top-rated hospitals, book appointments, and connect
                with healthcare providers seamlessly.
              </AnimatedSectionText>
          
              <ButtonGroup>
                <ButtonLink href="/about">Learn More</ButtonLink>
                {!user && (
                  <ButtonLink primary href="/signup">
                    Register
                  </ButtonLink>
                )}
              </ButtonGroup>
            </SectionContent>
            <img width={250} src={aider}/>
          </Section>
        </Header>

        <section className="reveal-bottom">
          <HospitalCards
            userLocation={userLocation}
            currentUser={user}
          />
        </section>

        <section className="reveal-bottom">
          <HealthFacilityLocator
            userLocation={userLocation}
          />
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Home;

const Header = styled.header`
  background: linear-gradient(135deg, #000 0%, #38b2ac 100%);
  padding: 1rem 0 4rem;
  color: #fff;
  position: relative;
  overflow: hidden;
    .banner{
  display:flex;
  justify-content:space-between;
  align-items:center;

  @media(max-width:768px){
  justifyicontent:center;
  flex-direction:column;}
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled.img`
  height: 2.2rem;
  width: auto;
`;

const Nav = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  @media (max-width: 768px) {
    display: none;
  }
  .auth-btns {
    display: flex;
    gap: 8px;
  }
`;
const NavMain = styled.nav`
  display: flex;
  height: fit-content;
  gap: 5px;
  align-items: center;
  background-color: rgba(1, 1, 2, 0.3);
  padding: 5px;
  border-radius: 20px;
  box-shadow: 0px 0 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  .active-nav {
    background-color:  #ffd700;
    padding: 2px 8px;
    border-radius: 20px;
    color:#44c2b9;
  }
`;
const NavLink = styled.a`
  position: relative;
  color: white;
  margin-right: 1.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
  font-size: 14px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  &::after {
    content: "▫";
    font-size: 10px;
    position: absolute;
    bottom: 0;
    margin-left: 10px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const MobileNavToggle = styled.button`
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const MobileNavContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  max-width: 300px;
  height: 60vh;
  background-color: rgba(56, 178, 172, 0.3);
  backdrop-filter: blur(10px);
  z-index: 1000;
  transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom-right-radius: 10px;
`;

const MobileNavContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 0 1.5rem;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 2rem;
`;

const MobileNavLink = styled.a`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  transition: opacity 0.3s ease;
  font-size: 14px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  &:hover {
    opacity: 0.8;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(176, 120, 0, 0.1);
  border-bottom-right-radius: 10px;
`;

const SocialIcon = styled.a`
  color: white;
  margin: 0 0.5rem;
  transition: opacity 0.3s ease;
  font-size: 1.5rem;

  &:hover {
    opacity: 0.8;
  }
`;

const Section = styled.div`
  max-width: 1200px;
  margin: 4rem auto 0;
  padding: 0 1rem;

`;

const SectionContent = styled.div`
  max-width: 600px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SectionTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  font-family: 'ulagadi-bold';

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HighlightText = styled.span`
  color: #ffd700;
`;

const SectionText = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  font-family: Zeitung;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ButtonLink = styled.a<ButtonLink>`
  display: inline-block;
  background-color: ${(props) => (props.primary ? "#ffd700" : "transparent")};
  color: ${(props) => (props.primary ? "#38b2ac" : "white")};
  padding: 0.3rem 0.6rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  width: fit-content;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid ${(props) => (props.primary ? "#ffd700" : "white")};

  &:hover {
    background-color: ${(props) =>
      props.primary ? "#fff" : "rgba(255, 255, 255, 0.1)"};
    color: ${(props) => (props.primary ? "#38b2ac" : "white")};
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const textAnimation = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const AnimatedSectionTitle = styled(SectionTitle)`
  animation: ${textAnimation} 1s ease-out;
`;

const AnimatedSectionText = styled(SectionText)`
  animation: ${textAnimation} 1s ease-out 0.3s;
  animation-fill-mode: both;
`;
