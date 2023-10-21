// AssistantModal.js

import React from 'react';
import { Modal, Button, Alert, Space, Tag, Tooltip } from 'antd';
import Marquee from 'react-fast-marquee';
import { ReloadOutlined } from '@ant-design/icons';
const { CheckableTag } = Tag;
import { useState, useEffect } from 'react';

export default function AssistantModal({ open, modeDialogMsg, setOpen, setModeDialogMsg, insertText, summaryText, talkHistoryReset, isLoading, conversationStyle,
    setConversationStyle,
    referenceMode,
    setReferenceMode }) {
    const tagsData = ['厳密', 'バランス', '創造的'];
    const infoMode = ['標準チャット', 'Toolモード', 'ページを探索'];
    let selectedTags = ""
    if (conversationStyle === "strictly") { selectedTags = "厳密" }
    if (conversationStyle === "balance") { selectedTags = "バランス" }
    if (conversationStyle === "creative") { selectedTags = "創造的" }
    // const [selectedTags, setSelectedTags] = useState<string[]>(['厳密']);
    // const [infoTags, setInfoTags] = useState<string[]>(['標準チャット']);
    let infoTags = ""
    if (referenceMode === "basic") { infoTags = "標準チャット" }
    if (referenceMode === "tools") { infoTags = "Toolモード" }
    if (referenceMode === "pagescan") { infoTags = "ページを探索" }
    return (
        <>
            <Modal
                open={open}
                title="文章が選択されました！"
                centered={true}
                footer={[
                    <Button
                        type="primary"
                        // @ts-ignore
                        onClick={(e) => insertText() & setModeDialogMsg("") & setOpen(false)}
                    >
                        挿入する
                    </Button>
                    ,
                    <Tooltip title={
                        <div>
                            この要約会話だけ以前の会話履歴は考慮されず、会話スタイルもこの会話だけ<br />
                            ★「厳密」で固定されます。<br /><br />
                            また、どの情報参照モードを使っていても、この会話だけ<br />
                            ★「標準チャット」で送信されます。<br />
                            ※上部のバーの情報参照モードは変わりません。
                        </div>

                    } placement="bottom">
                        <Button
                            type="primary"
                            // @ts-ignore
                            onClick={(e) => summaryText() & setModeDialogMsg("") & setOpen(false)}
                        >
                            要約する
                        </Button>
                    </Tooltip>
                    ,
                    <Button
                        type="dashed"
                        danger
                        // @ts-ignore
                        onClick={(e) => setModeDialogMsg("") & setOpen(false)}
                    >
                        キャンセル
                    </Button>
                ]}
            >
                {modeDialogMsg}
            </Modal>
            <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={talkHistoryReset}
                disabled={isLoading}
                style={{
                    position: 'absolute',
                    top: 8,
                    right: 5,
                    zIndex: 1,
                }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Space size={[0, 8]} wrap>
                    <span style={{ marginRight: 22 }}>会話スタイル:</span>
                    {tagsData.map((tag) => (
                        <CheckableTag
                            key={tag}
                            checked={selectedTags.includes(tag)}
                        // onChange={(checked) => handleChange(tag, checked)}
                        >
                            {tag}
                        </CheckableTag>
                    ))}
                </Space>
                <Space size={[0, 8]} wrap>
                    <span style={{ marginRight: 10 }}>情報参照モード:</span>
                    {infoMode.map((tag) => (
                        <CheckableTag
                            key={tag}
                            checked={infoTags.includes(tag)}
                        // onChange={(checked) => handleChange(tag, checked)}
                        >
                            {tag}
                        </CheckableTag>
                    ))}
                </Space>
            </div>

            <Alert
                banner
                message={
                    <Marquee pauseOnHover gradient={false}>
                        ご使用中のXAssistantは現在オープンベータ版です。
                    </Marquee>
                }
            />

        </>

    );
}
