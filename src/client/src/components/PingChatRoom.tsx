import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  UploadIcon,
  Phone,
  XIcon,
  Hospital as HospitalIcon,
  SendIcon,
  Trash2,
  Check,
  CheckCheck,
} from "lucide-react";
import { Hospital, Message } from "../types";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Client, Databases, Storage, Query, ID } from "appwrite";
import Config from "../Config";

const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID);

const database = new Databases(client);
const storage = new Storage(client);

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-image: url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png");
  background-repeat: repeat;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  height: 60px;
  background: linear-gradient(to right, #4fd1c5, #38b2ac);
  color: white;
`;

const HospitalInfo = styled.div`
  display: flex;
  align-items: center;
`;

const HospitalName = styled.h2`
  font-size: 16px;
  margin-left: 12px;
`;

const StatusIndicator = styled.div<{ isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.isActive ? "#4caf50" : "#bdbdbd")};
  margin-left: 8px;
`;

const CallButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const MessageItem = styled.div<{ isPatient: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isPatient ? "row-reverse" : "row")};
  margin-bottom: 8px;
`;

const MessageContent = styled.div<{ isPatient: boolean }>`
  max-width: 65%;
  background-color: ${(props) => (props.isPatient ? "#dcf8c6" : "white")};
  border-radius: 7.5px;
  padding: 6px 7px 8px 9px;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);

  @media (max-width: 768px) {
    max-width: 80%;
  }
`;

const MessageText = styled.p`
  margin: 0;
  word-wrap: break-word;
  font-size: 14.2px;
  line-height: 19px;
  color: #303030;
`;

const MessageImage = styled.img`
  max-width: 100%;
  border-radius: 6px;
  margin-top: 4px;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2px;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  margin-left: 4px;
  padding: 0;
  font-size: 11px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
`;

const TextInput = styled.input`
  flex: 2;
  padding: 9px 12px;
  border: none;
  border-radius: 21px;
  background-color: white;
  font-size: 15px;
  outline: none;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #919191;
  cursor: pointer;
`;
const ImagePreview = styled.div`
  position: relative;
  margin-top: 8px;
  display: flex;
  justify-content: center;
`;
interface Prev {
  src: string | null;
}
const PreviewImage = styled.img<Prev>`
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(to right, #15756c, #38b2ac);
  color: white;
  cursor: pointer;
`;

function PatientChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isHospitalActive, setIsHospitalActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authRes } = useSelector((state: RootState) => state.auth);
  const { patient: currentUser } = authRes;
  const location = useLocation();
  const {
    image: pImage,
    complaints: pComplaints,
    hospital: pSelectedHospital,
  }: {
    image: string;
    complaints: string;
    hospital: Hospital;
  } = location.state || {};

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (currentUser) {
      const unsubscribeMessages = subscribeToMessages();
      const unsubscribeHospitalStatus = subscribeToHospitalStatus();
      fetchMessages();

      return () => {
        unsubscribeMessages();
        unsubscribeHospitalStatus();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const subscribeToMessages = () => {
    return client.subscribe(
      `databases.${Config.APPWRITE.DATABASE_ID}.collections.${Config.APPWRITE.PINGS_COLLECTION_ID}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          const newMessage = response.payload as Message;
          if (
            newMessage.senderId === currentUser.userId &&
            newMessage.receiverId === pSelectedHospital.userId
          ) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      }
    );
  };

  const subscribeToHospitalStatus = () => {
    return client.subscribe(
      `databases.${Config.APPWRITE.DATABASE_ID}.collections.${Config.APPWRITE.HOSPITAL_COLLECTION_ID}.documents.${pSelectedHospital.userId}`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          const updatedHospital = response.payload as Hospital;
          setIsHospitalActive(updatedHospital.isActive);
        }
      }
    );
  };

  const fetchMessages = async () => {
    try {
      const response = await database.listDocuments(
        Config.APPWRITE.DATABASE_ID,
        Config.APPWRITE.PINGS_COLLECTION_ID,
        [
          Query.equal("patientId", currentUser?.userId),
          Query.equal("hospitalId", pSelectedHospital.userId),
          Query.orderAsc("$createdAt"),
        ]
      );
      setMessages(response.documents as Message[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages. Please try again.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() || image) {
      try {
        let mediaUrl = "";
        if (image) {
          const uploadedFile = await storage.createFile(
            Config.APPWRITE.BUCKET_ID,
            ID.unique(),
            image
          );
          mediaUrl = storage.getFileView(
            Config.APPWRITE.BUCKET_ID,
            uploadedFile.$id
          ).href;
        }

        const newMessage: Omit<Message, "$id" | "$createdAt" | "$updatedAt"> = {
          patientId: currentUser.userId,
          hospitalId: pSelectedHospital.userId,
          content: inputMessage.trim(),
          mediaUrl,
          isRead: false,
        };

        await database.createDocument(
          Config.APPWRITE.DATABASE_ID,
          Config.APPWRITE.PINGS_COLLECTION_ID,
          ID.unique(),
          newMessage
        );

        setInputMessage("");
        setImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result as string);
      }
    };

    e.target.files && reader.readAsDataURL(e.target.files[0]);
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await database.deleteDocument(
        Config.APPWRITE.DATABASE_ID,
        Config.APPWRITE.PINGS_COLLECTION_ID,
        messageId
      );
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.$id !== messageId)
      );
      toast.success("Message deleted successfully.");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message. Please try again.");
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${pSelectedHospital.phone}`;
  };

  return (
    <Container>
      <ChatContainer>
        <Header>
          <HospitalInfo>
            <HospitalIcon size={24} />
            <HospitalName>{pSelectedHospital.hospitalName}</HospitalName>
            <StatusIndicator isActive={isHospitalActive} />
          </HospitalInfo>
          <CallButton onClick={handleCall}>
            <Phone size={24} />
          </CallButton>
        </Header>
        <MessagesContainer>
          {messages.map((message) => (
            <MessageItem
              key={message.$id}
              isPatient={message.patientId === currentUser.userId}
            >
              <MessageContent isPatient={message.patientId === currentUser.userId}>
                <MessageText>{message.content}</MessageText>
                {message.mediaUrl && (
                  <MessageImage src={message.mediaUrl} alt="Attached media" />
                )}
                <MessageMeta>
                  {new Date(message.$createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {message.patientId === currentUser.userId && (
                    <>
                      {message.isRead ? (
                        <CheckCheck size={16} />
                      ) : (
                        <Check size={16} />
                      )}
                      <DeleteButton
                        onClick={() => handleDeleteMessage(message.$id)}
                      >
                        <Trash2 size={14} />
                      </DeleteButton>
                    </>
                  )}
                </MessageMeta>
              </MessageContent>
            </MessageItem>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
      </ChatContainer>
      <InputContainer onSubmit={handleSendMessage}>
        <TextInput
          type="text"
          autoFocus
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
        />
        <FileInput
          type="file"
          id="image"
          onChange={handleImageChange}
          accept="image/*"
          ref={fileInputRef}
        />
        {!image ? (
          <FileLabel htmlFor="image">
            <UploadIcon size={16} />
          </FileLabel>
        ) : (
          <ImagePreview>
            <PreviewImage src={imagePreview} alt="Selected" />
            <RemoveImageButton onClick={handleRemoveImage}>
              <XIcon size={14} />
            </RemoveImageButton>
          </ImagePreview>
        )}
        <SendButton type="submit">
          <SendIcon size={20} />
        </SendButton>
      </InputContainer>
    </Container>
  );
}

export default PatientChatInterface;
