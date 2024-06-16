import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import localforage from "localforage";
import Typewriter from "typewriter-effect";
import {
  UploadIcon,
  Phone,
  XIcon,
  Hospital as HospitalIcon,
  SendIcon,
} from "lucide-react";
import { Hospital, Ping } from "../types/index.js";
import { toast } from "sonner";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const socket = io("http://localhost:8000");

interface PingChatTabProps {
  pSelectedHospital: Hospital | null;
  pingDetails: Ping;
}

type Message = {
  sender: string;
  text: string;
  image?: string;
};

const Container = styled.div`
  position: fixed;
  top: 10px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
`;

const ChatContainer = styled.div`
  max-width: 768px;
  height: 100vh;
  @media (max-width: 767px) {
    max-width: 100%;
  }
  width: 100%;
  padding: 16px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  color: #4b5563;
  &:hover {
    color: #1f2937;
  }
  &:focus {
    outline: none;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 5px;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 24px;
`;

const HospitalInfo = styled.div`
  display: flex;
  align-items: center;
`;

const HospitalName = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;

const CallButton = styled.button`
  color: #3b82f6;
  &:hover {
    color: #2563eb;
  }
  &:focus {
    outline: none;
  }
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  max-height: 384px;
  @media(max-width:767px){
    max-height: 550px;
  }

  overflow-y: auto;
`;

const MessageItem = styled.div<{ isPatient: boolean }>`
  align-self: ${(props) => (props.isPatient ? "flex-end" : "flex-start")};
  background-color: ${(props) => (props.isPatient ? "#BFDBFE" : "#F3F4F6")};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  word-break: break-word;
`;

const MessageImage = styled.img`
  width: 100%;
  max-height: 150px;
`;

const MessageText = styled.div`
  padding: 16px;
`;

const Form = styled.form`
  max-width: 768px;
  width: 100%;
  padding: 10px 10px 20px 10px;
  background-color: #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3px;
`;

const TextInput = styled.input`
  flex: 1;
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
  position: relative;
  margin-top: 8px;
  display: flex;
  justify-content: center;
`;

const PreviewImage = styled.img`
  max-width: 45px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 4px;
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  margin-top: 8px;
  @media (min-width: 768px) {
    margin-top: 0;
    margin-left: 8px;
  }
  padding: 5px 10px;
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
  &:hover {
    background-color: #2563eb;
  }
  &:focus {
    outline: none;
  }
`;

function PingChatTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const {
    image: pImage,
    complaints: pComplaints,
    fullName: pFullname,
    hospital: pSelectedHospital,
  } = location.state || {};

  const navigate = useNavigate();
  useEffect(() => {
    const loadChatHistory = async () => {
      const chatHistory = await localforage.getItem<Message[]>(
        `chat_${pFullname}:${pSelectedHospital?.$id}`
      );
      if (chatHistory) {
        setMessages(chatHistory);
      } else if (pComplaints) {
        setMessages([
          {
            sender: `patient:${pFullname}@${new Date().toLocaleTimeString()}`,
            text: pComplaints,
            image: pImage,
          },
        ]);
      }

      persistMessage([
        {
          sender: `patient:${pFullname}@${new Date().toLocaleTimeString()}`,
          text: pComplaints,
          image: pImage,
        },
      ]);
    };

    
    loadChatHistory();

    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [pSelectedHospital?.$id]);


  const persistMessage = async (messages: Message[]) => {
    const prev: Array<Message> =
      (await localforage.getItem(
        `chat_${pFullname}:${pSelectedHospital?.$id}`
      )) || [];
    if (prev) {
      const update = [...prev, ...messages];
      await localforage.setItem(
        `chat_${pFullname}:${pSelectedHospital?.$id}`,
        update
      );
    } else {
      await localforage.setItem(
        `chat_${pFullname}:${pSelectedHospital?.$id}`,
        messages
      );
    }
  };
  useEffect(() => {
    persistMessage(messages);
  }, [messages, pSelectedHospital?.$id]);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
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
    setImage(undefined);
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim() || image) {
      const newMessage: Message = {
        sender: `patient:${pFullname}@${new Date().toLocaleTimeString()}`,
        text: inputMessage,
        image,
      };

      socket.emit("sendMessage", {
        ...newMessage,
        hospitalId: pSelectedHospital?.$id,
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");
      setImage(undefined);
    }
  };

  const handleCall = () => {
    window.location.href = "tel:" + pSelectedHospital?.hospitalName;
  };

  return (
    <Container>
      <ChatContainer>
        <CloseButton
          onClick={() => {
            navigate("/");
          }}
        >
          <XIcon size={20} />
        </CloseButton>
        <Header>
          <HospitalInfo>
            <HospitalIcon size={20} style={{ color: "blue" }} />
            <HospitalName>{pSelectedHospital?.hospitalName}</HospitalName>
          </HospitalInfo>
          <CallButton onClick={handleCall}>
            <Phone size={20} />
          </CallButton>
        </Header>
        <div className="text-center mb-4">
          <Typewriter
            options={{
              strings: `Welcome to ${pSelectedHospital?.hospitalName}! How can we assist you today?`,
              autoStart: true,
              loop: false,
            }}
          />
        </div>
        <MessagesContainer>
          {messages.map((message, index) => (
            <MessageItem
              key={index}
              isPatient={message.sender.startsWith("patient")}
            >
              {message.image && (
                <MessageImage src={message.image} alt="Uploaded" />
              )}
              <MessageText>
                {message.sender.replace("patient:", "")}
              </MessageText>
              <MessageText>{message.text}</MessageText>
            </MessageItem>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
      </ChatContainer>
      <Form onSubmit={handleSendMessage}>
        <FormGroup>
          <TextInput
            type="text"
            value={inputMessage}
            onChange={handleMessageChange}
            placeholder="Type your message..."
          />
          <FileInput
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
          />
          {!image ? (
            <FileLabel htmlFor="image">
              <UploadIcon size={16} />
            </FileLabel>
          ) : (
            <ImagePreview>
              <PreviewImage src={image} alt="Selected" />
              <RemoveImageButton onClick={handleRemoveImage}>
                <XIcon size={14} />
              </RemoveImageButton>
            </ImagePreview>
          )}
          <SendButton type="submit">
            <SendIcon size={16} />
          </SendButton>
        </FormGroup>
      </Form>
    </Container>
  );
}

export default PingChatTab;
