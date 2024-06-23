import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import {
  Client,
  Account,
  Databases,
  ID,
  Storage,
  Query,
  Role,
  Permission,
} from "appwrite";
import Config from "../Config";
import { Hospital as THospital, Message as TMessage } from "../types";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Menu, Phone, SendIcon, UploadIcon, X } from "lucide-react";
import azraLight from "../assets/azra_light.png";
const {
  DATABASE_ID,
  HOSPITAL_COLLECTION_ID,
  BUCKET_ID,
  HOSPIAL_MESSAGES_COLLECTION_ID,
} = Config.APPWRITE;
const { MESSAGES_PER_PAGE } = Config;
const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID);

const database = new Databases(client);
const storage = new Storage(client);

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  position: fixed;
  z-index: 10;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-100%)"};

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

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const MessageInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 9px 12px;
  border: none;
  border-radius: 21px;
  background-color: white;
  font-size: 15px;
  outline: none;
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

const MediaUploadButton = styled.label`
  cursor: pointer;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  margin-left: 8px;
  color: #848484;
`;

const HospitalItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MessageItem = styled.div<{ isSent: boolean }>`
  max-width: 70%;
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  background-color: ${(props) => (props.isSent ? "#dcf8c6" : "#fff")};
  align-self: ${(props) => (props.isSent ? "flex-end" : "flex-start")};
  position: relative;
`;

const MessageMedia = styled.div`
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
  overflow: hidden;
`;

const MessageActions = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: none;
  ${MessageItem}:hover & {
    display: block;
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 10px;
`;

const TypingIndicator = styled.div`
  font-style: italic;
  padding: 5px;
  color: #888;
`;
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
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
    display: none;
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

const Chat = () => {
  const [hospitals, sethospitals] = useState<THospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<THospital | null>(
    null
  );
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const permissions = [Permission.write(Role.user(currentUser?.$id))];

  useEffect(() => {
    if (currentUser) {
      fetchhospitals();
      subscribeToMessages();
      subscribeTohospitalstatus();
    }
  }, [currentUser]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchhospitals = async () => {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        HOSPITAL_COLLECTION_ID
      );
      sethospitals(response.documents as THospital[]);
    } catch (error: any) {
      toast.error("Fetching hospitals failed:", error.message);
      setError("Failed to fetch hospitals. Please try again.");
    }
  };

  const subscribeToMessages = () => {
    const unsubscribe = client.subscribe(
      [
        `databases.${DATABASE_ID}.collections.${HOSPIAL_MESSAGES_COLLECTION_ID}.documents`,
      ],
      (response: any) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          const newMessage = response.payload as TMessage;
          if (
            newMessage.senderId === currentUser?.$id ||
            newMessage.receiverId === currentUser?.$id
          ) {
            setMessages((prev) => [...prev, newMessage]);
            markMessageAsRead(newMessage.$id);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  };

  const subscribeTohospitalstatus = () => {
    const unsubscribe = client.subscribe(
      [
        `databases.${DATABASE_ID}.collections.${HOSPITAL_COLLECTION_ID}.documents`,
      ],
      (response: any) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          const updatedUser = response.payload as THospital;
          sethospitals((prev) =>
            prev.map((user) =>
              user.$id === updatedUser.$id ? updatedUser : user
            )
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  };

  const setHospital = (h: THospital) => {
    setSelectedHospital(h);
    fetchChatHistory(h.$id);
    setHasMoreMessages(true);
  };

  const fetchChatHistory = async (userId: string, lastId?: string) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const queries = [
        Query.equal("senderId", [currentUser.$id, userId]),
        Query.equal("receiverId", [currentUser.$id, userId]),
        Query.orderDesc("$createdAt"),
        Query.limit(MESSAGES_PER_PAGE),
      ];

      if (lastId) {
        queries.push(Query.cursorAfter(lastId));
      }

      const response = await database.listDocuments(
        DATABASE_ID,
        HOSPIAL_MESSAGES_COLLECTION_ID,
        queries
      );

      const newMessages = response.documents as TMessage[];
      setMessages((prev) => [...newMessages.reverse(), ...prev]);
      setHasMoreMessages(newMessages.length === MESSAGES_PER_PAGE);

      newMessages.forEach((message) => {
        if (message.senderId !== currentUser.$id && !message.isRead) {
          markMessageAsRead(message.$id);
        }
      });
    } catch (error) {
      console.error("Fetching chat history failed:", error);
      setError("Failed to fetch chat history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    type: TMessage["type"],
    content: string,
    mediaUrl?: string
  ) => {
    if (!currentUser || !selectedHospital) return;

    try {
      setSending(true);
      const message: Omit<TMessage, "$id" | "$createdAt" | "$updatedAt"> = {
        senderId: currentUser.$id,
        receiverId: selectedHospital.$id,
        content,
        timestamp: new Date().toISOString(),
        type,
        mediaUrl,
        isEdited: false,
        isRead: false,
      };

      await database.createDocument(
        DATABASE_ID,
        HOSPIAL_MESSAGES_COLLECTION_ID,
        ID.unique(),
        message,
        permissions
      );
      setNewMessage("");
    } catch (error: any) {
      toast.error("Sending message failed:", error.message);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage("text", newMessage.trim());
    }
  };

  const handleMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const upload = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const mediaUrl = storage.getFileView(BUCKET_ID, upload.$id);
      const fileType = file.type.split("/")[0] as
        | "image"
        | "video"
        | "document";
      await sendMessage(fileType, file.name, mediaUrl.href);
    } catch (error: any) {
      toast.error("Media upload failed:", error.message);
      setError("Failed to upload media. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await database.deleteDocument(
        DATABASE_ID,
        HOSPIAL_MESSAGES_COLLECTION_ID,
        messageId
      );
      setMessages((prev) =>
        prev.filter((message) => message.$id !== messageId)
      );
    } catch (error: any) {
      toast.error("Deleting message failed:", error.message);
      setError("Failed to delete message. Please try again.");
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    try {
      await database.updateDocument(
        DATABASE_ID,
        HOSPIAL_MESSAGES_COLLECTION_ID,
        messageId,
        {
          content: newContent,
          isEdited: true,
        }
      );
      setMessages((prev) =>
        prev.map((message) =>
          message.$id === messageId
            ? { ...message, content: newContent, isEdited: true }
            : message
        )
      );
    } catch (error) {
      console.error("Editing message failed:", error);
      setError("Failed to edit message. Please try again.");
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await database.updateDocument(
        DATABASE_ID,
        HOSPIAL_MESSAGES_COLLECTION_ID,
        messageId,
        {
          isRead: true,
        }
      );
    } catch (error: any) {
      toast.error("Marking message as read failed:", error.message);
    }
  };

  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, [isTyping]);

  const loadMoreMessages = () => {
    if (selectedHospital && messages.length > 0) {
      fetchChatHistory(selectedHospital.$id, messages[0].$id);
    }
  };

  if (loading) {
    return <LoadingIndicator>Loading...</LoadingIndicator>;
  }
  const handleCall = () => {
    if (currentUser) {
      window.location.href = "tel:" + currentUser?.phone;
    }
  };

  return (
    <Container>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserAvatar src={currentUser?.avatar} alt="User" />
            <UserInfo>
              <UserName>{currentUser?.hospitalName}</UserName>
              <UserStatus>Active now</UserStatus>
            </UserInfo>
          </div>
          <CloseButton onClick={() => setIsSidebarOpen(false)}>
            <X />
          </CloseButton>
        </SidebarHeader>
        {hospitals?.length > 0 ? (
          <>
            <ChatsTitle>Active Chats</ChatsTitle>
            <ChatList>
              {hospitals?.map((hospital: THospital) => (
                <ChatItem
                  key={hospital.$id}
                  onClick={() => setHospital(hospital)}
                >
                  <ChatAvatar
                    src={hospital.avatar}
                    alt={hospital.hospitalName}
                  />
                  <ChatInfo>
                    <ChatName>{hospital.hospitalName}</ChatName>
                    <ChatStatus>{hospital.status}</ChatStatus>
                  </ChatInfo>
                </ChatItem>
              ))}
            </ChatList>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "grey" }}>No active chats</p>
        )}
      </Sidebar>

      <MainContent>
        <Header>
          <OpenSidebarButton onClick={() => setIsSidebarOpen(true)}>
            <Menu />
          </OpenSidebarButton>
          {currentUser && (
            <CurrentChatInfo>
              <CurrentChatAvatar src={currentUser.avatar} />
              <CurrentChatDetails>
                <CurrentChatName>{currentUser.hospitalName}</CurrentChatName>
                <CurrentChatStatus>Active now</CurrentChatStatus>
              </CurrentChatDetails>
              <Phone size={18} className="icon" onClick={handleCall} />
            </CurrentChatInfo>
          )}
        </Header>
        {selectedHospital ? (
          <>
            <h2>Chat with {selectedHospital?.hospitalName}</h2>
            <MessageList ref={messageListRef}>
              {hasMoreMessages && (
                <button onClick={loadMoreMessages}>Load more messages</button>
              )}
              {messages.map((message) => (
                <MessageItem
                  key={message.$id}
                  isSent={message.senderId === currentUser.$id}
                >
                  {message.type === "text" && message.content}
                  {message.type === "image" && (
                    <MessageMedia>
                      <img
                        src={message.mediaUrl}
                        alt={message.content}
                        style={{ maxWidth: "100%" }}
                      />
                    </MessageMedia>
                  )}
                  {message.type === "video" && (
                    <MessageMedia>
                      <video
                        src={message.mediaUrl}
                        controls
                        style={{ maxWidth: "100%" }}
                      />
                    </MessageMedia>
                  )}
                  {message.type === "document" && (
                    <a
                      href={message.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {message.content}
                    </a>
                  )}
                  {message.isEdited && (
                    <span style={{ fontSize: "0.8em", color: "#888" }}>
                      {" "}
                      (edited)
                    </span>
                  )}
                  {message.isRead && message.senderId === currentUser.$id && (
                    <span style={{ fontSize: "0.8em", color: "#888" }}>
                      {" "}
                      ✓✓
                    </span>
                  )}
                  <MessageActions>
                    <button onClick={() => deleteMessage(message.$id)}>
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        const newContent = prompt(
                          "Edit message:",
                          message.content
                        );
                        if (newContent && newContent !== message.content) {
                          editMessage(message.$id, newContent);
                        }
                      }}
                    >
                      Edit
                    </button>
                  </MessageActions>
                </MessageItem>
              ))}
            </MessageList>
            {isTyping && (
              <TypingIndicator>
                {selectedHospital?.hospitalName} is typing...
              </TypingIndicator>
            )}
            <MessageInputContainer>
              <MessageInput
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                disabled={sending || uploading}
              />
              <MediaUploadButton>
                <UploadIcon size={16} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaUpload}
                  accept="image/*,video/*,application/pdf"
                  style={{ display: "none" }}
                  disabled={sending || uploading}
                />
              </MediaUploadButton>
              <SendButton
                onClick={handleSendMessage}
                disabled={sending || uploading}
              >
                <SendIcon size={20} />
              </SendButton>
            </MessageInputContainer>
          </>
        ) : (
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img width={168.9999} src={azraLight} />
          </div>
        )}
      </MainContent>
    </Container>
  );
};

export default Chat;
