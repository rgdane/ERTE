import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import ModalTambahRumah from '../modals/ModalTambahRumah';
import ModalUbahRumah from '../modals/ModalUbahRumah';

export default function Rumah() {
    const [data, setData] = useState([]); // state untuk data rumah
    const [loading, setLoading] = useState(false); // loading table
    const [isModalOpen, setIsModalOpen] = useState(false); // modal tambah rumah
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [searchText, setSearchText] = useState('');
    
    const filteredData = data.filter((item) =>
        (item.house_address || '').toLowerCase().includes(searchText.toLowerCase())
    );

    const fetchRumah = async () => {
        setLoading(true);
        try {
        const response = await axios.get('http://127.0.0.1:8000/api/houses'); // GANTI URL sesuai API kamu
        setData(response.data); // Sesuaikan response sesuai API kamu
        } catch (error) {
        console.error('Gagal fetch rumah:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRumah();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/houses/${id}`);
            message.success('Rumah berhasil dihapus');
          fetchRumah(); // refresh tabel
        } catch (error) {
            console.error('Gagal hapus rumah:', error);
            message.error('Gagal hapus rumah');
        }
    };

    const openEditModal = (record) => {
        setEditingData(record);
        setIsEditModalOpen(true);
    };

    // ...fungsi handle update
    const handleUpdateRumah = async (values) => {
        try {
        const formData = new FormData();
        formData.append('house_address', values.house_address);
        formData.append('is_occupied', values.is_occupied ? 1 : 0);
    
        await axios.post(`http://127.0.0.1:8000/api/houses/${editingData.house_id}?_method=PUT`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    
        message.success('Berhasil memperbarui rumah!');
        setIsEditModalOpen(false);
        fetchRumah(); // refresh tabel
        } catch (error) {
        console.error('Gagal update rumah:', error);
        message.error('Gagal update rumah!');
        }
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Alamat',
            dataIndex: 'house_address',
            key: 'house_address',
        },
        {
            title: 'Status Huni',
            dataIndex: 'is_occupied', // sesuai field API kamu
            key: 'is_occupied',
            render: (value) => (value ? 'Dihuni' : 'Tidak Dihuni'),
        },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => openEditModal(record)}>Ubah</Button>
                    <Popconfirm
                        title="Yakin ingin hapus rumah ini?"
                        description="Data yang dihapus tidak bisa dikembalikan."
                        okText="Ya, hapus"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.house_id)}
                    >
                    <Button danger>Hapus</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    
    return (
        <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h1>Daftar Rumah</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tambah Rumah
            </Button>
        </div>
        <Input.Search
            placeholder="Cari..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
        />
        <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="house_id" pagination={{ pageSize: 5 }} />

        <ModalTambahRumah
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            fetchRumah={fetchRumah}
        />

        <ModalUbahRumah
            isModalOpen={isEditModalOpen}
            handleCancel={() => setIsEditModalOpen(false)}
            editingData={editingData}
            handleUpdate={handleUpdateRumah}
        />

        </div>
    );
}
