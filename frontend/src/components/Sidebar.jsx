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
import { Link } from 'react-router-dom';

const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div
        style={{
          height: 32,
          margin: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 20,
          borderRadius: 8,
        }}
      >
        ERTE
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Rumah</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/penghuni">Penghuni</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<HistoryOutlined />}>
          <Link to="/riwayat-penghuni">Riwayat Penghuni</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<FileDoneOutlined />}>
          <Link to="/pembayaran">Pembayaran</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<AuditOutlined />}>
          <Link to="/pengeluaran">Pengeluaran</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<BarChartOutlined />}>
          <Link to="/laporan-keuangan">Laporan Keuangan</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
