import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useLocation } from "react-router-dom";
import { MessageCircleDashed } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { bouncy } from "ldrs";
import { Hospital } from "../types";
import PingForm from "./PingForm";

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
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    height: 90vh;
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

interface UserLocation {
  lat: number;
  lng: number;
}

interface HealthFacilityLocatorProps {
  userLocation: UserLocation;
}

const HealthFacilityLocator: React.FC<HealthFacilityLocatorProps> = ({ userLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { hospitals } = useSelector((state: RootState) => state.hospital);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [pingFormActive, setPingFormActive] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    bouncy.register();
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && userLocation) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [userLocation.lng, userLocation.lat],
        zoom: 8,
      });

      mapRef.current.on("load", () => {
        addUserMarker();
        addHospitals();
      });
    }

    return () => mapRef.current?.remove();
  }, [userLocation]);

  const addUserMarker = () => {
    if (mapRef.current) {
      new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(mapRef.current);
    }
  };

  const handlePing = () => {
    setPingFormActive(!pingFormActive);
  };

  const addHospitals = () => {
    hospitals.forEach((hospital: Hospital) => {
      const el = document.createElement("div");
      el.className = "hospital-marker";
      el.style.width = "25px";
      el.style.height = "25px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#4264fb";
      el.style.cursor = "pointer";

      el.addEventListener("click", () => {
        setSelectedHospital(hospital);

        const [lng, lat] = hospital.coordinates.split(",").map(Number);
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom: 14,
        });
        addRippleEffect([lng, lat]);
        drawRoute([lng, lat]);
      });

      const [lng, lat] = hospital.coordinates.split(",").map(Number);
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
      });

      marker.getElement().addEventListener("mouseenter", () => {
        const distance = calculateDistance(
          userLocation,
          [lng, lat]
        );
        popup
          .setLngLat([lng, lat])
          .setHTML(
            `
            <h3>${hospital.hospitalName}</h3>
            <p>Distance: ${distance.toFixed(2)} km</p>
            <button onclick="handlePing()">Ping</button>
          `
          )
          .addTo(mapRef.current!);
      });

      marker.getElement().addEventListener("mouseleave", () => {
        popup.remove();
      });
    });
  };

  const addRippleEffect = (coordinates: [number, number]) => {
    const rippleId = "ripple-effect";
    if (mapRef.current?.getSource(rippleId)) {
      mapRef.current.removeLayer(rippleId);
      mapRef.current.removeSource(rippleId);
    }

    mapRef.current?.addSource(rippleId, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
        properties: {
          radius: 0
        }
      }
    });
    mapRef.current?.addLayer({
      id: rippleId,
      source: rippleId,
      type: "circle",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["get", "radius"],
          0,
          0,
          50,
          50,
        ],
        "circle-color": "#4264fb",
        "circle-opacity": [
          "interpolate",
          ["linear"],
          ["get", "radius"],
          0,
          0.8,
          50,
          0,
        ],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#4264fb",
      },
    });

    let radius = 0;
    const animateRipple = () => {
      radius += 0.5;
      if (mapRef.current?.getSource(rippleId)) {
        (mapRef.current.getSource(rippleId) as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
          properties: { radius },
        });
      }
      if (radius < 50) {
        requestAnimationFrame(animateRipple);
      } else {
        radius = 0;
        animateRipple();
      }
    };
    animateRipple();
  };


  const drawRoute = (destination: [number, number]) => {
    const routeId = "route";
    if (mapRef.current?.getSource(routeId)) {
      mapRef.current.removeLayer(routeId);
      mapRef.current.removeSource(routeId);
    }

    const directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${destination[0]},${destination[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(directionsRequest)
      .then((response) => response.json())
      .then((data) => {
        const route = data.routes[0].geometry;

        mapRef.current?.addSource(routeId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route,
          },
        });

        mapRef.current?.addLayer({
          id: routeId,
          type: "line",
          source: routeId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#4264fb",
            "line-width": 3,
            "line-opacity": 0.75,
          },
        });
      });
  };

  const calculateDistance = (start: UserLocation, end: [number, number]) => {
    const R = 6371; // Earth's radius in km
    const dLat = (end[1] - start.lat) * (Math.PI / 180);
    const dLon = (end[0] - start.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(start.lat * (Math.PI / 180)) *
        Math.cos(end[1] * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <>
      <Section>
        <SectionTitle>Health Facility Locator</SectionTitle>
        {!location && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <l-bouncy size={40} color={"#319795"}></l-bouncy>
          </div>
        )}
        <MapContainer ref={mapContainerRef} />
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

      {pingFormActive && selectedHospital && (
        <div>
          <PingForm
            selectedHospital={selectedHospital}
            onClose={() => setPingFormActive(false)}
          />
        </div>
      )}
    </>
  );
};

export default HealthFacilityLocator;