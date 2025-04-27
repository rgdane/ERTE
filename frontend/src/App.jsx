import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import Sidebar from './components/Sidebar';
import Header from './components/Header'; // Import header baru

const { Content } = Layout;

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} title="Rumah" />
        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer }}>
          {/* Konten utama di sini */}
          Content goes here
        </Content>
      </Layout>
    </Layout>
  );
}
