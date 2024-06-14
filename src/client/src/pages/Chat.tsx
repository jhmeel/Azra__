/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Send, File, Phone, Menu, X } from "lucide-react";
import { Hospital } from "../types";
import io from "socket.io-client";
import { useSelector,useDispatch  } from "react-redux";
import { RootState } from "../store";
import axiosInstance from "../utils/axiosInstance";
import { getActiveChats } from "../actions";


interface Message {
  sender: Hospital;
  to: Hospital;
  date: string;
  type: string;
  content: string;
}

const socket = io("http://localhost:8000");

const Chat: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<Hospital | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const { chatHistory, activeChats }  = useSelector(
    (state: RootState) => state.chat
  );
  const { hospital:currentAdmin}  = useSelector(
    (state: RootState) => state.chat
  );

  const dispatch = useDispatch()
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
  }, []);





  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <div
        className={`w-full md:w-1/3 lg:w-1/4 bg-white shadow-lg p-4 fixed md:relative ${
          isSidebarOpen ? "block" : "hidden"
        } md:block z-10 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              className="w-12 h-12 rounded-full"
              src="url/to/profile/image"
              alt="User"
            />
            <div className="ml-4">
              <h2 className="text-xl font-semibold">Pedrik Ronner</h2>
              <p className="text-green-500">Active now</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X className="text-gray-600" />
          </button>
        </div>
        <h3 className="text-lg font-semibold mb-4">Recent Chats</h3>
        <ul>
          {activeChats?.length > 0 &&
            activeChats?.map((hospital: Hospital) => (
              <li
                key={hospital.$id}
                className="flex items-center mb-4 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
                onClick={() => openChat(hospital)}
              >
                <img className="w-10 h-10 rounded-full" src={hospital.avatar} alt={hospital.hospitalName} />
                <div className="ml-4">
                  <p className="text-sm font-semibold">{hospital.hospitalName}</p>
                  <p className="text-xs text-gray-500">{hospital.status}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col md:ml-0 ml-auto relative">
        <div className="flex items-center p-4 bg-white shadow-lg justify-between md:justify-start">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <Menu className="text-gray-600" />
          </button>
          {currentChat && (
            <div className="flex items-center md:ml-4">
              <img
                className="w-12 h-12 rounded-full"
                src={currentChat.avatar}
              />
              <div className="ml-4">
                <h2 className="text-14 font-semibold">{currentChat.hospitalName}</h2>
                <p className="text-green-500 text-12">Active now</p>
              </div>
              <Phone
              size={18}
                className="text-gray-500 ml-auto md:ml-4 cursor-pointer"
                onClick={handleCall}
              />
            </div>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.length > 0 ? (
            messages.map((msg: Message, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender.$id === currentAdmin.$id
                    ? "justify-end"
                    : "justify-start"
                } mb-4`}
              >
                <div
                  className={`p-3 rounded-lg shadow ${
                    msg.sender.$id === currentAdmin.$id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.type === "text" ? (
                    <p>{msg.content}</p>
                  ) : (
                    <img
                      src={msg.content}
                      alt="Attachment"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No messages yet.</div>
          )}
        </div>
        <div className="p-4 bg-white flex items-center border-t fixed bottom-0 left-0 w-full md:w-2/3 lg:w-3/4">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <File className="text-gray-500 mr-4" />
          </label>
          {selectedFile && (
            <span className="text-gray-500 mr-4">{selectedFile.name}</span>
          )}
          <input
            type="text"
            placeholder="Type something..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-lg ml-2 flex items-center justify-center"
            onClick={handleSendMessage}
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
