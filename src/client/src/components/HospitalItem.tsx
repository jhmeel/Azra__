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
import { Coordinate, Hospital } from "../types";
import PingForm from "./PingForm";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { bouncy } from "ldrs";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useDispatch } from "react-redux";
import { CLEAR_ERRORS } from "../constants";
import { fetchNearByHospitals } from "../actions";
import Rating from "./Rating";

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

const SuggestionsList = styled.ul`
  position: absolute;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

const SuggestionItem = styled.li`
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const HospitalCards = ({
  userLocation,
  hospitals,
  isLoading,
  currentUser,
}: {
  userLocation: Coordinate;
  hospitals: Omit<Hospital, "$createdAt" | "$updatedAt">[];
  isLoading: boolean;
  currentUser: any;
}) => {
  const [selectedStatus, setSelectedStatus] = useState("available");
  const [selectedDistance, setSelectedDistance] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [pingFormActive, setPingFormActive] = useState<boolean>(false);
  const [selectedHospital, setSelectedHospital] = useState<Omit<
    Hospital,
    "$createdAt" | "$updatedAt"
  > | null>(null);

  const {
    hospitals: nearHospitals,
    error: hospitalFetchErr,
    loading,
  } = useSelector((state: RootState) => state.hospital);
  useEffect(() => {
    bouncy.register();
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (hospitalFetchErr) {
      toast.error(hospitalFetchErr);
      dispatch<any>({ type: CLEAR_ERRORS });
    }
    dispatch<any>(
      fetchNearByHospitals(currentUser?.session?.secret, {
        ...userLocation,
        range: Number(selectedDistance),
        status: selectedStatus,
      })
    );
  }, [selectedDistance, selectedStatus]);

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
  };

  const handleDistanceFilter = (distance: string) => {
    setSelectedDistance(distance);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const suggestions = hospitals
      .filter((hospital) =>
        hospital.hospitalName
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
      .map((hospital) => hospital.hospitalName);
    setSearchSuggestions(suggestions);
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchSuggestions([]);
  };

  const handlePing = (
    hospital: Omit<Hospital, "$createdAt" | "$updatedAt">
  ) => {
    setPingFormActive(!pingFormActive);
    setSelectedHospital(hospital);
  };

  const openChat = async (
    hospital: Omit<Hospital, "$createdAt" | "$updatedAt">
  ) => {
    navigate("/ping-chat", {
      state: { hospital },
    });
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
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
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
            {searchSuggestions?.length > 0 && searchQuery && (
              <SuggestionsList>
                {searchSuggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </SuggestionItem>
                ))}
              </SuggestionsList>
            )}
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
        ) : nearHospitals?.hospitals?.length === 0 ? (
          <AlertMessage>
            No hospitals found matching your search criteria
          </AlertMessage>
        ) : (
          <CardGrid>
            {nearHospitals?.hospitals?.map(
              (hospital: Omit<Hospital, "$createdAt" | "$updatedAt">) => (
                <Card key={hospital.$id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    {hospital.avatar && (
                      <img
                        src={hospital.avatar}
                        alt={hospital.hospitalName}
                        style={{
                          borderRadius: "20px",
                          width: "5rem",
                          height: "5rem",
                          marginRight: "0.75rem",
                        }}
                      />
                    )}
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
                            hospital.availabilityStatus === "Available"
                              ? "#48bb78"
                              : "#f56565",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {hospital.availabilityStatus === "Available"
                          ? "Available"
                          : "Not Available"}
                        <span
                          className={
                            hospital.availabilityStatus !== "UnAvailable"
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
                      <Rating rating={hospital.rating} />
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
              )
            )}
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
