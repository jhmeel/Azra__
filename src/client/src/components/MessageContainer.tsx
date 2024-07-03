import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsSend, BsCheck2All, BsTrash, BsX, BsCopy } from "react-icons/bs";
import styled from "styled-components";
import { extractTime } from "../utils/formatter.js";
import { RootState } from "../store.js";
import useListenMessages from "../hooks/useListenMessage.js";
import {
  setSelectedChat,
  getHospitalChatHistory,
  sendMessage,
  clearErrors,
  deleteMessage,
} from "../actions";
import { toast } from "sonner";
import { Message as TMessage } from "../types/index.js";
import azraLight from "../assets/azra_light.png";
import { Image as ImageIcon } from "lucide-react";
import { SEND_MESSAGE_RESET } from "../constants/index.js";
import { BiSolidImageAdd } from "react-icons/bi";
const Container = styled.div`
  min-width: 450px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f0f4f8;
`;

const HChatHeader = styled.div`
  background-color: #40bdb5;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  span {
    color: #ffffff;
    font-weight: 600;
    font-size: 1.2rem;
  }
`;

const ChatContainer = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.form`
  padding: 1rem;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 25px;
  background-color: #f0f4f8;
  color: #333333;
  border: 1px solid #e0e0e0;
  outline: none;
  font-size: 1rem;

  &:focus {
    border-color: #40bdb5;
  }
`;

const SendButton = styled.button`
  background: #40bdb5;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  padding: 0.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #35a39c;
  }
`;

const MessageWrapper = styled.div<{ fromMe: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.fromMe ? "flex-end" : "flex-start")};
  margin-bottom: 0.75rem;
  position: relative;
`;

const MessageBubble = styled.div<{ fromMe: boolean }>`
  display: inline-block;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background-color: ${(props) => (props.fromMe ? "#40bdb5" : "#ffffff")};
  color: ${(props) => (props.fromMe ? "#ffffff" : "#333333")};
  max-width: 70%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;

  p {
    margin: 0;
    font-size: 1rem;
  }

  small {
    font-size: 0.75rem;
    color: ${(props) => (props.fromMe ? "#e0e0e0" : "#999999")};
    margin-top: 4px;
    display: block;
  }
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const ImageUploadButton = styled.label`
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  align-items: center;
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

const MessageOptionsModal = styled.div<{
  fromMe: boolean;
  position: { x: number; y: number };
}>`
  position: absolute;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
`;

const MessageOptionButton = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  font-size: 12px;

  &:hover {
    background-color: #f0f4f8;
  }

  svg {
    margin-right: 5px;
  }
`;

const MessageContainer: React.FC = () => {
  const { selectedChat, chatHistory, loading, error, message_sent_success } =
    useSelector((state: RootState) => state.chat);
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    messageId: string | null;
    position: { x: number; y: number };
  }>({
    messageId: null,
    position: { x: 0, y: 0 },
  });

  useListenMessages();

  useEffect(() => {
    if (selectedChat) {
      dispatch<any>(getHospitalChatHistory(accessToken, selectedChat._id));
    }
  }, [selectedChat]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }
    if (message_sent_success) {
      dispatch<any>({ type: SEND_MESSAGE_RESET });
    }
  }, [error, message_sent_success]);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message && !image) return;

    const formData = new FormData();
    if (message) formData.append("message", message);
    if (image) formData.append("image", image);

    dispatch<any>(sendMessage(accessToken, selectedChat._id, { message }));
    setMessage("");
    setImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleMessageRightClick = useCallback(
    (e: React.MouseEvent, messageId: string) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setContextMenu({
        messageId,
        position: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      });
    },
    []
  );

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message);
    toast.success("Message copied to clipboard");
    setContextMenu({ messageId: null, position: { x: 0, y: 0 } });
  };

  const handleDelete = (messageId: string) => {
    dispatch<any>(deleteMessage(accessToken, messageId));
    setContextMenu({ messageId: null, position: { x: 0, y: 0 } });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenu.messageId &&
        !(event.target as Element).closest(".message-options-modal")
      ) {
        setContextMenu({ messageId: null, position: { x: 0, y: 0 } });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  useEffect(() => {
    return () => dispatch(setSelectedChat(null));
  }, []);

  return (
    <Container>
      {!selectedChat ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <img width={200} src={azraLight} alt="Azra Light" />
          <p
            style={{ color: "#666666", marginTop: "1rem", fontSize: "1.1rem" }}
          >
            Select a chat to start messaging
          </p>
        </div>
      ) : (
        <>
          <HChatHeader>
            <span>{selectedChat.hospitalName}</span>
          </HChatHeader>
          <ChatContainer>
            {!loading &&
              chatHistory?.messages?.length > 0 &&
              chatHistory?.messages?.map((message: TMessage) => (
                <MessageWrapper
                  key={message._id}
                  ref={lastMessageRef}
                  fromMe={message.senderId === user._id}
                  onContextMenu={(e) => handleMessageRightClick(e, message._id)}
                >
                  <MessageBubble fromMe={message.senderId === user._id}>
                    {message?.image && (
                      <ImagePreview
                        src={message?.image}
                        alt="Message attachment"
                        onClick={() => setImagePreview(message?.image)}
                      />
                    )}
                    <p>{message.message}</p>
                    <small>
                     {new Date(message.createdAt).toLocaleTimeString()}
                      {message.senderId === user._id && <BsCheck2All />}
                    </small>
                  </MessageBubble>
                  {contextMenu.messageId === message._id && (
                    <MessageOptionsModal
                      className="message-options-modal"
                      fromMe={message.senderId === user._id}
                      position={contextMenu.position}
                    >
                      <MessageOptionButton
                        onClick={() => handleCopy(message.message)}
                      >
                        <BsCopy /> Copy
                      </MessageOptionButton>
                      <MessageOptionButton
                        onClick={() => handleDelete(message._id)}
                      >
                        <BsTrash /> Delete
                      </MessageOptionButton>
                    </MessageOptionsModal>
                  )}
                </MessageWrapper>
              ))}
            {loading && <MessageSkeleton />}
          </ChatContainer>
          <InputContainer onSubmit={handleSubmit}>
            {image ? (
              <SelectedImagePreview>
                <img
                  src={URL.createObjectURL(image)}
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
              <ImageUploadButton>
                <BiSolidImageAdd color="#40bdb5" size={24} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </ImageUploadButton>
            )}
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              autoFocus
              onChange={(e) => setMessage(e.target.value)}
            />
            <SendButton type="submit">
              <BsSend color="#ffffff" size={18} />
            </SendButton>
          </InputContainer>
        </>
      )}
    </Container>
  );
};

const MessageSkeleton: React.FC = () => {
  return (
    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          backgroundColor: "#e0e0e0",
        }}
      ></div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: "0.75rem",
            width: "80%",
            backgroundColor: "#e0e0e0",
            marginBottom: "0.5rem",
            borderRadius: "4px",
          }}
        ></div>
        <div
          style={{
            height: "0.75rem",
            width: "40%",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default MessageContainer;
