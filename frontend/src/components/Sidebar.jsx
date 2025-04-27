//import React, { useState } from 'react';
import {
    AuditOutlined,
    BarChartOutlined,
    FileDoneOutlined,
    HistoryOutlined,
    HomeOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div
                style={{
                    height: 32,
                    margin: 16,
                    //background: 'rgba(255, 255, 255, 0.2)',
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
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
            {
                key: '1',
                icon: <HomeOutlined />,
                label: 'Rumah',
            },
            {
                key: '2',
                icon: <UserOutlined />,
                label: 'Penghuni',
            },
            {
                key: '3',
                icon: <HistoryOutlined />,
                label: 'Riwayat Penghuni',
            },
            {
                key: '4',
                icon: <FileDoneOutlined />,
                label: 'Pembayaran',
            },
            {
                key: '5',
                icon: <AuditOutlined />,
                label: 'Pengeluaran',
            },
            {
                key: '6',
                icon: <BarChartOutlined />,
                label: 'Laporan Keuangan',
            },
            ]}
        />
        </Sider>
    );
}
