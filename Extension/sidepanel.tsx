import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  theme,
  ConfigProvider,
  Tabs
} from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons';
// @ts-ignore
import ChatSetting from "./components/ChatSetting";
import Chat from "./components/Chat";
// @ts-ignore
import ThemeSetting from "./components/ThemeSetting";
import { useStorage } from "@plasmohq/storage/hook";

// @ts-ignore
import styleText from './assets/style.css';
import type { PlasmoGetStyle } from "plasmo";
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = styleText;
  return style;
};

const { defaultAlgorithm, darkAlgorithm } = theme;

function IndexSidePanel() {
  const [isDarkMode, setIsDarkMode] = useStorage('isDarkMode', false);
  const [activeTab, setActiveTab] = useState('app');

  const handleMenuClick = (key: any) => {
    setActiveTab(key);
  };

  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }



  useEffect(() => {
 
  }, []);

  return (<div style={{height:'100%', backgroundColor: isDarkMode ? '#141414' : 'white' }}>


    <ConfigProvider theme={{ algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm }}>
      
        <Menu mode="horizontal" selectedKeys={[activeTab]} onClick={({ key }) => handleMenuClick(key)}>
          <Menu.Item key="app" icon={<AppstoreOutlined />}>
            アシスタント
          </Menu.Item>
          <Menu.SubMenu key="SubMenu" icon={<SettingOutlined />} title="設定">
            <Menu.ItemGroup title="一般設定">
              <Menu.Item key="setting:chat">チャット設定</Menu.Item>
              <Menu.Item key="setting:theme">テーマ設定</Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
        </Menu>
    
 
      {activeTab === 'app' && <Chat />}
      {activeTab === 'setting:chat' && <ChatSetting />}
      {activeTab === 'setting:theme' && <ThemeSetting />}

    </ConfigProvider>
  </div>

  );
};

export default IndexSidePanel;
