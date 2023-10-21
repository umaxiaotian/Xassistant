
// MessagesList.tsx
//チャットメッセージを表示する部分になります。

import React from 'react';
import { Tooltip, Divider, Radio } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import Markdown from 'markdown-to-jsx';

export default function MessagesList({
    messages,
    isDarkMode,
    copyToClipboard,
    markdownOptions,
    conversationStyle,
    setConversationStyle,
    referenceMode,
    setReferenceMode
}) {

    // const [conversationStyle, setConversationStyle] = useState('strictly');
    // const [referenceMode, setReferenceMode] = useState('large');

    const handleConversationStyleChange = e => {
        setConversationStyle(e.target.value);
    };

    const handleReferenceModeChange = e => {
        setReferenceMode(e.target.value);
    };

    // 必要に応じて選択された値を返す関数
    const getSelectedOptions = () => {
        return {
            conversationStyle: conversationStyle,
            referenceMode: referenceMode
        };
    };
    if (messages.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Divider orientation="center" plain>
                    会話スタイル
                </Divider>
                <Radio.Group value={conversationStyle} onChange={handleConversationStyleChange}>
                    <Radio.Button value="strictly">厳密</Radio.Button>
                    <Radio.Button value="balance">バランス</Radio.Button>
                    <Radio.Button value="creative">創造的</Radio.Button>
                </Radio.Group>

                <Divider orientation="center" plain>
                    情報参照モード
                </Divider>
                <Radio.Group value={referenceMode} onChange={handleReferenceModeChange}>
                <Tooltip title={
                        <div>
                            標準のGPTとのチャット
                        </div>

                    } placement="bottom">
                    <Radio.Button value="basic">標準チャット</Radio.Button>
                    </Tooltip>

                    <Tooltip title={
                        <div>
                            LangChainのToolsを利用した関数呼び出しができる機能
                        </div>

                    } placement="bottom">
                    <Radio.Button value="tools">Toolモード</Radio.Button>
                    </Tooltip>

                    <Tooltip title={
                        <div>
                            今表示されているページの情報を読んでその内容について会話します。
                        </div>

                    } placement="bottom">
                    
                    <Radio.Button value="pagescan" disabled>ページを探索</Radio.Button></Tooltip>
                </Radio.Group>
            </div>
        );
    }

    return (
        <>
            {messages.map((message, index) => (
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row', // この行を変更
                        justifyContent: 'flex-start',
                        marginBottom: '10px',
                    }}
                >
                    <div
                        style={{
                            background: isDarkMode ? (message.role === 'user' ? '#3B3B3B' : '#093B69') : (message.role === 'user' ? '#f0f0f0' : '#1890ff'),
                            color: isDarkMode ? (message.role === 'user' ? 'white' : 'white') : (message.role === 'user' ? 'black' : 'white'),
                            padding: '8px',
                            borderRadius: '8px',
                            maxWidth: '70%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            wordWrap: 'break-word',
                        }}
                    >

                        {/* ここからナビゲーションバーの追加 */}
                        <div style={{
                            flex: 1,
                            backgroundColor: isDarkMode ? (message.role === 'user' ? '#757575' : '#116ABD') : (message.role === 'user' ? '#BABABA' : '#126FC7'),
                            padding: '5px',
                            borderRadius: '8px',
                            marginBottom: '10px'
                        }}>
                            {/* ナビゲーションバーの中身をここに追加できます。 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* ユーザー名の表示 */}
                                <div>
                                    {message.role === 'user'
                                        ? (message.isSummary ? 'サマリモードを使用した会話' : 'ユーザー')
                                        : 'アシスタント'}
                                </div>
                                <Tooltip title="コピー">
                                    <span style={{ marginLeft: '10px', cursor: 'pointer' }}>
                                        <CopyOutlined
                                            onClick={() => copyToClipboard(message.content)}
                                            style={{ fontSize: '24px' }}
                                        />
                                    </span>
                                </Tooltip>
                            </div>
                        </div>
                        {/* ここまでナビゲーションバーの追加 */}
                        {
                            message.role === 'assistant'
                                ? <Markdown options={markdownOptions}>{message.content}</Markdown>
                                : message.content
                        }
                    </div>
                </div>
            ))}
        </>
    );
}