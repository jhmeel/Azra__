import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaKey,
  FaMapMarkerAlt,
  FaEnvelope,
  FaEdit,
  FaCalendarAlt,
  FaHospital,
  FaPhone,
  FaArrowLeft,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "sonner";
import Footer from "../components/Footer";
import { Loader, LogOut, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate, useLocation } from "react-router-dom";
import { clearErrors, LogoutUser, updatePatientProfile } from "../actions";
import { useDispatch } from "react-redux";
import { UPDATE_PATIENT_PROFILE_RESET } from "../constants";
import { Coordinate } from "../types";
import emptyAvatar from '../assets/emptyAvatar.jpeg'

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #43c0b8;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
  transition: color 0.3s ease;

  &:hover {
    color: #35a199;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  border-radius: 15px;
  padding: 30px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 30px;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 15px;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #43c0b8;
  box-shadow: 0 2px 10px rgba(67, 192, 184, 0.3);
`;

const ProfileEditBtn = styled.label`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #43c0b8;
  color: white;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #35a199;
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const UserName = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 15px;
`;

const UserDetail = styled.p`
  display: flex;
  align-items: center;
  color: #555;
  font-size: 1rem;

  svg {
    margin-right: 10px;
    color: #43c0b8;
  }
`;

const ProfileContent = styled.div`
  display: grid;

`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 15px;
   padding:5px 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  color: #43c0b8;
  margin-bottom: 20px;
  border-bottom: 2px solid #43c0b8;
  padding-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.disabled ? "#c5c5c7" : "#43c0b8")};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
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
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 450px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #43c0b8;
  transition: color 0.3s ease;

  &:hover {
    color: #35a199;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #43c0b8;
  }
`;

const AvatarPreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 20px;
  border: 3px solid #43c0b8;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LogoutButton = styled.button`
padding:5px 10px;
background: teal;
color:#fff;
border-radius:6px;
margin:5px;
`

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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [userLocation, setUserLocation] = useState<Coordinate>({
    lat: 0,
    lng: 0,
  });
  const {
    loading: profileLoading,
    message: profileMessage,
    error: profileError,
  } = useSelector((state: RootState) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileError) {
      toast.error(profileError);
      dispatch<any>(clearErrors());
    }
    if (profileMessage) {
      toast.success(profileMessage);
      dispatch({ type: UPDATE_PATIENT_PROFILE_RESET });
    }
  }, [profileError, profileMessage, dispatch]);
  
  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    () => {
      console.log("Error getting user location");
    }
  );
}, []);

const handleLogout = ()=>{
LogoutUser()
navigate('/')
}
  useEffect(() => {
    const getLocation = async () => {
      try {

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLocation.lng},${userLocation.lat}.json?access_token=${'pk.eyJ1IjoiamhtZWVsIiwiYSI6ImNseTZmeGkzNzA5bmwybHFyYzFrbGpwMnYifQ.zLf5q1bwCDE0msuYj8Evaw'}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }

        const data = await response.json();

        if (data.features.length > 0) {
          const place = data.features[0];
      
          setLocation(place?.place_name);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        toast.error("Failed to get current location");
      }
    };

    getLocation();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch<any>(
      updatePatientProfile(accessToken, user._id, {
        email,
        phone,
        fullName: name,
        avatar: avatarPreview,
      })
    );
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    toast.success('Password updated successfully')
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <ProfileContainer>
        <BackButton onClick={() => navigate("/")}>
          <FaArrowLeft />
        </BackButton>
        <ProfileHeader>
          <AvatarSection>
            <AvatarContainer>
              <AvatarImage src={user?.avatar||emptyAvatar} alt="Patient Avatar" />
              <ProfileEditBtn htmlFor="avatar-upload">
                <FaEdit onClick={() => setShowEditModal(true)} />
              </ProfileEditBtn>
            </AvatarContainer>
          </AvatarSection>
          <UserInfo>
            <UserName>{user?.fullName}</UserName>
            <UserDetail>
              <FaEnvelope /> {user?.email}
            </UserDetail>
            <UserDetail>
              <FaPhone /> {user?.phone}
            </UserDetail>
            <UserDetail>
              <FaMapMarkerAlt /> {location || "N/A"} 
            </UserDetail>
          </UserInfo>
        </ProfileHeader>

        <ProfileContent>
          <Card>
            <CardTitle>Quick Actions</CardTitle>
            <ActionButtons>
              <Button onClick={() => navigate("/")}>
                <FaCalendarAlt /> Schedule Appointment
              </Button>
              <Button>
                <FaHospital /> Visit History
              </Button>
              <Button onClick={() => setShowPasswordModal(true)}>
                <FaKey /> Change Password
              </Button>
            </ActionButtons>
          </Card>
        </ProfileContent>
      </ProfileContainer>

      {showEditModal && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={() => setShowEditModal(false)}>
              <X />
            </CloseButton>
            <CardTitle>Edit Profile</CardTitle>
            <Form onSubmit={handleProfileUpdate}>
              <AvatarPreview>
                {avatarPreview ? (
                  <PreviewImage
                    src={user?.avatar || avatarPreview}
                    alt="Avatar Preview"
                  />
                ) : (
                  <FaUserCircle size={100} color="#43c0b8" />
                )}
              </AvatarPreview>
              <Input
                hidden
                id="avatarSelector"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <label
                style={{ cursor: "pointer", color: "grey" }}
                htmlFor="avatarSelector"
              >
                Select avatar
              </label>
              <Input
                type="text"
                autoFocus
                value={user?.fullName || name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                disabled={profileLoading}
              />
              <Input
                type="email"
                value={user?.email || email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                disabled={profileLoading}
              />
              <Input
                type="tel"
                value={user?.phone || phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                required
                disabled={profileLoading}
              />
              <Button type="submit" disabled={profileLoading}>
                {profileLoading && <Loader size={20} className="animate-spin" />}
                Update Profile
              </Button>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showPasswordModal && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={() => setShowPasswordModal(false)}>
              <X />
            </CloseButton>
            <CardTitle>Change Password</CardTitle>
            <Form onSubmit={handlePasswordReset}>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                required
                disabled={profileLoading}
              />
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                disabled={profileLoading}
              />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
                disabled={profileLoading}
              />
              <Button type="submit" disabled={profileLoading}>
                Change Password
              </Button>
            </Form>
          </ModalContent>
        </Modal>
      )}
<LogoutButton onClick={handleLogout}><LogOut size={18}/></LogoutButton>
      <Footer />
    </>
  );
};

export default Profile;
