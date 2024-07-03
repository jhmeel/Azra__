import React, { useState } from "react";
import styled from "styled-components";
import MessageContainer from "../components/MessageContainer";
import Sidebar from "../components/Sidebar";
import { IoMenu } from "react-icons/io5";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const StyledSidebar = styled(Sidebar)`
  flex: none;
  width: 100%;
  height: 30vh;
  border-bottom: 1px solid #e0e0e0;

  @media (min-width: 768px) {
    width: 300px;
    height: 100vh;
    border-right: 1px solid #e0e0e0;
    border-bottom: none;
  }
`;

const StyledMessageContainer = styled(MessageContainer)`
  flex: 1;
  height: 70vh;
  overflow-y: auto;

  @media (min-width: 768px) {
    height: 100vh;
  }
`;

const HamburgerButton = styled.button`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: none;
  border: none;
  color: #1e293b;
  cursor: pointer;
  display: block;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Chat: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ChatContainer>
      <HamburgerButton onClick={toggleSidebar}>
        <IoMenu size={24} />
      </HamburgerButton>
      <StyledSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <StyledMessageContainer />
    </ChatContainer>
  );
};

export default Chat;