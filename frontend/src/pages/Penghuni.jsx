import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import ModalTambahPenghuni from '../modals/ModalTambahPenghuni';
import ModalUbahPenghuni from '../modals/ModalUbahPenghuni';

export default function Penghuni() {
    const [data, setData] = useState([]); // state untuk data penghuni
    const [loading, setLoading] = useState(false); // loading table
    const [isModalOpen, setIsModalOpen] = useState(false); // modal tambah penghuni
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState([1]);
    
    const filteredData = data.filter((item) =>
        (item.resident_fullname || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.resident_phone || '').toLowerCase().includes(searchText.toLowerCase())
    );

    const fetchPenghuni = async (status) => {
        setLoading(true);
        try {
            const url = status === 3 
                ? 'http://127.0.0.1:8000/api/residents/' 
                : `http://127.0.0.1:8000/api/residents/${status}`;
            
            const response = await axios.get(url);
            setData(response.data);
        } catch (error) {
            console.error('Gagal fetch penghuni:', error);
        }
        setLoading(false);
    };
    

    useEffect(() => {
        fetchPenghuni(selectedStatus);
    }, [selectedStatus]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/residents/${id}`);
            message.success('Penghuni berhasil dihapus');
          fetchPenghuni(); // refresh tabel
        } catch (error) {
            console.error('Gagal hapus penghuni:', error);
            message.error('Gagal hapus penghuni');
        }
    };

    const openEditModal = (record) => {
        setEditingData(record);
        setIsEditModalOpen(true);
    };

    // ...fungsi handle update
    const handleUpdatePenghuni = async (values) => {
        try {
        const formData = new FormData();
        formData.append('resident_fullname', values.resident_fullname);
        formData.append('resident_phone', values.resident_phone);
        formData.append('is_permanent', values.is_permanent ? 1 : 0);
        formData.append('is_married', values.is_married ? 1 : 0);
        formData.append('is_active', values.is_active ? 1 : 0);
        if (values.resident_id_card) {
            formData.append('resident_id_card', values.resident_id_card.file);
        }
    
        await axios.post(`http://127.0.0.1:8000/api/residents/${editingData.resident_id}?_method=PUT`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    
        message.success('Berhasil memperbarui penghuni!');
        setIsEditModalOpen(false);
        fetchPenghuni(selectedStatus); // refresh tabel
        } catch (error) {
        console.error('Gagal update penghuni:', error);
        message.error('Gagal update penghuni!');
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
            title: 'Nama Lengkap',
            dataIndex: 'resident_fullname',
            key: 'resident_fullname',
        },
        {
            title: 'Telepon',
            dataIndex: 'resident_phone',
            key: 'resident_phone',
        },
        {
            title: 'Status Tinggal',
            dataIndex: 'is_permanent', // sesuai field API kamu
            key: 'is_permanent',
            render: (value) => (value ? 'Tetap' : 'Kontrak'),
        },
        {
            title: 'Status Pernikahan',
            dataIndex: 'is_married', // sesuai field API kamu
            key: 'is_married',
            render: (value) => (value ? 'Menikah' : 'Belum Menikah'),
        },
        {
            title: 'Status Aktivasi',
            dataIndex: 'is_active', // sesuai field API kamu
            key: 'is_active',
            render: (value) => (value ? 'Aktif' : 'Nonaktif'),
        },
        {
            title: 'Foto KTP',
            dataIndex: 'resident_id_card', // sesuai field API kamu
            key: 'resident_id_card',
            render: (text) => text ? (
                <img src={`http://127.0.0.1:8000/storage/${text}`} alt="Foto KTP" style={{ width: 100 }} />
            )  : '-'
        },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => openEditModal(record)}>Ubah</Button>
                    <Popconfirm
                        title="Yakin ingin hapus penghuni ini?"
                        description="Data yang dihapus tidak bisa dikembalikan."
                        okText="Ya, hapus"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.resident_id)}
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
            <h1>Daftar Penghuni</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>Status Aktivasi:</span>
            <Select value={selectedStatus} onChange={(value) => setSelectedStatus(value)} style={{ width: 120 }}>
                    <Select.Option value={3}>- Semua -</Select.Option>
                    <Select.Option value={1}>Aktif</Select.Option>
                    <Select.Option value={0}>Nonaktif</Select.Option>
            </Select>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tambah Penghuni
            </Button>
        </div>
        <Input.Search
            placeholder="Cari..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
        />
        <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="resident_id" pagination={{ pageSize: 5 }} />

        <ModalTambahPenghuni
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            fetchPenghuni={fetchPenghuni}
        />

        <ModalUbahPenghuni
            isModalOpen={isEditModalOpen}
            handleCancel={() => setIsEditModalOpen(false)}
            editingData={editingData}
            handleUpdate={handleUpdatePenghuni}
        />

        </div>
    );
}
