import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, message, Popconfirm, Space, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ModalTambahPengeluaran from '../modals/ModalTambahPengeluaran';
import ModalUbahPengeluaran from '../modals/ModalUbahPengeluaran';

export default function Pengeluaran() {
    const [data, setData] = useState([]); // state untuk data pengeluaran
    const [loading, setLoading] = useState(false); // loading table
    const [isModalOpen, setIsModalOpen] = useState(false); // modal tambah pengeluaran
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [searchText, setSearchText] = useState('');

    const filteredData = data.filter((item) =>
        (item.expense_type || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.expense_description || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.resident?.resident_fullname || '').toLowerCase().includes(searchText.toLowerCase())
    );

    const fetchPengeluaran = async () => {
        setLoading(true);
        try {
        const response = await axios.get('http://127.0.0.1:8000/api/expenses'); // GANTI URL sesuai API kamu
        setData(response.data); // Sesuaikan response sesuai API kamu
        } catch (error) {
        console.error('Gagal fetch pengeluaran:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPengeluaran();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/expenses/${id}`);
            message.success('Pengeluaran berhasil dihapus');
          fetchPengeluaran(); // refresh tabel
        } catch (error) {
            console.error('Gagal hapus pengeluaran:', error);
            message.error('Gagal hapus pengeluaran');
        }
    };

    const openEditModal = (record) => {
        setEditingData(record);
        setIsEditModalOpen(true);
    };

    // ...fungsi handle update
    const handleUpdatePengeluaran = async (values) => {
        try {
            const payload = {
                expense_type: values.expense_type,
                expense_description: values.expense_description,
                amount: values.amount,
                expense_date: values.expense_date.format('YYYY-MM-DD'),
            };
            console.log(payload);
            
            
        await axios.post(`http://127.0.0.1:8000/api/expenses/${editingData.expense_id}?_method=PUT`, payload, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    
        message.success('Berhasil memperbarui pengeluaran!');
        setIsEditModalOpen(false);
        fetchPengeluaran(); // refresh tabel
        } catch (error) {
        console.error('Gagal update pengeluaran:', error);
        message.error('Gagal update pengeluaran!');
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
            title: 'Tanggal Pengeluaran',
            dataIndex: 'expense_date', // sesuai field API kamu
            key: 'expense_date',
        },
        {
            title: 'Jenis Pengeluaran',
            dataIndex: 'expense_type',
            key: 'expense_type',
        },
        {
            title: 'Deskripsi',
            dataIndex: 'expense_description',
            key: 'expense_description',
            render: (values) => (values? values : '-')
        },
        {
            title: 'Nominal (Rp)',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => openEditModal(record)}>Ubah</Button>
                    <Popconfirm
                        title="Yakin mau hapus pengeluaran ini?"
                        description="Data yang dihapus tidak bisa dikembalikan."
                        okText="Ya, hapus"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.expense_id)}
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
            <h1>Daftar Pengeluaran</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tambah Pengeluaran
            </Button>
        </div>
        <Input.Search
            placeholder="Cari..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
        />
        <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="expense_id" pagination={{ pageSize: 5 }} />

        <ModalTambahPengeluaran
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            fetchPengeluaran={fetchPengeluaran}
        />

        <ModalUbahPengeluaran
            isModalOpen={isEditModalOpen}
            handleCancel={() => setIsEditModalOpen(false)}
            editingData={editingData}
            handleUpdate={handleUpdatePengeluaran}
        />

        </div>
    );
}
