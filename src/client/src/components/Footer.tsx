import { Facebook, Twitter, Instagram } from "lucide-react";
import styled from "styled-components";


const FooterWrapper = styled.footer`
  background-color: #2d3748;
  padding: 1rem;
  text-align: center;
  color: white;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const IconLink = styled.a`
  .icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #d1d5db;
    transition: color 0.3s;

    &:hover {
      color: white;
    }
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      
      <IconWrapper>
  
        <IconLink
          href="https://www.facebook.com/healthhub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="icon" />
        </IconLink>
        <IconLink
          href="https://twitter.com/healthhub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="icon" />
        </IconLink>
        <IconLink
          href="https://www.instagram.com/healthhub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="icon" />
        </IconLink>
      </IconWrapper>
      <p>&copy; {new Date().getFullYear()} Azra. All rights reserved.</p>
    </FooterWrapper>
  );
};

export default Footer;
