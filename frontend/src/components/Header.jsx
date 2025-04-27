import React from 'react';
import { Button, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

export default function Header({ collapsed, setCollapsed, title }) {
    return (
        <AntHeader
        style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Biar button kiri dan title kanan
            paddingRight: 24, // Tambah jarak kanan
        }}
        >
        <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
            fontSize: '16px',
            width: 64,
            height: 64,
            }}
        />
        <div style={{ fontWeight: 'bold', fontSize: 18 }}>{title}</div>
        </AntHeader>
    );
}
