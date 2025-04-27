import React from 'react';
import {
  AuditOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  HistoryOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
  const location = useLocation();

  return (
    <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
      <div
        style={{
          height: 32,
          margin: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 20,
          borderRadius: 8,
        }}
      >
        ERTE
      </div>

      <Menu theme="light" mode="inline" selectedKeys={[location.pathname]}>
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Rumah</Link>
        </Menu.Item>
        <Menu.Item key="/penghuni" icon={<UserOutlined />}>
          <Link to="/penghuni">Penghuni</Link>
        </Menu.Item>
        <Menu.Item key="/riwayat-penghuni" icon={<HistoryOutlined />}>
          <Link to="/riwayat-penghuni">Riwayat Penghuni</Link>
        </Menu.Item>
        <Menu.Item key="/pembayaran" icon={<FileDoneOutlined />}>
          <Link to="/pembayaran">Pembayaran</Link>
        </Menu.Item>
        <Menu.Item key="/pengeluaran" icon={<AuditOutlined />}>
          <Link to="/pengeluaran">Pengeluaran</Link>
        </Menu.Item>
        <Menu.Item key="/laporan-keuangan" icon={<BarChartOutlined />}>
          <Link to="/laporan-keuangan">Laporan Keuangan</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
