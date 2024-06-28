import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { UploadIcon, SendIcon, Trash2, Check, CheckCheck, Search } from 'lucide-react';
import { Hospital, Message, Patient, Ping } from '../types';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Client, Databases, Storage, Query, ID } from 'appwrite';
import Config from '../Config';

const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID);

const database = new Databases(client);
const storage = new Storage(client);

const Container = styled.div`
  height: 100vh;
  display: flex;
  background-color: #f0f2f5;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PingList = styled.div`
  width: 30%;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    height: 50%;
  }
`;

const SearchContainer = styled.div`
  padding: 10px;
  background-color: #f6f6f6;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  background-color: white;
  font-size: 15px;
`;

const PingScroll = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const PingItem = styled.div<{ isSelected: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#ebebeb' : 'white'};
  border-bottom: 1px solid #f2f2f2;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const PatientName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const PingPreview = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PingStatus = styled.span<{ isResolved: boolean }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  background-color: ${props => props.isResolved ? '#4caf50' : '#ff9800'};
  color: white;
  margin-top: 4px;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #e5ddd5;
  background-image: url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png');
  background-repeat: repeat;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: #075e54;
  color: white;
`;

const PatientInfo = styled.h2`
  margin: 0;
  font-size: 16px;
`;

const ResolveButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const MessageItem = styled.div<{ isHospital: boolean }>`
  display: flex;
  flex-direction: ${props => props.isHospital ? 'row-reverse' : 'row'};
  margin-bottom: 8px;
`;

const MessageContent = styled.div<{ isHospital: boolean }>`
  max-width: 65%;
  background-color: ${props => props.isHospital ? '#dcf8c6' : 'white'};
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
  flex: 1;
  padding: 9px 12px;
  border: none;
  border-radius: 21px;
  background-color: white;
  font-size: 15px;
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
  margin-left: 8px;
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #075e54;
  color: white;
  cursor: pointer;
  margin-left: 8px;
`;

function HospitalPingChatRoom() {
  const [pings, setPings] = useState<Ping[]>([]);
  const [filteredPings, setFilteredPings] = useState<Ping[]>([]);
  const [selectedPing, setSelectedPing] = useState<Ping | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authRes: currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (currentUser) {
      const unsubscribePings = subscribeToNewPings();
      fetchPings();

      return () => {
        unsubscribePings();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedPing) {
      const unsubscribeMessages = subscribeToMessages(selectedPing?.$id);
      fetchMessages(selectedPing?.$id);

      return () => {
        unsubscribeMessages();
      };
    }
  }, [selectedPing]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const filtered = pings.filter(ping => 
      ping?.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPings(filtered);
  }, [searchTerm, pings]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchPings = async () => {
    try {
      const response = await database.listDocuments(
        Config.APPWRITE.DATABASE_ID,
        Config.APPWRITE.PINGS_COLLECTION_ID,
        [Query.orderDesc('$createdAt')]
      );
      setPings(response.documents as Ping[]);
    } catch (error) {
      console.error('Error fetching pings:', error);
      toast.error('Failed to fetch pings. Please try again.');
    }
  };

  const subscribeToNewPings = () => {
    return client.subscribe(
      `databases.${Config.APPWRITE.DATABASE_ID}.collections.${Config.APPWRITE.PINGS_COLLECTION_ID}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const newPing = response.payload as Ping;
          setPings((prevPings) => [newPing, ...prevPings]);
        }
      }
    );
  };

  const fetchMessages = async (pingId: string) => {
    try {
      const response = await database.listDocuments(
        Config.APPWRITE.DATABASE_ID,
        Config.APPWRITE.PINGS_COLLECTION_ID,
        [
          Query.equal('pingId', pingId),
          Query.orderAsc('$createdAt'),
        ]
      );
      setMessages(response.documents as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages. Please try again.');
    }
  };

  const subscribeToMessages = (pingId: string) => {
    return client.subscribe(
      `databases.${Config.APPWRITE.DATABASE_ID}.collections.${Config.APPWRITE.PINGS_COLLECTION_ID}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const newMessage = response.payload as Message;
          if (newMessage.pingId === pingId) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      }
    );
  };

  const handleSelectPing = (ping: Ping) => {
    setSelectedPing(ping);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() || image) {
      try {
        let mediaUrl = '';
        if (image) {
          const uploadedFile = await storage.createFile(
            Config.APPWRITE.BUCKET_ID,
            ID.unique(),
            image
          );
          mediaUrl = storage.getFileView(Config.APPWRITE.BUCKET_ID, uploadedFile.$id).href;
        }

        const newMessage: Omit<Message, '$id' | '$createdAt' | '$updatedAt'> = {
          pingId: selectedPing!.$id,
          senderId: currentUser.$id,
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

        setInputMessage('');
        setImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message. Please try again.');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await database.deleteDocument(
        Config.APPWRITE.DATABASE_ID,
        Config.APPWRITE.PINGS_COLLECTION_ID,
        messageId
      );
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.$id !== messageId));
      toast.success('Message deleted successfully.');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message. Please try again.');
    }
  };

  const handleResolvePing = async () => {
    if (selectedPing) {
      try {
        await database.updateDocument(
          Config.APPWRITE.DATABASE_ID,
          Config.APPWRITE.PINGS_COLLECTION_ID,
          selectedPing?.$id,
          { isResolved: true }
        );
        setPings((prevPings) =>
          prevPings.map((ping) =>
            ping.$id === selectedPing.$id ? { ...ping, isResolved: true } : ping
          )
        );
        setSelectedPing({ ...selectedPing, isResolved: true });
        toast.success('Ping marked as resolved.');
      } catch (error) {
        console.error('Error resolving ping:', error);
        toast.error('Failed to resolve ping. Please try again.');
      }
    }
  };

  return (
    <Container>
      <PingList>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search patients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <PingScroll>
          {filteredPings.map((ping) => (
            <PingItem
              key={ping.$id}
              onClick={() => handleSelectPing(ping)}
              isSelected={selectedPing?.$id === ping.$id}
            >
              <PatientName>{ping.patientName}</PatientName>
              <PingPreview>{ping.lastMessage}</PingPreview>
              <PingStatus isResolved={ping.isResolved}>
                {ping.isResolved ? 'Resolved' : 'Active'}
              </PingStatus>
            </PingItem>
          ))}
        </PingScroll>
      </PingList>
      {selectedPing && (
        <ChatContainer>
          <ChatHeader>
            <PatientInfo>{selectedPing.patientName}</PatientInfo>
            <ResolveButton onClick={handleResolvePing} disabled={selectedPing.isResolved}>
              {selectedPing.isResolved ? 'Resolved' : 'Mark as Resolved'}
            </ResolveButton>
          </ChatHeader>
          <MessagesContainer>
            {messages.map((message) => (
              <MessageItem key={message.$id} isHospital={message.senderId === currentUser.$id}>
                <MessageContent isHospital={message.senderId === currentUser.$id}>
                  <MessageText>{message.content}</MessageText>
                  {message.mediaUrl && <MessageImage src={message.mediaUrl} alt="Attached media" />}
                  <MessageMeta>
                    {new Date(message.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.senderId === currentUser.$id && (
                      <>
                        {message.isRead ? <CheckCheck size={16} /> : <Check size={16} />}
                        <DeleteButton onClick={() => handleDeleteMessage(message.$id)}>
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
          <InputContainer onSubmit={handleSendMessage}>
            <TextInput
              type="text"
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
            <FileLabel htmlFor="image">
              <UploadIcon size={24} />
            </FileLabel>
            <SendButton type="submit">
              <SendIcon size={24} />
            </SendButton>
          </InputContainer>
        </ChatContainer>
      )}
    </Container>
  );
}

export default HospitalPingChatRoom;