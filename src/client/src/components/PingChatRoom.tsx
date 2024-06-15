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

const socket = io("http://localhost:8000");

interface PingChatTabProps {
  selectedHospital: Hospital | null;
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
  background-color: rgba(31, 41, 55, 0.6);
  padding: 8px;
`;

const ChatContainer = styled.div`
  max-width: 768px;
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
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
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
  height: auto;
`;

const MessageText = styled.div`
  padding: 16px;
`;

const Form = styled.form`
  max-width: 768px;
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
  gap: 8px;
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
  max-width: 320px;
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
  padding: 8px 16px;
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

function PingChatTab({ selectedHospital, pingDetails }: PingChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      const chatHistory = await localforage.getItem<Message[]>(
        `chat_${pingDetails.fullname}:${selectedHospital?.$id}`
      );
      if (chatHistory) {
        setMessages(chatHistory);
      }
      setMessages([
        {
          sender: `patient:${
            pingDetails.fullname
          }@${new Date().toLocaleTimeString()}`,
          text: `${pingDetails.fullname}\n${pingDetails.complaints}`,
          image: pingDetails.image,
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
  }, [selectedHospital?.$id, pingDetails]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localforage.setItem(
      `chat_${pingDetails.fullname}:${selectedHospital?.$id}`,
      messages
    );
  }, [messages, selectedHospital?.$id]);

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
        sender: `patient:${
          pingDetails.fullname
        }@${new Date().toLocaleTimeString()}`,
        text: inputMessage,
        image,
      };
      toast.success(newMessage.image);
      socket.emit("sendMessage", {
        ...newMessage,
        hospitalId: selectedHospital?.$id,
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");
      setImage(undefined);
    }
  };

  const handleCall = () => {
    window.location.href = "tel:" + selectedHospital?.hospitalName;
  };

  return (
    <Container>
      <ChatContainer>
        <CloseButton onClick={() => {}}>
          <XIcon size={20} />
        </CloseButton>
        <Header>
          <HospitalInfo>
            <HospitalIcon size={40} className="text-blue-500 md:mr-2" />
            <HospitalName>{selectedHospital?.hospitalName}</HospitalName>
          </HospitalInfo>
          <CallButton onClick={handleCall}>
            <Phone
              className="border mt-10 p-2 rounded cursor-pointer bg-white shadow-sm"
              size={35}
            />
          </CallButton>
        </Header>
        <div className="text-center mb-4">
          <Typewriter
            options={{
              strings: `Welcome to ${selectedHospital?.hospitalName}! How can we assist you today?`,
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
              <UploadIcon size={24} />
            </FileLabel>
          ) : (
            <ImagePreview>
              <PreviewImage src={image} alt="Selected" />
              <RemoveImageButton onClick={handleRemoveImage}>
                <XIcon size={16} />
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
