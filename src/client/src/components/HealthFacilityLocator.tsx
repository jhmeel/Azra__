import React, { useEffect } from "react";
import styled from "styled-components";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { MessageCircleDashed } from "lucide-react";
import { Hospital } from "../types";
import { bouncy } from "ldrs";

const Section = styled.section`
  margin: 3rem auto;
  width: 100%;
  padding: 0 8px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: #4a5568;
`;

const MapContainer = styled.div`
  height: 24rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #a0aec0;
`;

const GreenSection = styled.section`
  background-color: #f0fff4;
  padding: 4rem 0;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
`;

const GreenSectionTitle = styled.h2`
  font-size: 1.67rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #319795;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const GreenSectionText = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #4a5568;
`;

const CollaborateLink = styled(Link)`
  background-color: #319795;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #2c7a7b;
  }
`;

const HealthFacilityLocator = ({
  isLoaded,
  userLocation,
  hospitals,
  pinIconUrl,
}) => {

useEffect(() => {
  bouncy.register();
}, []);  

return (
    <div>
      <Section>
        <SectionTitle>Health Facility Locator</SectionTitle>
        {isLoaded && userLocation ? (
          <GoogleMap
            mapContainerClassName={MapContainer}
            center={userLocation}
            zoom={12}
          >
            <Marker
              position={userLocation}
              icon={{ url: "https://example.com/location-marker.png" }}
            />
            {hospitals.map((hospital: Hospital) => (
              <Marker
                key={hospital.$id}
                position={{
                  lat: parseFloat(hospital.coordinates.split(",")[0]),
                  lng: parseFloat(hospital.coordinates.split(",")[1]),
                }}
                icon={{ url: pinIconUrl }}
                label={{
                  text: hospital.hospitalName,
                  color: "white",
                  fontSize: "12px",
                }}
              />
            ))}
          </GoogleMap>
        ) :  (
          <div style={{display:'flex', justifyContent:'center'}}>  <l-bouncy size={35} color={'#4a5568'}></l-bouncy></div>
        
        )}
      </Section>

      <GreenSection>
        <Container>
          <GreenSectionTitle>
            <MessageCircleDashed /> Connect with Other Hospitals
          </GreenSectionTitle>
          <GreenSectionText>
            Join a network of care providers. Chat with fellow hospitals, share
            space availability, and exchange ideas to enhance patient care.
          </GreenSectionText>
          <CollaborateLink to="/chat">Start Collaborating</CollaborateLink>
        </Container>
      </GreenSection>
    </div>
  );
};

export default HealthFacilityLocator;
