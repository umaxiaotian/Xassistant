import React, { useState } from 'react';
import { Typography, Switch,Divider } from 'antd';
const { Title } = Typography;
import { useStorage } from "@plasmohq/storage/hook"

const ThemeSetting = (props) => {
  const [isDarkMode, setIsDarkMode] = useStorage('isDarkMode', false);
  return (
    <>

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Divider orientation="center" plain>
                    テーマモード切り替え
                </Divider>
      <Switch checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} checkedChildren="ダーク" unCheckedChildren="ホワイト" defaultChecked />
            </div>


      
    </>
  );
};

export default ThemeSetting;