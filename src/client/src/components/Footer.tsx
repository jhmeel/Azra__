import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import Config from "../Config";
import azraLight from "../assets/azra_light.png";

const Footer = () => {
  return (
    <StyledFooter>
      <img className="footer-logo" src={azraLight} alt="Azra" />

      <SocialLinks>
        <span className="social-text">Follow us</span>
        <ul>
          <li>
            <Link to={Config.SOCIALS.instagram.url} aria-label="Instagram">
              <FaInstagram />
            </Link>
          </li>
          <li>
            <Link to={Config.SOCIALS.twitter.url} aria-label="Twitter">
              <FaTwitter />
            </Link>
          </li>
          <li>
            <Link to={Config.SOCIALS.facebook.url} aria-label="Facebook">
              <FaFacebookF />
            </Link>
          </li>
          <li>
            <Link to={Config.SOCIALS.linkedIn.url} aria-label="LinkedIn">
              <FaLinkedinIn />
            </Link>
          </li>
        </ul>
      </SocialLinks>

      <LegalLinks>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <span>|</span>
        <Link to="/terms-of-service">Terms of Use</Link>
      </LegalLinks>

      <Copyright>
        © {new Date().getFullYear()} Azra. All rights reserved.
      </Copyright>
    </StyledFooter>
  );
};

export default Footer;


const SocialLinks = styled.div`
  margin: 1.5rem 0;

  .social-text {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
  }

  li {
    margin: 0 0.5rem;
  }

  a {
    color: #ccc;
    font-size: 1.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }
  }
`;

const LegalLinks = styled.div`
  font-size: 0.8rem;
  margin-bottom: 1rem;

  a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }
  }

  span {
    margin: 0 0.5rem;
  }
`;

const Copyright = styled.p`
  font-size: 0.8rem;
  margin: 0;
`;

const StyledFooter = styled.footer`
  background-color: #085b62;
  color: #ccc;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .footer-logo {
    width: 80px;
    padding: 5px;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
  }

  @media (max-width: 767px) {
    font-size: 14px;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    font-size: 16px;
  }

  @media (min-width: 992px) {
    font-size: 18px;
  }
`;