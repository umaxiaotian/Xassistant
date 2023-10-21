import { useState, useEffect } from 'react';

const useChatState = () => {
  const [messages, setMessages] = useState([]);
  // const [messagesHistory, setMessagesHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modeDialogMsg, setModeDialogMsg] = useState("");

  //会話モードのデフォを指定
  const [conversationStyle, setConversationStyle] = useState('strictly');
  const [referenceMode, setReferenceMode] = useState('basic');
  return {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    open,
    setOpen,
    modeDialogMsg,
    setModeDialogMsg,
    conversationStyle,
    setConversationStyle,
    referenceMode,
    setReferenceMode
    
  };
};

export default useChatState;
