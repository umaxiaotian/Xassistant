import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Input, Button, Empty, Space, Alert, Modal, Tooltip, Image } from 'antd';
import { ReloadOutlined, SearchOutlined, CopyOutlined } from '@ant-design/icons';
import MessagesList from './MessagesList';
import AssistantModal from './AssistantModal'; // 新しく作成したコンポーネントをインポート

import { markdownOptions } from './markdownUtils';

//フックコンポーネント
import useChatState from '../hooks/useChatState';
//送信用コンポーネント
import { handleSendMessage } from '../helpers/messageHandlers';

import { useStorage } from '@plasmohq/storage/hook';

const { TextArea } = Input;

const Chat = forwardRef((props, ref) => {
  const messageContainerRef = useRef(null);
  const [messagesHistory, setMessagesHistory] = useStorage('message', []);
  // const [messages, setMessages] = useState([]);
  // const [inputValue, setInputValue] = useState("");
  const [isDarkMode, setIsDarkMode] = useStorage('isDarkMode', false);
  
  const {
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
    

  } = useChatState();
  const insertText = () => {
    setInputValue(`「${modeDialogMsg}」について教えてください。`)
  }
  const summaryText = () => {
    // const text = `要約モードを使用しました。`
    handleSendMessage(modeDialogMsg, setInputValue, messages, setMessages, isLoading, setIsLoading, messagesHistory, setMessagesHistory,conversationStyle,referenceMode,true);

  }
  const handleCtrlEnter = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSendMessage(inputValue, setInputValue, messages, setMessages, isLoading, setIsLoading, messagesHistory, setMessagesHistory,conversationStyle,referenceMode,false);
    }
  };
  useEffect(() => {
    setMessages(messagesHistory);
  }, [messagesHistory]);  // 空の依存配列を指定して、マウント時のみ実行
  useEffect(() => {
    //初期だけ実行する。
    chrome.runtime.onMessage.addListener(function (request, role, sendResponse) {
      if (request.info.mode == "Query" && request.info.text) {
        console.log("Received info:", request.info.text);
        setModeDialogMsg(request.info.text)
        setOpen(true)
      }
    });
    chrome.runtime.sendMessage({ message: "open_side_panel" })
  }, [open]);
  const talkHistoryReset = async () => {
    setMessages([]);
    setMessagesHistory([]);
    setInputValue('');
  };
  useEffect(() => {
    setMessages(messagesHistory);
  }, [messagesHistory]);
  useEffect(() => {
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messages]);

  //
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      Modal.info({
        title: 'システムメッセージ',
        content: 'クリップボードにコピーしました',
        centered: true,
      });

    } catch (err) {
      alert("クリップボードへのコピーに失敗しました");
    }
  };


    // Chromeがダークモードかどうかを判定する関数
const isChromeDarkMode = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false; // ブラウザサポートがない場合やサーバーサイドレンダリングの際はデフォルトでfalseを返す
}
// if(isThemeSystem === false){
//   setIsDarkMode(isChromeDarkMode())
// }

  return (
    <>
      {/* モーダル用コンポーネント */}
      <AssistantModal
        open={open}
        modeDialogMsg={modeDialogMsg}
        setOpen={setOpen}
        setModeDialogMsg={setModeDialogMsg}
        insertText={insertText}
        summaryText={summaryText}
        talkHistoryReset={talkHistoryReset}
        isLoading={isLoading}
        conversationStyle={conversationStyle}
        setConversationStyle={setConversationStyle}
        referenceMode={referenceMode}
        setReferenceMode={setReferenceMode}
      />

      <div
        ref={messageContainerRef}
        style={{ overflowY: 'scroll', padding: '8px', position: 'absolute', top: 130, bottom: 120, left: 0, right: 0 }}
      >
        {/* ユーザーとアシスタントとのメッセージのやり取りを記載 */}
        <MessagesList
          messages={messages}
          isDarkMode={isDarkMode}
          copyToClipboard={copyToClipboard}
          markdownOptions={markdownOptions}
          conversationStyle={conversationStyle}
          setConversationStyle={setConversationStyle}
          referenceMode={referenceMode}
          setReferenceMode={setReferenceMode}
        />
      </div>
      <Space.Compact style={{ width: '100%', position: 'absolute', height: 120, resize: 'none', bottom: 0 }}>
        <TextArea
          rows={4}
          maxLength={4000}
          value={inputValue}
          style={{ resize: 'none' }}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="質問事項を入力してください"
          onKeyDown={handleCtrlEnter}
        />

      </Space.Compact>

      <Button
        type="dashed"
        icon={<SearchOutlined />}
        style={{ position: 'absolute', bottom: 10, right: 10 }}
        onClick={(e) => handleSendMessage(inputValue, setInputValue, messages, setMessages, isLoading, setIsLoading, messagesHistory, setMessagesHistory,conversationStyle,referenceMode,false)}
        disabled={isLoading} // Disable the button while it's loading.
      >
        質問
      </Button>
    </>
  );
});

export default Chat;
