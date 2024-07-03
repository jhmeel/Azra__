import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Send,
  Phone,
  Hospital as HospitalIcon,
  Trash2,
  Edit2,
  Copy,
  Share2,
  Check,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  getHPChatHistory,
  hpDeleteMessage,
  clearErrors,
  hpSendMessage,
} from "../actions";
import { RootState } from "../store";
import { BiSolidImageAdd } from "react-icons/bi";
import { BsX } from "react-icons/bs";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 768px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: linear-gradient(to right, #4fd1c5, #38b2ac);
  color: white;
`;

const HospitalInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusDot = styled.span<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#4caf50" : "#bdbdbd")};
`;

const CallButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #e5ded8;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div<{ sent: boolean }>`
  max-width: 70%;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  position: relative;
  word-wrap: break-word;
  ${(props) =>
    props.sent
      ? `
    background-color: #dcf8c6;
    align-self: flex-end;
  `
      : `
    background-color: white;
    align-self: flex-start;
  `}

  @media (max-width: 480px) {
    max-width: 85%;
  }
`;

const MessageText = styled.p`
  margin: 0;
`;

const MessageImage = styled.img`
  max-width: 100%;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
`;

const MessageMeta = styled.div`
  font-size: 0.75rem;
  color: #888;
  text-align: right;
`;

const InputArea = styled.form`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f0f0f0;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 1.5rem;
  margin-right: 0.5rem;
  outline: none;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SendButton = styled(IconButton)`
  background-color: #4fd1c5;
  border-radius: 50%;
`;

const ContextMenu = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const ContextMenuItem = styled.button`
  display: flex;
  align-items: flex-start;
  gap:5px;
  padding: 0.5rem 1rem;
  border: none;
  font-size:12px;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const PingBanner = styled.div`
  background-color: #e1f5fe;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;
const SelectedImagePreview = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e53e3e;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const PatientChatInterface = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageId: null,
  });
  const [editingMessage, setEditingMessage] = useState(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const { hospital: selectedHospital } = location.state || {};
  const { user, role, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const { chatHistory, loading, error } = useSelector(
    (state: RootState) => state.chat
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }
    if (selectedHospital) {
      dispatch<any>(getHPChatHistory(accessToken, selectedHospital._id, role));
    }
  }, [selectedHospital, dispatch, accessToken, error]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage && !image) return;

    const messageData: { message?: string; image?: string } = {};
    if (inputMessage) messageData.message = inputMessage;
    if (image) messageData.image = image;

    dispatch<any>(
      hpSendMessage(accessToken, selectedHospital._id, messageData, role)
    );
    setInputMessage("");
    setImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setContextMenu({ visible: true, x, y, messageId });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
      setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
    }
  };

  const handleEditMessage = () => {
    const message = chatHistory.messages.find(
      (m) => m._id === contextMenu.messageId
    );
    setEditingMessage(message);
    setInputMessage(message.content);
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleDeleteMessage = () => {
    dispatch<any>(
      hpDeleteMessage(accessToken, selectedHospital?._id, contextMenu?.messageId, role)
    );
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleCopyMessage = () => {
    const message = chatHistory.messages.find(
      (m) => m?._id === contextMenu?.messageId
    );
    navigator.clipboard.writeText(message.content);
    toast.success("Message copied to clipboard");
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleShareMessage = () => {
    toast.info("Share functionality not implemented");
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const renderPing = (ping: any) => (
    <PingBanner>
      <p>Complaint: {ping?.complaint}</p>
      <p>Severity: {ping?.severity}</p>
      {ping?.image && (
        <img
          src={ping?.image.secureUrl}
          alt="Ping"
          style={{ maxWidth: "100%" }}
        />
      )}
    </PingBanner>
  );

  return (
    <Container>
      <Header>
        <HospitalInfo>
          <HospitalIcon size={24} />
          <h2>{selectedHospital.hospitalName}</h2>
          <StatusDot active={selectedHospital.isActive} />
        </HospitalInfo>
        <CallButton
          onClick={() =>
            (window.location.href = `tel:${selectedHospital.phone}`)
          }
        >
          <Phone size={24} />
        </CallButton>
      </Header>

      <ChatArea ref={chatAreaRef}>
        {chatHistory.ping &&
          chatHistory.ping.length > 0 &&
          renderPing(chatHistory.ping[0])}
        {chatHistory.messages &&
          chatHistory.messages.map((message: any) => (
            <MessageBubble
              key={message._id}
              sent={message.senderId === user._id}
              onContextMenu={(e) => handleContextMenu(e, message._id)}
            >
              <MessageText>{message.message}</MessageText>
              {message.image && (
                <MessageImage src={message?.image} alt="Sent" />
              )}
              <MessageMeta>
                {new Date(message.createdAt).toLocaleTimeString()}
                {message.senderId === user._id &&
                  (message?.isRead ? (
                    <CheckCheck size={16} />
                  ) : (
                    <Check size={16} />
                  ))}
              </MessageMeta>
              {contextMenu.visible && contextMenu.messageId === message._id && (
                <ContextMenu
                  ref={contextMenuRef}
                  style={{
                    top: `${contextMenu.y+30}px`,
                    left: `${contextMenu.x-30}px`,
                  }}
                >
                  <ContextMenuItem onClick={handleEditMessage}>
                    <Edit2 size={18} /> Edit
                  </ContextMenuItem>
                  <ContextMenuItem onClick={handleDeleteMessage}>
                    <Trash2 size={18} /> Delete
                  </ContextMenuItem>
                  <ContextMenuItem onClick={handleCopyMessage}>
                    <Copy size={18} /> Copy
                  </ContextMenuItem>
                  <ContextMenuItem onClick={handleShareMessage}>
                    <Share2 size={18} /> Share
                  </ContextMenuItem>
                </ContextMenu>
              )}
            </MessageBubble>
          ))}
      </ChatArea>

      <InputArea onSubmit={handleSendMessage}>
      
        <TextInput
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
        />
         {image ? (
              <SelectedImagePreview>
                <img
                  src={image}
                  alt="Selected"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <RemoveImageButton onClick={() => setImage(null)}>
                  <BsX size={12} color="#fff" />
                </RemoveImageButton>
              </SelectedImagePreview>
            ) : (
              <>
               <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <IconButton type="button" onClick={() => fileInputRef.current?.click()}>
            <BiSolidImageAdd color="#0c2d3b" size={24}/>
            </IconButton>
              </>
             
            )}
       


        <SendButton type="submit">
          <Send color="#d3eef9" size={24} />
        </SendButton>
      </InputArea>
    </Container>
  );
};

export default PatientChatInterface;