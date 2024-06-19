import fcabal from "../../assets/logos/fcabal_white.png"
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Facebook,Twitter,Linkedin,Instagram } from "lucide-react";
import Config from "../config/Config";
import azraLight from "../assets/azra_light.png";

const Footer = () => {
  return (
    <>
     
        <MainFooter className="footer">
          <img className="foot-logo" src={azraLight} alt="Azra" />

          <div className="f-socials">
            <span className="f-social-txt">Follow us</span>
            <ul>
              <li title="Instagram">
                <Link to={Config.SOCIALS.instagram.url}>
                  <Instagram className="f-socials-icon" />
                </Link>
              </li>
              <li title="Twitter">
                <Link to={Config.SOCIALS.twitter.url}>
                  <Twitter className="f-socials-icon" />
                </Link>
              </li>
              <li title="Facebook">
                <Link to={Config.SOCIALS.facebook.url}>
                  <Facebook className="f-socials-icon" />
                </Link>
              </li>
              <li title="Linkedin">
                <Link to={Config.SOCIALS.linkedIn.url}>
                  <Linkedin className="f-socials-icon" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-p-t-lnk">
            <Link to="/privacy-policy" title="Privacy Policy">
              {" "}
              Privacy Policy |
            </Link>
            <Link to="/terms-of-service" title="Terms of service">
              {" "}
              Terms of use.
            </Link>
          </div>
          <p className="f-copy-right">
            © {new Date().getFullYear()}. All rights reserved.
          </p>
        </MainFooter>
  
    </>
  );
};

export default Footer;


const MainFooter = styled.footer`
    position: relative;
    left: 0;
    bottom: 0;
    height: fit-content;
    max-width: 100%;
    background-color: #085b62;
    color: #ccc;
    padding: 20px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    z-index: 99;
  
   .foot-logo{
      width: 80px;
      padding:5px;
      border:1px solid #ccc;
   }
   .footer-copyright {
      width: 100%;
      height: 40px;
      background: rgba(7, 162, 162, 0.402);
    
      padding: 10px;
      position: absolute;
      bottom: 0px;
      left: 0px;
   }
   .footer-body {
      margin-bottom: 40px;
   }
   
   .footer-body::after {
      content: "";
      display: block;
      clear: both;
   }
  
   .footer-body > div {
      float: left;
      padding: 20px;
   }
  
   .footer-body > div:first-child {
      font-size: 150%;
      width: 35%;
      text-align: center;
   }
  
   .footer-body > div:last-child {
      width: 65%;
   }
   .footer-body ul {
      list-style-type: none;
      margin: 0px;
      padding: 0px;
      text-align: center;
   }
   .footer-body li > a {
      color: white;
      text-decoration: none;
      margin-bottom: 7px;
   }
  .footer-p-t-lnk a{
     text-decoration: none;
     color: #ccc;
     font-size: 13px;
  }
  @media (max-width: 767px) {
      .footer {
        font-size: 14px;
      }
    }
    
    @media (min-width: 768px) and (max-width: 991px) {
      .footer {
        font-size: 16px;
      }
    }
    
    @media (min-width: 992px) {
      .footer {
        font-size: 18px;
      }
    }
    
  
    .f-copy-right{
       color: #ccc;
    }
  
    .f-socials {
     display: flex;
     flex-direction: column;
     align-items: center;
   }
   .f-socials ul {
     list-style: none;
     display: flex;
     width: 100%;
     justify-content: center;
   }
   .f-socials ul li {
     padding: 5px 10px;
   }
   
   
   .f-socials-icon {
     height: 28px;
     width: 28px;
     transition: 0.3s ease-out;
     fill: gray;
   }
   .f-socials-icon:hover {
     fill: #176984;
   }
   .f-social-txt{
     font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
     font-size: 14px;
     color: #ccc;
   }
`