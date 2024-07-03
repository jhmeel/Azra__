import { useEffect, useRef } from "react";
import { useSocketContext } from "../socketContext";
import notificationSound from "../assets/sounds/notification.mp3";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setMessages } from "../actions";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { chatHistory } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  const chatHistoryRef = useRef(chatHistory);

  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  useEffect(() => {
    const handleNewMessage = (newMessage:any) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      dispatch(setMessages([...chatHistoryRef.current, newMessage]));
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);

  return null; 
};

export default useListenMessages;
