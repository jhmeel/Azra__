import React, { useEffect } from "react";
import styled from "styled-components";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { MessageCircleDashed} from "lucide-react";
import { Hospital } from "../types";
import { bouncy } from "ldrs";

const Section = styled.section`
  margin: 4rem auto;
  max-width: 1200px;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #2d3748;
`;

const MapContainer = styled.div`
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const GreenSection = styled.section`
  background-color: #e6fffa;
  padding: 4rem 0;
  margin-top: 4rem;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 1rem;
`;

const GreenSectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #319795;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const GreenSectionText = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #4a5568;
`;

const CollaborateLink = styled(Link)`
  display: inline-block;
  background-color: #319795;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #2c7a7b;
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background-color: #f7fafc;
  border-radius: 8px;
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
    <>
      <Section>
        <SectionTitle>
          Health Facility Locator
        </SectionTitle>
        {isLoaded && userLocation ? (
          <MapContainer>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={userLocation}
              zoom={12}
            >
              <Marker
                position={userLocation}
                icon={{ url: "https://example.com/location-marker.png" }}
              />
              {hospitals?.map((hospital: Hospital) => (
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
                    fontWeight: "bold",
                  }}
                />
              ))}
            </GoogleMap>
          </MapContainer>
        ) : (
          <LoadingContainer>
            <l-bouncy size={40} color={'#319795'}></l-bouncy>
          </LoadingContainer>
        )}
      </Section>

      <GreenSection>
        <Container>
          <GreenSectionTitle>
            <MessageCircleDashed size={32} />
            Connect with Other Hospitals
          </GreenSectionTitle>
          <GreenSectionText>
            Join a network of care providers. Chat with fellow hospitals, share
            space availability, and exchange ideas to enhance patient care.
          </GreenSectionText>
          <CollaborateLink to="/chat">Start Collaborating</CollaborateLink>
        </Container>
      </GreenSection>
    </>
  );
};

export default HealthFacilityLocator;