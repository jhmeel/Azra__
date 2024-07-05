import React, { useState, useCallback, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import signupImage from "../../assets/OnlineDoctor-bro.svg";
import { Countries } from "../../utils/formatter";
import { Link, useNavigate } from "react-router-dom";
import { Role, SignupFormData } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { toast } from "sonner";
import { CLEAR_ERRORS } from "../../constants";
import { signup } from "../../actions";
import { LoaderIcon, X } from "lucide-react";
import styled from "styled-components";
import Footer from "../../components/Footer";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    flex-direction: row;
    padding: 2rem;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    width: 50%;
    margin-bottom: 0;
  }

  img {
    width: 100%;
    height: auto;
  }
`;

const FormWrapper = styled.div`
  width: 100%;

  @media (min-width: 1024px) {
    width: 50%;
  }
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const Message = styled.p<{ success: boolean }>`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.375rem;
  ${({ success }) =>
    success
      ? `background-color: #d1fae5; color: #065f46;`
      : `background-color: #fee2e2; color: #991b1b;`}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
`;

const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ error }) => (error ? "#ef4444" : "#d1d5db")};
  border-radius: 0.375rem;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #ef4444;
`;

const PhoneInputWrapper = styled.div`
  display: flex;
`;

const CountrySelect = styled.select`
  padding: 0.1rem;
  border: 1px solid #d1d5db;
  border-right: none;
  border-radius: 0.375rem 0 0 0.375rem;
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const PhoneInput = styled(Input)`
  border-radius: 0 0.375rem 0.375rem 0;
`;

const LocationButton = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  color: black;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button<{ loading: boolean }>`
  width: 100%;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: white;
  border-radius: 0.375rem;
  background-color: ${({ loading }) => (loading ? "#60a5fa" : "#3b82f6")};
  cursor: ${({ loading }) => (loading ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${({ loading }) => (loading ? "#60a5fa" : "#2563eb")};
  }
`;

const TermsWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  input {
    margin-right: 0.5rem;
  }

  a {
    color: #3b82f6;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #4b5563;

  a {
    color: #3b82f6;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Drawer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const DrawerContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 40rem;
  height: 40vh;
`;

const DrawerHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d1d5db;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
  }

  button {
    color: #6b7280;
    &:hover {
      color: #374151;
    }
  }
`;

const DrawerBody = styled.div`
  padding: 1rem;
  height: 100%;
`;

const SignupTypeToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${({ active }) => (active ? "#3b82f6" : "#e5e7eb")};
  color: ${({ active }) => (active ? "white" : "#4b5563")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:first-child {
    border-radius: 0.375rem 0 0 0.375rem;
  }

  &:last-child {
    border-radius: 0 0.375rem 0.375rem 0;
  }

  &:hover {
    background-color: ${({ active }) => (active ? "#2563eb" : "#d1d5db")};
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #4b5563;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const LocationSelector: React.FC = () => {
  const resultRef = useRef<HTMLPreElement>(null);
  const geocoderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiamhtZWVsIiwiYSI6ImNseTZmeGkzNzA5bmwybHFyYzFrbGpwMnYifQ.zLf5q1bwCDE0msuYj8Evaw";

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: "country,region,place,postcode,locality,neighborhood,poi,poi.landmark",
      bbox: [2.691701, 4.240594, 14.577222, 13.865924], 
      marker: false,
    });

    const geocoderContainer = geocoderContainerRef.current;
    if (geocoderContainer && !geocoderContainer.firstChild) {
      geocoderContainer.appendChild(geocoder.onAdd());
    }

    const handleResult = (e: any) => {
      if (resultRef.current) {
        const coordinates = e.result.center;
        resultRef.current.innerText = `${coordinates[0]}, ${coordinates[1]}`;
      }
    };

    const handleClear = () => {
      if (resultRef.current) {
        resultRef.current.innerText = "";
      }
    };

    geocoder.on("result", handleResult);
    geocoder.on("clear", handleClear);

    return () => {
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div id="geocoder" ref={geocoderContainerRef} style={{ zIndex: 1, margin: "20px", }}></div>
      <pre id="result" ref={resultRef}></pre>
    </div>
  );
};

const SignupForm = () => {
  const [isHospital, setIsHospital] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();
  const [message, setMessage] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>("+234");

  const { user, role, error, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERRORS });
    }

    if (user && role?.toLowerCase() == Role.HOSPITAL) {
      toast.success("Signup successfully");
      navigate("/dashboard");
    } else if (user && role?.toLowerCase() == Role.PATIENT) {
      toast.success("Signup successfully");
      navigate("/profile");
    }
  }, [user, dispatch, error, navigate]);

  const handleRemoveLocation = () => {
    setSelectedLocation(null);
    setDrawerOpen(false);
  };

  const onSubmit: SubmitHandler<SignupFormData> = (data) => {
    const { acceptTerms, ...restData } = data;

    const updatedData = {
      ...restData,
      phone:
        data.phone.length === 11
          ? selectedDomain + data.phone.slice(1)
          : data.phone,
    };

    dispatch<any>(signup(updatedData, isHospital));
  };

  const handleGoogleSignup = async () => {
    window.location.href = "https://distinct-reward-nosy-attraction-beta.pipeops.app/api/v1/auth/p-oauth/success";
  };

  return (
    <>
      <Container>
        <FormContainer>
          <ImageWrapper>
            <img src={signupImage} alt="Signup Illustration" />
          </ImageWrapper>
          <FormWrapper>
            <Title>Sign Up</Title>
            <SignupTypeToggle>
              <ToggleButton
                active={!isHospital}
                onClick={() => setIsHospital(false)}
              >
                Patient
              </ToggleButton>
              <ToggleButton
                active={isHospital}
                onClick={() => setIsHospital(true)}
              >
                Hospital
              </ToggleButton>
            </SignupTypeToggle>
            {message && (
              <Message success={message.includes("successful")}>
                {message}
              </Message>
            )}
            <Form onSubmit={handleSubmit(onSubmit)}>
              {isHospital ? (
                <>
                  <div>
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input
                      type="text"
                      autoFocus
                      id="hospitalName"
                      {...register("hospitalName", {
                        required: "Hospital Name is required",
                      })}
                      error={!!errors.hospitalName}
                    />
                    {errors.hospitalName && (
                      <ErrorMessage>{errors.hospitalName.message}</ErrorMessage>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="hospitalNumber">Hospital Number</Label>
                    <Input
                      type="text"
                      id="hospitalNumber"
                      {...register("hospitalNumber", {
                        required: "Hospital Number is required",
                      })}
                      error={!!errors.hospitalNumber}
                    />
                    {errors.hospitalNumber && (
                      <ErrorMessage>
                        {errors.hospitalNumber.message}
                      </ErrorMessage>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    type="text"
                    autoFocus
                    id="fullName"
                    {...register("fullName", {
                      required: "Full Name is required",
                    })}
                    error={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <ErrorMessage>{errors.fullName.message}</ErrorMessage>
                  )}
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors.email}
                />
                {errors.email && (
                  <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInputWrapper>
                  <CountrySelect
                    id="countryCode"
                    onChange={(e) => setSelectedDomain(e.target.value)}
                  >
                    {Countries.map((country) => (
                      <option key={country.code} value={country.domain}>
                        {country.code} ({country.domain})
                      </option>
                    ))}
                  </CountrySelect>
                  <PhoneInput
                    type="tel"
                    id="phone"
                    placeholder="Phone Number"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\d{6,14}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    error={!!errors.phone}
                  />
                </PhoneInputWrapper>
                {errors.phone && (
                  <ErrorMessage>{errors.phone.message}</ErrorMessage>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={!!errors.password}
                />
                {errors.password && (
                  <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
                )}
              </div>
              {isHospital && (
                <div>
                  <LocationButton
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                  >
                    {selectedLocation
                      ? `Location Selected (${selectedLocation.lat}, ${selectedLocation.lng})`
                      : "Select Location"}
                  </LocationButton>
                  {drawerOpen && (
                    <Drawer open={drawerOpen}>
                      <DrawerContent>
                        <DrawerHeader>
                          <h2>Search for your facility</h2>
                          <button onClick={() => handleRemoveLocation()}>
                            <X />
                          </button>
                        </DrawerHeader>
                        <DrawerBody>
                          <LocationSelector />
                        </DrawerBody>
                      </DrawerContent>
                    </Drawer>
                  )}
                </div>
              )}
              <TermsWrapper>
                <input
                  type="checkbox"
                  id="acceptTerms"
                  {...register("acceptTerms", {
                    required: "You must accept the terms to sign up",
                  })}
                />
                <Label htmlFor="acceptTerms">
                  I accept the <Link to="/terms">Terms and Conditions</Link>
                </Label>
              </TermsWrapper>
              {errors.acceptTerms && (
                <ErrorMessage>{errors.acceptTerms.message}</ErrorMessage>
              )}
              <SubmitButton type="submit" loading={loading}>
                {loading ? (
                  <LoaderIcon className="animate-spin" size={20} />
                ) : (
                  "Sign Up"
                )}
              </SubmitButton>
            </Form>
            <LoginText>
              Already have an account? <Link to="/login">Log in</Link>
            </LoginText>
          </FormWrapper>
        </FormContainer>
      </Container>
      <Footer />
    </>
  );
};

export default SignupForm;