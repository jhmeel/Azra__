import React, { useState, useEffect } from "react";
import { Send, File, Phone, Menu, X } from "lucide-react";
import { Hospital } from "../types";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { getActiveChats } from "../actions";
import styled from "styled-components";

interface Message {
  sender: Hospital;
  to: Hospital;
  date: string;
  type: string;
  content: string;
}

const socket = io("http://localhost:8000");

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7fafc;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

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

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  margin-left: 16px;
`;

const UserName = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

const UserStatus = styled.p`
  color: #38a169;
`;

const CloseButton = styled.button`
  display: block;
  background: none;
  border: none;

  @media (min-width: 768px) {
    display: none;
  }
`;

const ChatsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ChatList = styled.ul``;

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

const ChatAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ChatInfo = styled.div`
  margin-left: 16px;
`;

const ChatName = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const ChatStatus = styled.p`
  font-size: 12px;
  color: #a0aec0;
`;

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

const OpenSidebarButton = styled.button`
  background: none;
  border: none;

  @media (min-width: 768px) {
    display: none;
  }
`;

const CurrentChatInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
`;

const CurrentChatAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

const CurrentChatDetails = styled.div`
  margin-left: 16px;
`;

const CurrentChatName = styled.h2`
  font-size: 14px;
  font-weight: 600;
`;

const CurrentChatStatus = styled.p`
  color: #38a169;
  font-size: 12px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f7fafc;
`;

const MessageWrapper = styled.div<{ isSender: boolean }>`
  display: flex;
  justify-content: ${({ isSender }) => (isSender ? "flex-end" : "flex-start")};
  margin-bottom: 16px;
`;

const MessageContent = styled.div<{ isSender: boolean }>`
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${({ isSender }) => (isSender ? "#4299e1" : "#edf2f7")};
  color: ${({ isSender }) => (isSender ? "#ffffff" : "#2d3748")};
`;

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

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  cursor: pointer;
  margin-right: 16px;
  color: #a0aec0;
`;

const SelectedFileName = styled.span`
  margin-right: 16px;
  color: #a0aec0;
`;

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

const Chat: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<Hospital | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { chatHistory, activeChats } = useSelector((state: RootState) => state.chat);
  const { hospital: currentAdmin } = useSelector((state: RootState) => state.chat);

  const dispatch = useDispatch();

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleCall = () => {
    if (currentChat) {
      window.location.href = "tel:" + currentChat.phone;
    }
  };

  const openChat = (hospital: Hospital) => {
    setCurrentChat(hospital);
    socket.emit("join", {
      roomId: `${currentAdmin.$id}_${hospital.$id}`,
    });
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

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
        <ChatsTitle>Recent Chats</ChatsTitle>
        <ChatList>
          {activeChats?.length > 0 &&
            activeChats?.map((hospital: Hospital) => (
              <ChatItem key={hospital.$id} onClick={() => openChat(hospital)}>
                <ChatAvatar src={hospital.avatar} alt={hospital.hospitalName} />
                <ChatInfo>
                  <ChatName>{hospital.hospitalName}</ChatName>
                  <ChatStatus>{hospital.status}</ChatStatus>
                </ChatInfo>
              </ChatItem>
            ))}
        </ChatList>
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
                    <img src={msg.content} alt="Attachment" style={{width:32, height:32, objectFit:'cover', borderRadius:'10px'}} />
                  )}
                </MessageContent>
              </MessageWrapper>
            ))
          ) : (
            <div style={{textAlign:'center', color:'grey'}}>No messages yet.</div>
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
