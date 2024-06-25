import React from "react";
import styled from "styled-components";
import Footer from "../components/Footer";
import { RoughNotation } from "react-rough-notation";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem;
  background-color: #f8f9fa;
  color: #343a40;
  font-family: "Arial, sans-serif";
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #007bff;
  text-align: center;
  @media(max-width:768px){
    font-size:1.5rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.75rem;
  color: #6c757d;
  margin-bottom: 2rem;
  text-align: center;
`;

const Content = styled.div`
  max-width: 800px;
  text-align: justify;
  line-height: 1.6;
  font-size: 1.125rem;
`;

const Highlight = styled.span`
  background-color: #007bff;
  font-weight: bold;
  color: #fff;
  padding: 5px 10px;
`;

const StoryContainer = styled.div`
  max-width: 800px;
  margin-bottom: 2rem;
`;

const StoryContent = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: #343a40;
  margin: 0;
  text-align: justify;
`;

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Container>
        <div style={{ width: "100%", display: "flex", alignItems: "start" }}>
          <ArrowLeft
            onClick={() => navigate("/")}
            style={{
              background: "#ededed",
              width: "35",
              padding: "4px",
              borderRadius: "50px",
              cursor: "pointer",
            }}
          />
        </div>

        <RoughNotation padding={0} color="#176984" type="underline" show={true}>
          <Title>Welcome to Azra</Title>
        </RoughNotation>

        <Subtitle>Your Bridge to Seamless Healthcare Connectivity</Subtitle>
        <Content>
          <p>
            Azra is a cutting-edge platform designed to bridge the gap between
            patients and healthcare providers. Its objective is to offer{" "}
            <Highlight>seamless, real-time connectivity</Highlight> between
            patients and nearby hospitals or clinics, empowering individuals to
            effortlessly access the care they need.
          </p>
          <p>
            By leveraging technology, Azra streamlines the healthcare
            experience, ensuring that patients can quickly connect with the
            right medical resources and receive the attention they deserve,
            thereby optimizing both patient and provider productivity.
          </p>
          <p>
            Currently, the Azra platform is in active development, with core
            features being continuously tested and refined to ensure optimal
            functionality. Plans are in place for a comprehensive beta testing
            phase, where the platform will be trialed with selected hospitals
            and patient groups.
          </p>
          <p>
            This testing phase will provide invaluable feedback, allowing us to
            further enhance the system and address any pain points or user needs
            identified during the beta testing process.
          </p>
        </Content>
        <StoryContainer>
        <RoughNotation padding={0} color="#176984" type="underline" show={true}>
        <Title>How Azra Could Have Made a Difference</Title>
        </RoughNotation>
          <StoryContent>
            "A real-life scenario: a patient diagnosed with a severe illness
            urgently needs specialized care. They are taken to the nearest
            hospital, where initial treatment begins, but it becomes clear they
            require more advanced medical expertise available at another
            facility.
            <br />
            <br />
            Unfortunately, the process of locating an equipped facility and
            arranging the transfer was slow. By the time they reach the
            appropriate hospital, it's too late. The delay in accessing
            specialized care proves fatal, leaving behind a profound sense of
            loss and what-ifs.
            <br />
            <br />
            With Azra, this heartbreaking scenario could have been avoided. Our
            platform ensures seamless connectivity between patients and
            healthcare providers, guiding individuals directly to the most
            suitable medical resources without unnecessary delays. This simple,
            yet vital connection could make all the difference in critical
            moments."
          </StoryContent>
        </StoryContainer>
      </Container>

      <Footer />
    </>
  );
};

export default AboutPage;
