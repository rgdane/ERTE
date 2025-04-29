import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, message, Popconfirm, Space, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ModalTambahPembayaran from '../modals/ModalTambahPembayaran';
import ModalUbahPembayaran from '../modals/ModalUbahPembayaran';
import { getMonthName } from '../utils/getMonthName';

export default function Pembayaran() {
    const [data, setData] = useState([]); // state untuk data pembayaran
    const [loading, setLoading] = useState(false); // loading table
    const [isModalOpen, setIsModalOpen] = useState(false); // modal tambah pembayaran
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [searchText, setSearchText] = useState('');

    const filteredData = data.filter((item) =>
        (item.payment_type || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.resident?.resident_fullname || '').toLowerCase().includes(searchText.toLowerCase())
    );

    const fetchPembayaran = async () => {
        setLoading(true);
        try {
        const response = await axios.get('http://127.0.0.1:8000/api/payments'); // GANTI URL sesuai API kamu
        setData(response.data); // Sesuaikan response sesuai API kamu
        } catch (error) {
        console.error('Gagal fetch pembayaran:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPembayaran();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/payments/${id}`);
            message.success('Pembayaran berhasil dihapus');
          fetchPembayaran(); // refresh tabel
        } catch (error) {
            console.error('Gagal hapus pembayaran:', error);
            message.error('Gagal hapus pembayaran');
        }
    };

    const openEditModal = (record) => {
        setEditingData(record);
        setIsEditModalOpen(true);
    };

    // ...fungsi handle update
    const handleUpdatePembayaran = async (values) => {
        try {
            const payload = {
                resident_id: values.resident_id,
                payment_type: values.payment_type,
                month: values.month,
                amount: values.amount,
                payment_date: values.payment_date.format('YYYY-MM-DD'),
                month_period: values.month_period,
                year_period: values.year_period,
            };
            
        await axios.post(`http://127.0.0.1:8000/api/payments/${editingData.payment_id}?_method=PUT`, payload, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    
        message.success('Berhasil memperbarui pembayaran!');
        setIsEditModalOpen(false);
        fetchPembayaran(); // refresh tabel
        } catch (error) {
        console.error('Gagal update pembayaran:', error);
        message.error('Gagal update pembayaran!');
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
            title: 'Penghuni',
            dataIndex: ['resident','resident_fullname'],
            key: 'resident_fullname',
        },
        {
            title: 'Jenis Pembayaran',
            dataIndex: 'payment_type',
            key: 'payment_type',
        },
        {
            title: 'Nominal Bulan',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Total (Rp)',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tanggal Pembayaran',
            dataIndex: 'payment_date', // sesuai field API kamu
            key: 'payment_date', 
        },
        {
            title: 'Periode Bulan',
            dataIndex: 'month_period', // sesuai field API kamu
            key: 'month_period',
            render: (value) => getMonthName(value), 
        },
        {
            title: 'Periode Tahun',
            dataIndex: 'year_period', // sesuai field API kamu
            key: 'year_period',
        },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => openEditModal(record)}>Ubah</Button>
                    <Popconfirm
                        title="Yakin mau hapus pembayaran ini?"
                        description="Data yang dihapus tidak bisa dikembalikan."
                        okText="Ya, hapus"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.payment_id)}
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
            <h1>Daftar Riwayat Pembayaran</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tambah Riwayat Pembayaran
            </Button>
        </div>
        <Input.Search
            placeholder="Cari..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
        />
        <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="payment_id" pagination={{ pageSize: 5 }} />

        <ModalTambahPembayaran
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            fetchPembayaran={fetchPembayaran}
        />

        <ModalUbahPembayaran
            isModalOpen={isEditModalOpen}
            handleCancel={() => setIsEditModalOpen(false)}
            editingData={editingData}
            handleUpdate={handleUpdatePembayaran}
        />

        </div>
    );
}
