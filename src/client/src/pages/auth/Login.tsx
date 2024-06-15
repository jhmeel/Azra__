/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import styled from "styled-components";
import loginImage from "../../assets/OnlineDoctor-bro .svg";
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
  const { admin, error, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERRORS });
    }
    if (admin) {
      toast.success("Logged in successfully");
      navigate("/dashboard");
    }
  }, [admin, dispatch, error, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch<any>(login({ email, password }));
  };

  return (
    <Wrapper>
      <Container>
        <ImageWrapper>
          <Image src={loginImage} alt="Login" />
        </ImageWrapper>
        <FormWrapper>
          <Title>Login</Title>
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
              {!loading && "Login"}
            </SubmitButton>
            <SignupPrompt>
              Don't have an account?{" "}
              <StyledLink to="/signup">Sign Up</StyledLink>
            </SignupPrompt>
          </Form>
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
  padding: 16px;
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
    width: 50%;
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
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;

const LockIcon = styled(Lock)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;


const EyeOffIcon = styled(EyeOff)`
  color: #6b7280;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
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
  top: 50%;
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
