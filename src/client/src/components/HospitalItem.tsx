import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import {
  HospitalIcon,
  MessageCircle,
  Send,
  Search,
  Expand,
} from "lucide-react";
import { getDistanceFromLatLonInKm } from "../utils/formatter";
import { Hospital } from "../types";
import PingForm from "./PingForm";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { bouncy } from "ldrs";

const SectionWrapper = styled.section`
  width: 100%;
  margin-top: 3rem;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 2rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 0.75rem;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;
  }
`;

const CardTitle = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
  color: #4a5568;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #4a5568;
  margin-top: 1rem;
`;

const CardSubtext = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.75rem;
`;

const Input = styled.input`
  padding: 0.5rem 2rem 0.5rem 3rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.5rem 2rem;
  border: 1px solid #e2e8f0;
  max-width: 300px;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
`;

const StatusFilter = styled(Select)`
  width: 100%;
`;

const DistanceFilter = styled(Select)`
  width: 100%;
`;

const StatusOption = styled.option``;

const DistanceOption = styled.option``;

const AlertMessage = styled.div`
  font-size: 1rem;
  text-align: center;
  color: #4299e1;
`;

// Example hospital data
const demoHospitals: Hospital[] = [
  {
    $id: "1",
    hospitalName: "Yusuf Dantsoho Memorial Hospital",
    hospitalNumber: "1234",
    avatar: "https://example.com/hospital1.jpg",
    status: "available",
    email: "",
    phone: "",
    coordinates: "10.5272,7.4396",
  },
  {
    $id: "2",
    hospitalName: "Ahmadu Bello University Teaching Hospital",
    hospitalNumber: "5678",
    avatar: "https://example.com/hospital2.jpg",
    status: "unavailable",
    email: "",
    phone: "",
    coordinates: "11.0801,7.7069",
  },
  {
    $id: "3",
    hospitalName: "Garki Hospital",
    hospitalNumber: "91011",
    avatar: "https://example.com/hospital3.jpg",
    status: "available",
    email: "",
    phone: "",
    coordinates: "9.0765,7.4983",
  },
  {
    $id: "4",
    hospitalName: "Lagos University Teaching Hospital",
    hospitalNumber: "121314",
    avatar: "https://example.com/hospital4.jpg",
    status: "unavailable",
    email: "",
    phone: "",
    coordinates: "6.5244,3.3792",
  },
  {
    $id: "5",
    hospitalName: "Aminu Kano Teaching Hospital",
    hospitalNumber: "151617",
    avatar: "https://example.com/hospital5.jpg",
    status: "available",
    email: "",
    phone: "",
    coordinates: "12.0022,8.5167",
  },
];

const HospitalCards = ({
  userLocation,
  hospitals = demoHospitals,
  isLoading,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("available");
  const [selectedDistance, setSelectedDistance] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [pingFormActive, setPingFormActive] = useState<boolean>(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  useEffect(() => {
    bouncy.register();
  }, []);

  const navigate = useNavigate();
  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
  };

  const handleDistanceFilter = (distance: string) => {
    setSelectedDistance(distance);
  };

  const filteredHospitals = hospitals.filter((hospital: Hospital) => {
    const matchesSearch = hospital.hospitalName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "" || hospital.status === selectedStatus;

    // Calculate distance only if selected distance is provided
    const withinDistance =
      selectedDistance === "0" ||
      getDistanceFromLatLonInKm(
        userLocation.lat,
        userLocation.lng,
        parseFloat(hospital.coordinates.split(",")[0]),
        parseFloat(hospital.coordinates.split(",")[1])
      ) <= parseFloat(selectedDistance);

    return matchesSearch && matchesStatus && withinDistance;
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePing = (hospital: Hospital) => {
    setPingFormActive(!pingFormActive);
    setSelectedHospital(hospital);
  };

  const openChat = async (hospital: Hospital) => {
    const patient = await localforage.getItem(
      `AZRA_PATIENT_${hospital.hospitalName}`
    );
    if (patient) {
      navigate("/ping-chat", {
        state: { fullName: patient, hospital },
      });
    } else {
      toast.error(`You have no chat history with ${hospital.hospitalName}!`);
    }
  };
  return (
    <>
      <SectionWrapper>
        <CardGrid>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.75rem",
                gap: "10px",
              }}
            >
              <HospitalIcon
                style={{ width: "1.5rem", height: "1.5rem", color: "#805ad5" }}
              />
              <CardTitle>Ping Hospital</CardTitle>
            </div>
            <CardDescription>
              Ping your preferred hospital to alert them about your needs and
              concerns instantly.
            </CardDescription>
            <CardSubtext>Get immediate hospital attention</CardSubtext>
          </Card>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "0.75rem",
              }}
            >
              <MessageCircle
                style={{ width: "1.5rem", height: "1.5rem", color: "#4299e1" }}
              />
              <CardTitle>Send Complaints</CardTitle>
            </div>
            <CardDescription>
              Directly communicate complaints and concerns to the hospital,
              ensuring prompt resolution.
            </CardDescription>
            <CardSubtext>Ensure quick issue resolution</CardSubtext>
          </Card>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.75rem",
                gap: "10px",
              }}
            >
              <Send
                style={{ width: "1.5rem", height: "1.5rem", color: "#f56565" }}
              />
              <CardTitle>Get Real-Time Responses</CardTitle>
            </div>
            <CardDescription>
              Receive instant responses from the hospital, keeping you informed
              about the progress.
            </CardDescription>
            <CardSubtext>Stay updated in real-time</CardSubtext>
          </Card>
        </CardGrid>
      </SectionWrapper>

      <SectionWrapper>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "#4a5568",
          }}
        >
          Find Nearby Hospitals
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: "2rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative" }}>
            <Input type="text" placeholder="Search" onChange={handleSearch} />
            <Search
              style={{
                position: "absolute",
                top: "50%",
                width: "20px",
                left: "1rem",
                transform: "translateY(-50%)",
                color: "#cbd5e0",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusFilter
              value={selectedStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <StatusOption value="available">Available</StatusOption>
              <StatusOption value="unavailable">Not Available</StatusOption>
            </StatusFilter>
            <DistanceFilter
              value={selectedDistance}
              onChange={(e) => handleDistanceFilter(e.target.value)}
            >
              <DistanceOption value="0">Any Distance</DistanceOption>
              <DistanceOption value="5">Within 5 km</DistanceOption>
              <DistanceOption value="10">Within 10 km</DistanceOption>
              <DistanceOption value="15">Within 15 km</DistanceOption>
            </DistanceFilter>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            <l-bouncy size={35} color={"#4a5568"}></l-bouncy>
          </div>
        ) : filteredHospitals.length === 0 ? (
          <AlertMessage>
            No hospitals found matching your search criteria
          </AlertMessage>
        ) : (
          <CardGrid>
            {filteredHospitals.map((hospital: Hospital) => (
              <Card key={hospital.$id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={hospital.avatar}
                    alt={hospital.hospitalName}
                    style={{
                      borderRadius: "50%",
                      width: "3rem",
                      height: "3rem",
                      marginRight: "0.75rem",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.125rem",
                        color: "#4a5568",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {hospital.hospitalName}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#718096",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {hospital.coordinates}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color:
                          hospital.status === "available"
                            ? "#48bb78"
                            : "#f56565",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {hospital.status === "available"
                        ? "Available"
                        : "Not Available"}
                      <span
                        className={
                          hospital.status === "available"
                            ? "ripple-animation"
                            : ""
                        }
                      ></span>
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#718096" }}>
                      Distance:{" "}
                      {getDistanceFromLatLonInKm(
                        userLocation.lat,
                        userLocation.lng,
                        parseFloat(hospital.coordinates.split(",")[0]),
                        parseFloat(hospital.coordinates.split(",")[1])
                      )}{" "}
                      km
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#cbd5e0",
                    marginBottom: "1rem",
                  }}
                ></div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    onClick={() => handlePing(hospital)}
                    style={{
                      backgroundColor: "#4299e1",
                      color: "white",
                      padding: "0.4rem .8rem",
                      borderRadius: "0.5rem",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <HospitalIcon
                      style={{
                        marginRight: "2",
                        color: "white",
                        width: "16px",
                      }}
                    />{" "}
                    Ping
                  </button>

                  <Expand
                    size={14}
                    color="grey"
                    style={{ cursor: "pointer" }}
                    onClick={() => openChat(hospital)}
                  />
                </div>
              </Card>
            ))}
          </CardGrid>
        )}
      </SectionWrapper>

      {pingFormActive && (
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

export default HospitalCards;
