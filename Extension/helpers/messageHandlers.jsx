import { Modal } from 'antd';  // Modalのインポート

const handleSendMessage = async (inputValue, setInputValue, messages, setMessages, isLoading, setIsLoading, messagesHistory, setMessagesHistory, conversationStyle, referenceMode, summaryMode) => {
  if (isLoading) return; // If it's currently loading, don't proceed further.
  setIsLoading(true);
  console.log("HANDLE!")
  if (inputValue.trim() !== '') {
    const userMessage = { role: 'user', content: inputValue, isSummary: summaryMode };
    const botMessage = { role: 'assistant', content: '応答中...', isSummary: summaryMode };
    setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);
    setInputValue('');

    //temperture変更
    let temperature;
    if (!summaryMode) {
      switch (conversationStyle) {
        case 'creative':
          temperature = 0.8;
          break;
        case 'balance':
          temperature = 0.5;
          break;
        case 'strictly':
          temperature = 0.1;
          break;
        default:
          temperature = 0.1;
      }
    } else {
      //サマリのときだけ、0.1に設定します。
      temperature = 0.1;
      referenceMode = 'basic'

    }
    try {
      const params = new URLSearchParams({
        temperature: temperature,  // この部分を適切な値に置き換えてください
        referenceMode: referenceMode,      // この部分を適切な値に置き換えてください
        summaryMode: summaryMode
      });
      const url = `${process.env.PLASMO_PUBLIC_API_PATH}/generate?${params.toString()}`
      console.log(url)

      // オブジェクトからroleとcontentだけを抽出する関数
      //isSummaryはクライアントだけで使います
      const extractRoleAndContent = (message) => ({
        role: message.role,
        content: message.content
      });

      // 新しい配列を作成
      const minimalMessages = [...messages, userMessage].map(extractRoleAndContent);


      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(minimalMessages)
      });

      if (response.status === 200) {
        const reader = response.body.getReader();
        let textMsg = ""
        let botMsg = {}
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          let catchMsg = ""
          catchMsg = new TextDecoder().decode(value);
          textMsg = textMsg + catchMsg

          botMsg = { role: 'assistant', content: textMsg };
          setMessages([...messages, userMessage, botMsg]);
        }
        setMessagesHistory([...messagesHistory, userMessage, botMsg])
        setIsLoading(false);
      } else {
        const data = await response.json();
        throw (data.detail);
      }
    } catch (error) {
      // エラーメッセージの表示
      Modal.error({
        title: 'エラーが発生しました。',
        content: '内容：' + error,
        centered: true,
      });
      setMessages([...messages, userMessage]);
      setIsLoading(false);
    }
  }else{
    setIsLoading(false);


  }
};

export { handleSendMessage };
