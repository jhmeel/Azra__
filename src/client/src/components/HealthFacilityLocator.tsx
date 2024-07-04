import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link } from "react-router-dom";
import { MessageCircleDashed } from "lucide-react";
import { Hospital } from "../types";
import { bouncy } from "ldrs";
import { RootState } from "../store";
import { useSelector } from "react-redux";

mapboxgl.accessToken = "pk.eyJ1IjoiamhtZWVsIiwiYSI6ImNseTZmeGkzNzA5bmwybHFyYzFrbGpwMnYifQ.zLf5q1bwCDE0msuYj8Evaw";

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
  height: 90vh;
  min-height: 400px;
  width:100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    height: 9+0vh;
  }
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

const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  padding: 1rem;
  background-color: #fff5f5;
  border-radius: 8px;
  margin-top: 1rem;
`;

const HealthFacilityLocator = ({ userLocation, pinIconUrl }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const {
    hospitals,
    error: hospitalFetchErr,
    loading,
  } = useSelector((state: RootState) => state.hospital);

  useEffect(() => {
    bouncy.register();

    if (mapContainerRef.current && userLocation) {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [userLocation.lng, userLocation.lat],
        zoom: 12,
      });

      newMap.on("load", () => {
        setMap(newMap);

        // Add user location marker
        new mapboxgl.Marker({ color: "#3182ce" })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(newMap);

        // Add hospital markers and draw paths
        hospitals?.forEach((hospital: Hospital, index: number) => {
          const [lat, lng] = hospital.coordinates.split(",").map(parseFloat);
          addHospitalMarker(newMap, hospital, lat, lng);
          drawPath(newMap, userLocation, { lat, lng }, index);
        });
      });

      return () => newMap.remove();
    }
  }, [userLocation, hospitals, pinIconUrl]);

  const addHospitalMarker = (map, hospital, lat, lng) => {
    const el = document.createElement("div");
    el.className = "hospital-marker";
    el.style.backgroundImage = `url(${pinIconUrl})`;
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.backgroundSize = "100%";
    el.style.cursor = "pointer";

    el.addEventListener("click", () => {
      setSelectedHospital(hospital);
      map.flyTo({ center: [lng, lat], zoom: 14 });
      addRippleEffect(map, lng, lat);
    });

    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${hospital.hospitalName}</h3>`))
      .addTo(map);
  };

  const addRippleEffect = (map, lng, lat) => {
    const rippleId = "ripple-effect";
    if (map.getSource(rippleId)) {
      map.removeLayer(rippleId);
      map.removeSource(rippleId);
    }

    map.addSource(rippleId, {
      type: "geojson",
      data: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    map.addLayer({
      id: rippleId,
      source: rippleId,
      type: "circle",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["get", "radius"], 0, 0, 50, 50],
        "circle-color": "#319795",
        "circle-opacity": ["interpolate", ["linear"], ["get", "radius"], 0, 0.8, 50, 0],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#319795",
      },
    });

    let radius = 0;
    const animateRipple = () => {
      radius += 0.5;
      map.getSource(rippleId).setData({
        type: "Point",
        coordinates: [lng, lat],
        properties: { radius },
      });
      if (radius < 50) {
        requestAnimationFrame(animateRipple);
      }
    };
    animateRipple();
  };

  const drawPath = (map, start, end, index) => {
    const pathId = `route-${index}`;

    const directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(directionsRequest)
      .then(response => response.json())
      .then(data => {
        const route = data.routes[0].geometry;

        map.addSource(pathId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route
          },
        });

        map.addLayer({
          id: pathId,
          type: "line",
          source: pathId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#319795",
            "line-width": 3,
            "line-opacity": 0.75,
          },
        });
      });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <l-bouncy size={40} color={"#319795"}></l-bouncy>
      </LoadingContainer>
    );
  }

  if (hospitalFetchErr) {
    return <ErrorMessage>Error loading hospitals: {hospitalFetchErr}</ErrorMessage>;
  }

  return (
    <>
      <Section>
        <SectionTitle>Health Facility Locator</SectionTitle>
        {userLocation ? (
          <MapContainer ref={mapContainerRef} />
        ) : (
          <LoadingContainer>
            <l-bouncy size={40} color={"#319795"}></l-bouncy>
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