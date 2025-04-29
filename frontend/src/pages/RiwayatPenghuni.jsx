import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import ModalTambahRiwayatPenghuni from '../modals/ModalTambahRiwayatPenghuni';
import ModalUbahRiwayatPenghuni from '../modals/ModalUbahRiwayatPenghuni';

export default function RiwayatPenghuni() {
    const [data, setData] = useState([]); // state untuk data riwayat penghuni
    const [loading, setLoading] = useState(false); // loading table
    const [isModalOpen, setIsModalOpen] = useState(false); // modal tambah riwayat penghuni
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [searchText, setSearchText] = useState('');

    const filteredData = data.filter((item) =>
        (item.start_date || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.end_date || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.resident?.resident_fullname || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.resident?.resident_phone || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.house?.house_address || '').toLowerCase().includes(searchText.toLowerCase())
    );

    const fetchRiwayatPenghuni = async () => {
        setLoading(true);
        try {
        const response = await axios.get('http://127.0.0.1:8000/api/resident-histories'); // GANTI URL sesuai API kamu
        setData(response.data); // Sesuaikan response sesuai API kamu
        } catch (error) {
        console.error('Gagal fetch riwayat penghuni:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRiwayatPenghuni();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/resident-histories/${id}`);
            message.success('RiwayatPenghuni berhasil dihapus');
          fetchRiwayatPenghuni(); // refresh tabel
        } catch (error) {
            console.error('Gagal hapus riwayat penghuni:', error);
            message.error('Gagal hapus riwayat penghuni');
        }
    };

    const openEditModal = (record) => {
        setEditingData(record);
        setIsEditModalOpen(true);
    };

    // ...fungsi handle update
    const handleUpdateRiwayatPenghuni = async (values) => {
        try {
            const payload = {
                house_id: values.house_id,
                resident_id: values.resident_id,
                start_date: values.start_date.format('YYYY-MM-DD'),
                end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : '',
            };
            console.log(payload);
            
            
        await axios.post(`http://127.0.0.1:8000/api/resident-histories/${editingData.resident_history_id}?_method=PUT`, payload, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    
        message.success('Berhasil memperbarui riwayat penghuni!');
        setIsEditModalOpen(false);
        fetchRiwayatPenghuni(); // refresh tabel
        } catch (error) {
        console.error('Gagal update riwayat penghuni:', error);
        message.error('Gagal update riwayat penghuni!');
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
            dataIndex: ['house', 'house_address'],
            key: 'house_address',
        },
        {
            title: 'Penghuni',
            dataIndex: ['resident','resident_fullname'],
            key: 'resident_fullname',
        },
        {
            title: 'Tanggal Mulai',
            dataIndex: 'start_date', // sesuai field API kamu
            key: 'start_date',
        },
        {
            title: 'Tanggal Berakhir',
            dataIndex: 'end_date', // sesuai field API kamu
            key: 'end_date',
            render: (value) => (value ? value : '-'),
        },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => openEditModal(record)}>Ubah</Button>
                    <Popconfirm
                        title="Yakin ingin hapus riwayat penghuni ini?"
                        description="Data yang dihapus tidak bisa dikembalikan."
                        okText="Ya, hapus"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.resident_history_id)}
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
            <h1>Daftar Riwayat Penghuni</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tambah Riwayat Penghuni
            </Button>
        </div>
        <Input.Search
            placeholder="Cari..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
        />
        <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="resident_history_id" pagination={{ pageSize: 5 }} />

        <ModalTambahRiwayatPenghuni
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            fetchRiwayatPenghuni={fetchRiwayatPenghuni}
        />

        <ModalUbahRiwayatPenghuni
            isModalOpen={isEditModalOpen}
            handleCancel={() => setIsEditModalOpen(false)}
            editingData={editingData}
            handleUpdate={handleUpdateRiwayatPenghuni}
        />

        </div>
    );
}
