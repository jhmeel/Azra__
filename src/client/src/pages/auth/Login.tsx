import { useEffect, useState } from "react";
import styled from "styled-components";
import loginImage from "../../assets/OnlineDoctor-bro.svg";
import { Link, useNavigate } from "react-router-dom";
import { Mail, EyeOff, EyeIcon, Lock, LoaderIcon } from "lucide-react";
import { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { CLEAR_ERRORS } from "../../constants";
import { toast } from "sonner";
import { login } from "../../actions";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isHospital, setIsHospital] = useState<boolean>(false);
  const { user, error, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERRORS });
    }
    if (user) {
      toast.success("Logged in successfully");
      navigate("/dashboard");
    }
  }, [user, dispatch, error, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch<any>(login({ email, password }, isHospital));
  };

  const handleGoogleLogin = () => {};

  return (
    <Wrapper>
      <Container>
        <ImageWrapper>
          <Image src={loginImage} alt="Login" />
        </ImageWrapper>
        <FormWrapper>
          <Title>Login</Title>
          <LoginTypeToggle>
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
          </LoginTypeToggle>
          {!isHospital && (
            <GoogleButton type="button" onClick={handleGoogleLogin}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                width="18"
                height="18"
              />
              Login with Google
            </GoogleButton>
          )}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <InputWrapper>
                <MailIcon />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <LockIcon />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <TogglePasswordButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </TogglePasswordButton>
              </InputWrapper>
            </FormGroup>
            <SubmitButton disabled={loading} type="submit">
              {loading && <Loader size={20} className="animate-spin" />}
              {!loading && `Login`}
            </SubmitButton>
          </Form>
          <ForgotPassword>
            <Link to="/forgot-password">Forgot Password?</Link>
          </ForgotPassword>
          <SignupPrompt>
            Don't have an account? <StyledLink to="/signup">Sign Up</StyledLink>
          </SignupPrompt>
        </FormWrapper>
      </Container>
    </Wrapper>
  );
};

export default LoginForm;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
`;

const Container = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  margin-bottom: 32px;
  @media (min-width: 1024px) {
    width: 50%;
    margin-bottom: 0;
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const FormWrapper = styled.div`
  width: 100%;
  @media (min-width: 1024px) {
    width: 70%;
    padding-left: 32px;
  }
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4b5563;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MailIcon = styled(Mail)`
  position: absolute;
  left: 12px;
  top: 68%;
  transform: translateY(-50%);
  color: #6b7280;
`;

const LockIcon = styled(Lock)`
  position: absolute;
  left: 12px;
  top: 68%;
  transform: translateY(-50%);
  color: #6b7280;
`;

const EyeOffIcon = styled(EyeOff)`
  color: #6b7280;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 50px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 12px;
  top: 68%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  color: white;
  background-color: #3b82f6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover {
    background-color: #2563eb;
  }
  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const Loader = styled(LoaderIcon)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SignupPrompt = styled.p`
  text-align: center;
  color: #6b7280;
  margin-top: 16px;
`;

const StyledLink = styled(Link)`
  color: #3b82f6;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginTypeToggle = styled.div`
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
  margin-bottom: 1rem;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: 0.5rem;

  a {
    color: #3b82f6;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
