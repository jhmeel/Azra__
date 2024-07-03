import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { LoaderCircle, X } from "lucide-react";
import { useSocketContext } from "../socketContext.js";
import { toast } from "sonner";
import { RootState } from "../store.js";
import {
  clearErrors,
  getActiveChats,
  setSelectedChat,
} from "../actions/index.js";
import { useSelector, useDispatch } from "react-redux";
import { Hospital } from "../types/index.js";
import { getAcronym } from "../utils/formatter.js";

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  background:rgba(13, 70, 66,0.9);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    max-width: 300px;
    z-index: 1000;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease-in-out;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  border: 2px solid #40bdb5;
`;

const UserName = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #e2e8f0;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #40bdb5;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 0.75rem;
  border: 2px solid #4a5568;
  border-radius: 6px;
  background-color: #2d3748;
  color: #e2e8f0;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #40bdb5;
  }
`;

const SearchButton = styled.button`
  background: #40bdb5;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 6px;
  margin-left: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: #35a39c;
  }
`;

const AvailableChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
  gap: 1rem;
`;

const ConversationItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  background-color: ${(props) =>
    props.isSelected ? "rgba(64, 189, 181, 0.2)" : "transparent"};
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(64, 189, 181, 0.1);
    transform: translateX(5px);
  }
`;

const Avatar = styled.div<{ isOnline: boolean }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 2px solid ${(props) => (props.isOnline ? "#40bdb5" : "transparent")};
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 0.75rem;
    height: 0.75rem;
    background-color: ${(props) => (props.isOnline ? "#40bdb5" : "#6b7280")};
    border-radius: 50%;
    border: 2px solid #1a2533;
  }
`;

const ConversationInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const HospitalName = styled.p`
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
`;

const EmojiContainer = styled.span`
  font-size: 1.2rem;
  margin-top: 0.25rem;
`;

const SearchInputComponent: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const { activeChats } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }
    const chatFound = activeChats?.find((chat: Hospital) =>
      chat.hospitalName.toLowerCase().includes(search.toLowerCase())
    );
    if (chatFound) {
      dispatch<any>(setSelectedChat(chatFound));
      setSearch("");
    } else toast.error("No such user found!");
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <SearchInput
        type="text"
        placeholder="Search hospitals..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SearchButton type="submit">
        <IoSearchOutline size={20} />
      </SearchButton>
    </SearchForm>
  );
};

const AvailableChat: React.FC<{
  chat: Hospital;
  lastIdx: boolean;
  emoji: string;
}> = ({ chat, lastIdx, emoji }) => {
  const { onlineUsers } = useSocketContext();
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const isSelected = selectedChat?._id === chat?._id;
  const isOnline = onlineUsers.includes(chat?._id);
  const dispatch = useDispatch();

  const handleSelectedChat = () => {
    dispatch<any>(setSelectedChat(chat));
  };

  return (
    <ConversationItem isSelected={isSelected} onClick={handleSelectedChat}>
      <Avatar isOnline={isOnline}>
        <img src={chat.avatar} alt="Hospital Avatar" />
      </Avatar>
      <ConversationInfo>
        <HospitalName>{chat.hospitalName}</HospitalName>
        <EmojiContainer>{emoji}</EmojiContainer>
      </ConversationInfo>
    </ConversationItem>
  );
};

const Conversations: React.FC = () => {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const { loading, activeChats, error } = useSelector(
    (state: RootState) => state.chat
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }
    dispatch<any>(getActiveChats(accessToken));
  }, []);

  return (
    <AvailableChatContainer>
      {activeChats
        ?.filter((chat: Hospital) => chat._id !== user._id)
        .map((chat: Hospital, idx: number) => (
          <AvailableChat
            key={idx}
            chat={chat}
            emoji={''}
            lastIdx={idx === activeChats.length - 1}
          />
        ))}
      {loading && <LoaderCircle className="animate-spin" color="#40bdb5" />}
    </AvailableChatContainer>
  );
};

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <UserInfo>
          <UserAvatar src={user?.avatar} alt="User Avatar" />
          <UserName>{getAcronym(user?.hospitalName)}</UserName>
        </UserInfo>
        {isOpen && <CloseButton onClick={onClose}>
          <IoCloseOutline size={24} />
        </CloseButton>}
      </SidebarHeader>
      <SearchInputComponent />
      <Conversations />
    </SidebarContainer>
  );
};

export default Sidebar;