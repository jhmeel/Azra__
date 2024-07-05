import React, { ChangeEvent, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  HospitalIcon,
  MessageCircle,
  Send,
  Search,
  Info,
  MessageSquareShare,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
} from "lucide-react";
import { getDistanceFromLatLonInKm } from "../utils/formatter";
import { Coordinate, Hospital, Role } from "../types";
import PingForm from "./PingForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { bouncy } from "ldrs";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { AVAILABLE_HOSPITALS, CLEAR_ERRORS } from "../constants";
import { fetchNearByHospitals, setSelectedChat } from "../actions";
import Rating from "./Rating";
import HospitalProfileViewer from "./HospitalProfileViewer";

const rippleAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const SectionWrapper = styled.section`
  width: 100%;
  margin-top: 2rem;
  overflow: hidden;
  padding: 0 2rem;
`;

const HospitalListContainer = styled.div`
  position: relative;
  margin-top: 2rem;
`;

const HospitalCarousel = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  padding: 1rem 0;
`;

const HospitalCard = styled.div`
  flex: 0 0 300px;
  background-color: white;
  margin-right: 1.5rem;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.6rem 3rem;
  border: none;
  border-radius: 2rem;
  background-color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #4299e1;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  @media(max-width:768px){
    top: 20%;
  }
`;

const Select = styled.select`
  padding: 0.6rem 0.8rem;
  border: none;
  border-radius: 2rem;
  background-color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #4299e1;
  }
`;

const PingButton = styled.button`
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 10px;
  display:flex;
  padding: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3182ce;
  }
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LeftScrollButton = styled(ScrollButton)`
  left: -20px;
`;

const RightScrollButton = styled(ScrollButton)`
  right: -20px;
`;

const HospitalName = styled.h3`
  font-size: 1.2rem;
  color: #2d3748;
  font-weight:700;
  margin-bottom: 0.5rem;
`;

const HospitalInfo = styled.p`
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.25rem;
`;

const HospitalStatus = styled.span<{ available: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${props => props.available ? '#C6F6D5' : '#FED7D7'};
  color: ${props => props.available ? '#22543D' : '#742A2A'};
`;

const RippleAnimation = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #48BB78;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #48BB78;
    animation: ${rippleAnimation} 1.5s infinite;
  }
`;

const HospitalCards = ({
  userLocation,
  currentUser,
}: {
  userLocation: Coordinate;
  currentUser: any;
}) => {
  const [selectedStatus, setSelectedStatus] = useState("available");
  const [selectedDistance, setSelectedDistance] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [pingFormActive, setPingFormActive] = useState<boolean>(false);
  const [viewProfile, setViewProfile] = useState<boolean>(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const {
    hospitals: nearHospitals,
    error: hospitalFetchErr,
    loading,
  } = useSelector((state: RootState) => state.hospital);

  const { accessToken, role } = useSelector((state: RootState) => state.auth);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    bouncy.register();
  }, []);

  useEffect(() => {
    if (hospitalFetchErr) {
      toast.error(hospitalFetchErr);
      dispatch<any>({ type: CLEAR_ERRORS });
    }
    dispatch<any>(
      fetchNearByHospitals(accessToken, {
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
  };

  const handlePing = (hospital: Hospital) => {
    setPingFormActive(!pingFormActive);
    setSelectedHospital(hospital);
    dispatch<any>(setSelectedChat(hospital));
  };

  const openChat = async (hospital: Hospital) => {
    navigate("/ping-chat");
    dispatch<any>(setSelectedChat(hospital));
  };

  const onViewProfile = (hospital: Hospital) => {
    setViewProfile(true);
    setSelectedHospital(hospital);
  };

  const filteredHospitals = nearHospitals?.filter((hospital: Hospital) =>
    hospital.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollLeft = () => {
    const carousel = document.getElementById('hospital-carousel');
    if (carousel) {
      carousel.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const carousel = document.getElementById('hospital-carousel');
    if (carousel) {
      carousel.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <SectionWrapper>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#2D3748" }}>
        Find Nearby Hospitals
      </h2>
      <SearchContainer>
        <SearchIconWrapper>
          <SearchIcon size={20} />
        </SearchIconWrapper>
        <Input
          type="text"
          placeholder="Search hospitals"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Select value={selectedStatus} onChange={(e) => handleStatusFilter(e.target.value)}>
          <option value="available">Available</option>
          <option value="unavailable">Not Available</option>
        </Select>
        <Select value={selectedDistance} onChange={(e) => handleDistanceFilter(e.target.value)}>
          <option value="0">Any Distance</option>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="15">Within 15 km</option>
        </Select>
      </SearchContainer>

      <HospitalListContainer>
        <LeftScrollButton onClick={scrollLeft} disabled={loading}>
          <ChevronLeft size={24} />
        </LeftScrollButton>
        <HospitalCarousel id="hospital-carousel">
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <l-bouncy size={40} color={"#319795"}></l-bouncy>
            </div>
          ) : filteredHospitals?.length === 0 ? (
            <div>No hospitals found matching your search criteria</div>
          ) : (
            filteredHospitals?.map((hospital: Hospital) => (
              <HospitalCard key={hospital._id}>
                {hospital.status === "Available" && <RippleAnimation />}
                {hospital.avatar && (
                  <img
                    src={hospital.avatar}
                    alt={hospital.hospitalName}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  />
                )}
                <HospitalName>{hospital.hospitalName}</HospitalName>
                {/* <HospitalInfo>{hospital.coordinates}</HospitalInfo> */}
                <HospitalStatus available={hospital.status === "Available"}>
                  {hospital.status === "Available" ? "Available" : "Not Available"}
                </HospitalStatus>
                <HospitalInfo>
                  Distance: {getDistanceFromLatLonInKm(
                    userLocation.lat,
                    userLocation.lng,
                    parseFloat(hospital.coordinates.split(",")[0]),
                    parseFloat(hospital.coordinates.split(",")[1])
                  )} km
                </HospitalInfo>
                <Rating fontSize={20} rating={hospital.rating} />
                
                {role?.toLowerCase() !== Role.HOSPITAL.toLowerCase() && (
                  <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
                    <PingButton onClick={() => handlePing(hospital)}>
                      <HospitalIcon style={{ marginRight: "0.5rem", width: "16px" }} /> Ping
                    </PingButton>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <MessageSquareShare
                        size={20}
                        color="#4A5568"
                        style={{ cursor: "pointer" }}
                        onClick={() => openChat(hospital)}
                      />
                      <Info
                        onClick={() => onViewProfile(hospital)}
                        size={20}
                        color="#4A5568"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                )}
              </HospitalCard>
            ))
          )}
        </HospitalCarousel>
        <RightScrollButton onClick={scrollRight} disabled={loading}>
          <ChevronRight size={24} />
        </RightScrollButton>
      </HospitalListContainer>

      {pingFormActive && (
        <PingForm
          selectedHospital={selectedHospital}
          onClose={() => setPingFormActive(false)}
        />
      )}

      {viewProfile && !pingFormActive && (
        <HospitalProfileViewer
          onClose={() => setViewProfile(false)}
          hospital={selectedHospital}
        />
      )}
    </SectionWrapper>
  );
};

export default HospitalCards;