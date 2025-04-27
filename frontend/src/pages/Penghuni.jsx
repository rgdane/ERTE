import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
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


    const fetchPenghuni = async () => {
        setLoading(true);
        try {
        const response = await axios.get('http://127.0.0.1:8000/api/residents'); // GANTI URL sesuai API kamu
        setData(response.data); // Sesuaikan response sesuai API kamu
        } catch (error) {
        console.error('Gagal fetch penghuni:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPenghuni();
    }, []);

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
        fetchPenghuni(); // refresh tabel
        } catch (error) {
        console.error('Gagal update penghuni:', error);
        message.error('Gagal update penghuni!');
        }
    };

    const columns = [
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
                        title="Yakin mau hapus penghuni ini?"
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
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tambah Penghuni
            </Button>
        </div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="resident_id" pagination={{ pageSize: 5 }} />

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
