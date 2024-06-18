
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Cursor = styled.span`
  font-weight: bold;
  animation: ${blink} 1s infinite;
`;

const IconTray = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: color 0.2s;
  outline: none;

  &:hover {
    color: #333;
    border: none;
    outline: none;
  }
`;

interface TypingEffectProps {
  text: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    let index = 0;
    if (text) {
      setDisplayedText(text);
      setIsTypingComplete(true);
      return;
    }
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);


  return (
    <div>
      <span>
        {displayedText}
        {!isTypingComplete && <Cursor>|</Cursor>}
      </span>
    </div>
  );
};

export default TypingEffect;
