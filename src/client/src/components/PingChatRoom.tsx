import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import io from "socket.io-client";
import localforage from "localforage";
import Typewriter from "typewriter-effect";
import {
  UploadIcon,
  Phone,
  XIcon,
  Hospital as HospitalIcon,
  SendIcon,
} from "lucide-react";
import { Hospital, Ping } from "../types/index.js";
import { toast } from "sonner";

const socket = io("http://localhost:8000");

interface PingChatTabProps {
  selectedHospital: Hospital|null;
  pingDetails: Ping;
}

type Message = {
  sender: string;
  text: string;
  image?: string;
};

function PingChatTab({
  selectedHospital,
  pingDetails,
}: PingChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      const chatHistory = await localforage.getItem<Message[]>(
        `chat_${pingDetails.fullname}:${selectedHospital?.$id}`
      );
      if (chatHistory) {
        setMessages(chatHistory);
      }
      setMessages([
        {
          sender: `patient:${
            pingDetails.fullname
          }@${new Date().toLocaleTimeString()}`,
          text: `${pingDetails.fullname}\n${pingDetails.complaints}`,
          image: pingDetails.image,
        },
      ]);
    };

    loadChatHistory();

    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [selectedHospital?.$id, pingDetails]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localforage.setItem(
      `chat_${pingDetails.fullname}:${selectedHospital?.$id}`,
      messages
    );
  }, [messages, selectedHospital?.$id]);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result as string);
      }
    };

    e.target.files && reader.readAsDataURL(e.target.files[0]);
  };

  const handleRemoveImage = () => {
    setImage(undefined);
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim() || image) {
      const newMessage: Message = {
        sender: `patient:${
          pingDetails.fullname
        }@${new Date().toLocaleTimeString()}`,
        text: inputMessage,
        image,
      };
      toast.success(newMessage.image);
      socket.emit("sendMessage", {
        ...newMessage,
        hospitalId: selectedHospital?.$id,
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");
      setImage(undefined);
    }
  };

  const handleCall = () => {
    window.location.href = "tel:" + selectedHospital?.hospitalName;
  };

  return (
    <div className="fixed top-10 p-2 left-0 w-full h-full flex flex-col justify-center items-center bg-opacity-60 bg-gray-800">
      <div className="max-w-3xl w-full px-4 bg-white shadow-md rounded-md relative">
        <button
          onClick={()=>{}}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <XIcon size={20} />
        </button>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 p-4">
          <div className="flex items-center">
            <HospitalIcon size={40} className="text-blue-500 md:mr-2" />
            <h2 className="text-16 font-semibold">
              {selectedHospital?.hospitalName}
            </h2>
          </div>
          <button
            onClick={handleCall}
            className="text-blue-500 hover:text-blue-600 focus:outline-none"
          >
            <Phone
              className="border mt-10 p-2 rounded cursor-pointer bg-white shadow-sm"
              size={35}
            />
          </button>
        </div>
        <div className="text-center mb-4">
          <Typewriter
            options={{
              strings: `Welcome to ${selectedHospital?.hospitalName}! How can we assist you today?`,
              autoStart: true,
              loop: false,
            }}
          />
        </div>
        <div className="flex flex-col space-y-4 px-4 max-h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-md ${
                message.sender.startsWith("patient")
                  ? "self-end bg-blue-100"
                  : "self-start bg-gray-100"
              } max-w-xs break-words`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Uploaded"
                  className="w-full h-auto"
                />
              )}
              <div className="p-4">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl w-full mb-5 bg-white shadow-md rounded-md relative mt-4 p-4"
      >
        <div className="flex flex-col md:flex-row items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={handleMessageChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            placeholder="Type your message..."
          />
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          {!image ? (
            <label
              htmlFor="image"
              className="flex items-center cursor-pointer text-indigo-500 hover:text-indigo-600 ml-2"
            >
              <UploadIcon size={24} />
            </label>
          ) : (
            <div className="relative mt-2 flex justify-center">
              <img
                src={image}
                alt="Selected"
                className="max-w-xs rounded-md shadow-md"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 focus:outline-none"
              >
                <XIcon size={16} />
              </button>
            </div>
          )}
          <button
            type="submit"
            className="md:ml-2 mt-2 md:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md hover focus"
          >
            <SendIcon size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default PingChatTab;
