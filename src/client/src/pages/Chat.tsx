import React, { useState, useEffect } from "react";
import { Send, File, Phone, Menu, X } from "lucide-react";
import { Hospital } from "../types";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { getActiveChats } from "../actions";
import styled from "styled-components";

// Interface for the Message object
interface Message {
  sender: Hospital;
  to: Hospital;
  date: string;
  type: string;
  content: string;
}

// Initialize the Socket.IO client
const socket = io("http://localhost:8000");

// Styled components

// Container component for the entire chat UI
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7fafc;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

// Sidebar component for displaying active chats
const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  position: fixed;
  z-index: 10;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};

  @media (min-width: 768px) {
    width: 33%;
    max-width: 300px;
    position: relative;
    transform: translateX(0);
  }
`;

// Header section of the sidebar
const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

// User avatar in the sidebar header
const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

// User information in the sidebar header
const UserInfo = styled.div`
  margin-left: 16px;
`;

// User name in the sidebar header
const UserName = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

// User status in the sidebar header
const UserStatus = styled.p`
  color: #38a169;
`;

// Close button for the sidebar on mobile
const CloseButton = styled.button`
  display: block;
  background: none;
  border: none;

  @media (min-width: 768px) {
    display: none;
  }
`;

// Title for the active chats list
const ChatsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

// List of active chats
const ChatList = styled.ul``;

// Individual chat item in the list
const ChatItem = styled.li`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #edf2f7;
  }
`;

// Avatar of the hospital in the chat item
const ChatAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

// Information section of the chat item
const ChatInfo = styled.div`
  margin-left: 16px;
`;

// Hospital name in the chat item
const ChatName = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

// Status in the chat item
const ChatStatus = styled.p`
  font-size: 12px;
  color: #a0aec0;
`;

// Main content area for displaying messages
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: auto;
  width: 100%;

  @media (min-width: 768px) {
    margin-left: 0;
  }
`;

// Header section of the main content area
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  justify-content: space-between;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

// Open sidebar button for mobile
const OpenSidebarButton = styled.button`
  background: none;
  border: none;

  @media (min-width: 768px) {
    display: none;
  }
`;

// Information section of the current chat in the header
const CurrentChatInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
`;

// Avatar of the current chat hospital
const CurrentChatAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

// Details section of the current chat
const CurrentChatDetails = styled.div`
  margin-left: 16px;
`;

// Name of the current chat hospital
const CurrentChatName = styled.h2`
  font-size: 14px;
  font-weight: 600;
`;

// Status of the current chat hospital
const CurrentChatStatus = styled.p`
  color: #38a169;
  font-size: 12px;
`;

// Container for displaying messages
const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f7fafc;
`;

// Wrapper for individual messages
const MessageWrapper = styled.div<{ isSender: boolean }>`
  display: flex;
  justify-content: ${({ isSender }) => (isSender ? "flex-end" : "flex-start")};
  margin-bottom: 16px;
`;

// Content of the message
const MessageContent = styled.div<{ isSender: boolean }>`
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${({ isSender }) => (isSender ? "#4299e1" : "#edf2f7")};
  color: ${({ isSender }) => (isSender ? "#ffffff" : "#2d3748")};
`;

// Input section for sending messages
const InputSection = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  @media (min-width: 768px) {
    width: 67%;
    max-width: calc(100% - 300px);
  }
`;

// Input for file attachments
const FileInput = styled.input`
  display: none;
`;

// Label for the file input
const FileLabel = styled.label`
  cursor: pointer;
  margin-right: 16px;
  color: #a0aec0;
`;

// Display for the selected file name
const SelectedFileName = styled.span`
  margin-right: 16px;
  color: #a0aec0;
`;

// Input for typing messages
const TextInput = styled.input`
  flex: 1;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  }
`;

// Send button for messages
const SendButton = styled.button`
  background-color: #4299e1;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Chat component
const Chat: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<Hospital | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { chatHistory, activeChats } = useSelector((state: RootState) => state.chat);
  const { hospital: currentAdmin } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  // Load messages when the component mounts and listen for new messages
  useEffect(() => {
    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("loadMessages");
      socket.off("message");
    };
  }, []);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() && currentChat) {
      const message: Message = {
        sender: currentAdmin,
        to: currentChat,
        content: newMessage,
        date: new Date().toLocaleTimeString(),
        type: "text",
      };
      socket.emit("sendMessage", {
        roomId: `${currentAdmin.$id}_${currentChat.$id}`,
        message,
      });
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    }
  };

  // Handle file attachment selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle initiating a call
  const handleCall = () => {
    if (currentChat) {
      window.location.href = "tel:" + currentChat.phone;
    }
  };

  // Open a chat with a specific hospital
  const openChat = (hospital: Hospital) => {
    setCurrentChat(hospital);
    socket.emit("join", {
      roomId: `${currentAdmin.$id}_${hospital.$id}`,
    });
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Fetch active chats when the component mounts
  useEffect(() => {
    dispatch<any>(getActiveChats('tok'));
  }, [dispatch]);

  return (
    <Container>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserAvatar src="url/to/profile/image" alt="User" />
            <UserInfo>
              <UserName>Pedrik Ronner</UserName>
              <UserStatus>Active now</UserStatus>
            </UserInfo>
          </div>
          <CloseButton onClick={() => setIsSidebarOpen(false)}>
            <X />
          </CloseButton>
        </SidebarHeader>
        {activeChats?.length > 0 ? (
          <>
            <ChatsTitle>Recent Chats</ChatsTitle>
            <ChatList>
              {activeChats?.map((hospital: Hospital) => (
                <ChatItem key={hospital.$id} onClick={() => openChat(hospital)}>
                  <ChatAvatar src={hospital.avatar} alt={hospital.hospitalName} />
                  <ChatInfo>
                    <ChatName>{hospital.hospitalName}</ChatName>
                    <ChatStatus>{hospital.status}</ChatStatus>
                  </ChatInfo>
                </ChatItem>
              ))}
            </ChatList>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: 'grey' }}>No active chats</p>
        )}
      </Sidebar>
      <MainContent>
        <Header>
          <OpenSidebarButton onClick={() => setIsSidebarOpen(true)}>
            <Menu />
          </OpenSidebarButton>
          {currentChat && (
            <CurrentChatInfo>
              <CurrentChatAvatar src={currentChat.avatar} />
              <CurrentChatDetails>
                <CurrentChatName>{currentChat.hospitalName}</CurrentChatName>
                <CurrentChatStatus>Active now</CurrentChatStatus>
              </CurrentChatDetails>
              <Phone size={18} className="icon" onClick={handleCall} />
            </CurrentChatInfo>
          )}
        </Header>
        <MessagesContainer>
          {messages.length > 0 ? (
            messages.map((msg: Message, index) => (
              <MessageWrapper key={index} isSender={msg.sender.$id === currentAdmin.$id}>
                <MessageContent isSender={msg.sender.$id === currentAdmin.$id}>
                  {msg.type === "text" ? (
                    <p>{msg.content}</p>
                  ) : (
                    <img src={msg.content} alt="Attachment" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '10px' }} />
                  )}
                </MessageContent>
              </MessageWrapper>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: 'grey' }}>No messages yet.</div>
          )}
        </MessagesContainer>
        <InputSection>
          <FileInput type="file" id="fileInput" onChange={handleFileChange} />
          <FileLabel htmlFor="fileInput">
            <File />
          </FileLabel>
          {selectedFile && <SelectedFileName>{selectedFile.name}</SelectedFileName>}
          <TextInput
            type="text"
            placeholder="Type something..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <SendButton onClick={handleSendMessage}>
            <Send />
          </SendButton>
        </InputSection>
      </MainContent>
    </Container>
  );
};

export default Chat;
