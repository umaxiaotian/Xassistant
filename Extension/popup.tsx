import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  theme,
  ConfigProvider,
  Tabs,
  Typography
} from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons';

import { useStorage } from "@plasmohq/storage/hook";
const { Title, Paragraph } = Typography;
// @ts-ignore
import styleText from './assets/style.css';
import type { PlasmoGetStyle } from "plasmo";
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = styleText;
  return style;
};
const { defaultAlgorithm, darkAlgorithm } = theme;
function IndexPopup() {
  const [isDarkMode, setIsDarkMode] = useStorage('isDarkMode', false);

  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  useEffect(() => {

  }, []);

  return (
    <div style={{ width: 600, height: 500, backgroundColor: isDarkMode ? '#141414' : 'white' }}>
      <ConfigProvider theme={{ algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm }}>
        <div style={{ padding: '24px' }}> 
         <Title>XAssistant</Title>
         <Paragraph>この拡張機能は、サイドパネルでのみサポートされていますので、サイドパネルが実装されているブラウザバージョンをご使用ください。</Paragraph>
          <Title level={2}>バージョン</Title>
          <Paragraph>Current version: 0.0.2(OpenBeta)</Paragraph>
          <Title level={2}>開発</Title>
          <Paragraph>XAssistantはumaxiaotianによって開発製造されました。</Paragraph>
          <Paragraph>Twitter:@umarun_j</Paragraph>
        </div>
      </ConfigProvider>
    </div>

  );
};

export default IndexPopup;