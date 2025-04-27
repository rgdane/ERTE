import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout, theme } from 'antd';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Import halaman-halaman
import Rumah from './pages/Rumah';
import Penghuni from './pages/Penghuni';
import RiwayatPenghuni from './pages/RiwayatPenghuni';
import Pembayaran from './pages/Pembayaran';
import Pengeluaran from './pages/Pengeluaran';
import LaporanKeuangan from './pages/LaporanKeuangan';

const { Content } = Layout;

function AppContent({ collapsed, setCollapsed }) {
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Map path -> judul
  const titles = {
    '/': 'Rumah',
    '/penghuni': 'Penghuni',
    '/riwayat-penghuni': 'Riwayat Penghuni',
    '/pembayaran': 'Pembayaran',
    '/pengeluaran': 'Pengeluaran',
    '/laporan-keuangan': 'Laporan Keuangan',
  };

  const currentTitle = titles[location.pathname] || 'Dashboard';

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} title={currentTitle} />
        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer }}>
          <Routes>
            <Route path="/" element={<Rumah />} />
            <Route path="/penghuni" element={<Penghuni />} />
            <Route path="/riwayat-penghuni" element={<RiwayatPenghuni />} />
            <Route path="/pembayaran" element={<Pembayaran />} />
            <Route path="/pengeluaran" element={<Pengeluaran />} />
            <Route path="/laporan-keuangan" element={<LaporanKeuangan />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <AppContent collapsed={collapsed} setCollapsed={setCollapsed} />
    </Router>
  );
}
