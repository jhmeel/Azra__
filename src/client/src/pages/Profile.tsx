import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUser, FaKey, FaMapMarkerAlt, FaEnvelope, FaEdit, FaFileAlt, FaCalendarAlt, FaHospital } from "react-icons/fa";
import { toast } from "sonner";
import Config from "../Config";
import reverseGeocode from "reverse-geocode";
import Footer from "../components/Footer";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";


interface Patient {
  $id: string;
  name: string;
  email: string;
  avatar: string;
  country: string;
  phone: string;
}

const ProfileContainer = styled.div`
  max-width: 1200px;

  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color:#fff;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #ededed;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const AvatarContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto;
  text-align: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
`;

const AvatarUpload = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #007bff;
  color: white;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 10px 20px;
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

  &.red {
    background-color: #ef4444;
    &:hover {
      background-color: #dc2626;
    }
  }

  &.green {
    background-color: #10b981;
    &:hover {
      background-color: #047857;
    }
  }

  &.purple {
    background-color: #8b5cf6;
    &:hover {
      background-color: #7c3aed;
    }
  }

  &.blue {
    background-color: #3b82f6;
    &:hover {
      background-color: #2563eb;
    }
  }
`;

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #888;
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
  outline: 1px solid #3e7dbc;
`;

export const Profile: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { authRes } = useSelector((state: RootState) => state.auth);
  const [patient, setPatient] = useState<Patient|null>(null);

  useEffect(() => {
    if (authRes?.patient) {
      setPatient(authRes?.patient.documents[0]);
    } 
  }, [authRes]);


  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation(`${latitude}, ${longitude}`);

            const result = reverseGeocode.lookup(latitude, longitude, "ng");
            if (result && result?.city) {
              setCountry(result?.state);
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

    getLocation();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Profile update logic here
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
      // Password reset logic here
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
      // Avatar upload logic here
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    }
  };

  return (
    <>
      <ProfileContainer>
        <Card>
          <AvatarContainer>
            <AvatarImage src={patient?.avatar} alt="Patient Avatar" />
            <AvatarUpload htmlFor="avatar-upload">
              <FaEdit />
            </AvatarUpload>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </AvatarContainer>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>{patient?.fullName}</h2>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '10px' }}>{patient?.email}</p>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '10px' }}>{patient?.phone}</p>
          <Button className="blue" onClick={() => setShowEditModal(true)}>
            <FaEdit /> Edit Profile
          </Button>
        </Card>
        <Card>
        <h3 style={{ textAlign: 'center' }}>Location</h3>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '10px' }}>
            {country ? `Country: ${country}` : "Country: Not Available"}
          </p>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '10px' }}>
            {location ? `Location: ${location}` : "Location: Not Available"}
          </p>
        </Card>
      </ProfileContainer>

      <ProfileContainer>
        <Card>
          <h3 style={{ textAlign: 'center' }}>Quick Actions</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Button className="blue">
              <FaFileAlt /> View Reports
            </Button>
            <Button className="green">
              <FaCalendarAlt /> Book Appointment
            </Button>
            <Button className="purple">
              <FaHospital /> Visit History
            </Button>
            <Button className="red" onClick={() => setShowPasswordModal(true)}>
              <FaKey /> Reset Password
            </Button>
          </div>
        </Card>
      </ProfileContainer>

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
                value={patient?.fullName}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
              />
              <Input
                type="email"
                value={patient?.email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <Input
                type="phone"
                value={patient?.phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                required
              />
              <Button type="submit">
                <FaUser /> Update
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

      <Footer />
    </>
  );
};

export default Profile;
