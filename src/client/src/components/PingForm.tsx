import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import styled from "styled-components";
import { AlertOctagonIcon, Camera, LoaderIcon, X } from "lucide-react";
import { RootState } from "../store.js";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { CLEAR_ERRORS, NEW_PING_RESET } from "../constants/index.js";
import { useSelector } from "react-redux";
import { newPing, setSelectedChat } from "../actions/index.js";
import { Hospital, Patient } from "../types/index.js";
import { useNavigate } from "react-router-dom";
import Config from "../Config/index.js";

enum Severity {
  Critical = "Critical",
  Moderate = "Moderate",
  Minor = "Minor",
}


function PingForm({
  selectedHospital,
  onClose,
}: {
  selectedHospital: Hospital | null;
  onClose: () => void;
}) {
  const [complaint, setComplaint] = useState<string>("");
  const [image, setImage] = useState<string | undefined>("");
  const [severity, setSeverity] = useState<Severity>(Severity.Moderate); 
  const { user,accessToken } = useSelector((state: RootState) => state.auth);
  const { message, error, loading } = useSelector((state: RootState) => state.ping);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERRORS });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: NEW_PING_RESET });
      onClose();
      dispatch<any>(setSelectedChat(selectedHospital))
      navigate("/ping-chat");
     
    }
  }, [dispatch, error, message, onClose]);

  const handleComplaintChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComplaint(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result as string);
      }
    };

    e.target.files && reader.readAsDataURL(e.target.files[0]);
  };

  const handleRemoveImage = () => {
    setImage("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    dispatch<any>(
      newPing(accessToken, {
        complaint,
        patientId: user?._id,
        image,
        hospitalId: selectedHospital?._id,
        severity,
      })
    );
  };

  const handleSeverityChange = (value: Severity) => {
    setSeverity(value);
  };

  return (
    <Overlay>
      <FormContainer>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
        <Title>
          <AlertOctagonIcon /> {selectedHospital?.hospitalName}
        </Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="complaint">Complaint</Label>
            <TextArea
              autoFocus
              id="complaint"
              value={complaint}
              onChange={handleComplaintChange}
              rows={4}
              placeholder="Enter your complaint"
              required
            ></TextArea>
          </FormGroup>
          <FormGroup>
            <FileInput
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {image ? (
              <ImagePreview>
                <PreviewImage src={image} alt="Uploaded" />
                <RemoveImageButton onClick={handleRemoveImage}>
                  <X size={16} />
                </RemoveImageButton>
              </ImagePreview>
            ) : (
              <FileLabel htmlFor="image">
                <Camera
                  className="mr-2"
                  size={18}
                  style={{ marginRight: "5px" }}
                />
                Upload Image
              </FileLabel>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="severity">Severity</Label>
            <SeveritySelector>
              {Object.values(Severity).map((severityLevel) => (
                <SeverityButton
                  key={severityLevel}
                  onClick={() => handleSeverityChange(severityLevel)}
                  active={severity === severityLevel}
                  severity={severityLevel}
                >
                  {severityLevel}
                </SeverityButton>
              ))}
            </SeveritySelector>
          </FormGroup>
          <SubmitButton disabled={loading} type="submit">
            {loading && <LoaderIcon size={20} className="animate-spin" />}
            {!loading && "Submit"}
          </SubmitButton>
        </Form>
      </FormContainer>
    </Overlay>
  );
}

export default PingForm;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(31, 41, 55, 0.5);
  padding: 8px;
  overflow-x: hidden;
`;

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 32px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 10px;
  color: #4b5563;
  &:hover {
    color: #1f2937;
  }
  &:focus {
    outline: none;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 24px;
`;

const Form = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  color: #6366f1;
  cursor: pointer;
  &:hover {
    color: #4f46e5;
  }
`;

const ImagePreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

const PreviewImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
`;

const RemoveImageButton = styled.button`
  color: #ef4444;
  &:hover {
    color: #dc2626;
  }
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

const SeveritySelector = styled.div`
  display: flex;
  gap: 8px;
`;

const SeverityButton = styled.button<{ active: boolean; severity: Severity }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size:12px;
  background-color: ${(props) =>
    props.active
      ? props.severity === Severity.Critical
        ? "#ef4444"
        : props.severity === Severity.Moderate
        ? "#f59e0b"
        : "#10b981"
      : "#e5e7eb"};
  color: ${(props) => (props.active ? "white" : "inherit")};
  border: none;
  cursor: pointer;
  &:hover {
    background-color: ${(props) =>
      props.severity === Severity.Critical
        ? "#dc2626"
        : props.severity === Severity.Moderate
        ? "#f97316"
        : "#059669"};
  }
  &:focus {
    outline: none;
  }
`;
