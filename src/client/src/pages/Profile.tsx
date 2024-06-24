import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaUser,
  FaHospital,
  FaKey,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import { toast } from "sonner";
import Config from "../Config";
import { Client, Databases } from "appwrite";
import reverseGeocode from "reverse-geocode";
import Footer from "../components/Footer";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID);

const database = new Databases(client);

const { PATIENT_COLLECTION_ID, DATABASE_ID } = Config.APPWRITE;
interface Patient {
  $id: string;
  name: string;
  email: string;
  avatar: string;
  country: string;
}

interface Ping {
  $id: string;
  hospitalName: string;
  message: string;
  timestamp: string;
}

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 300px 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #ededed;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.section`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #444444;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: #333;
  outline:1px solid #3e7dbc;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: linear-gradient(45deg, #007bff, #00bcd4);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const AvatarImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  padding: 12px 24px;
  background: linear-gradient(45deg, #17a2b8, #20c997);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const PingsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PingItem = styled.li`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ActionButton = styled.button`
  padding: 20px;
  background-color:#639bcd;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  border: 1px solid #ededed;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 16px;
`;

export const Profile: React.FC = () => {
  
  const [pings, setPings] = useState<Ping[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const {user:patient} = useSelector((state:RootState)=> state.auth)

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast.error("Failed to fetch patient data");
      }
    };

    const fetchPings = async () => {
      try {
      } catch (error) {
        console.error("Error fetching pings:", error);
        toast.error("Failed to fetch recent pings");
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation(`${latitude}, ${longitude}`);

            const result = reverseGeocode.lookup(latitude, longitude, "US");
            if (result && result?.countryCode) {
              setCountry(result?.countryName);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.error("Failed to get current location");
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser");
      }
    };

    fetchPatientData();
    fetchPings();
    getLocation();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.success("Profile updated successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      toast.success("Password reset successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    }
  };

  return (
    <>
      <ProfileContainer>
        <Sidebar>
          <Section>
            <AvatarContainer>
              <AvatarImage src={patient?.avatar} alt="Patient Avatar" />
              <FileInput
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <UploadButton htmlFor="avatar-upload">
                <FaUser /> Change Avatar
              </UploadButton>
            </AvatarContainer>
            <LocationInfo>
              <FaMapMarkerAlt />
              {country ||'Nigeria'}, {location || "Fetching location..."}
            </LocationInfo>
          </Section>
          <Section>
            <h2>{patient?.fullName}</h2>
            <p>{patient?.email}</p>
            <Button onClick={() => setShowEditModal(true)}>
              <FaEdit /> Edit Profile
            </Button>
          </Section>
        </Sidebar>
        <MainContent>
          <Section>
            <h2>Recent Pings</h2>
            <PingsList>
              {pings.map((ping) => (
                <PingItem key={ping?.$id}>
                  <FaHospital /> <strong>{ping?.hospitalName}</strong>
                  <p>{ping.message}</p>
                  <small>{new Date(ping?.timestamp).toLocaleString()}</small>
                </PingItem>
              ))}
            </PingsList>
          </Section>
          <Section>
            <h2>Actions</h2>
            <ActionsContainer>
              <ActionButton>
                <FaFileAlt /> View Medical Records
              </ActionButton>
              <ActionButton>
                <FaCalendarAlt /> Schedule Appointment
              </ActionButton>
              <ActionButton>
                <FaEnvelope /> Message Doctor
              </ActionButton>
              <ActionButton onClick={() => setShowPasswordModal(true)}>
                <FaKey /> Reset Password
              </ActionButton>
            </ActionsContainer>
          </Section>
        </MainContent>

        {showEditModal && (
          <Modal>
            <ModalContent>
              <CloseButton onClick={() => setShowEditModal(false)}>
                <X/>
              </CloseButton>
              <h2>Edit Profile</h2>
              <Form onSubmit={handleProfileUpdate}>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
                <Button type="submit">
                  <FaUser /> Update Profile
                </Button>
              </Form>
            </ModalContent>
          </Modal>
        )}

        {showPasswordModal && (
          <Modal>
            <ModalContent>
              <CloseButton onClick={() => setShowPasswordModal(false)}>
                <X/>
              </CloseButton>
              <h2>Reset Password</h2>
              <Form onSubmit={handlePasswordReset}>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  required
                />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  required
                />
                <Button type="submit">
                  <FaKey /> Reset Password
                </Button>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </ProfileContainer>
      <Footer />
    </>
  );
};

export default Profile;
