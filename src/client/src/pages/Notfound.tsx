import React from "react";
import { Link } from "react-router-dom";
import notFound from "../assets/notfound.svg";
import Footer from "../components/Footer";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f7fafc;
  padding: 32px 16px;
`;

const ContentWrapper = styled.div`
  max-width: 768px;
  margin: 0 auto;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 32px;
  max-width: 256px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 16px;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #718096;
  margin-bottom: 32px;

  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

const HomeLink = styled(Link)`
  display: inline-block;
  background-color: #4299e1;
  color: #ffffff;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3182ce;
  }
`;

const NotFound: React.FC = () => {
  return (
    <Container>
      <Content>
        <ContentWrapper>
          <Image src={notFound} alt="404 Not Found" />
          <Title>Oops! Page not found</Title>
          <Description>
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Description>
          <HomeLink to="/">Go to Home</HomeLink>
        </ContentWrapper>
      </Content>
      <Footer />
    </Container>
  );
};

export default NotFound;
