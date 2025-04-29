import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getMonthName } from '../utils/getMonthName';

export default function ModalDetailLaporanKeuangan({ isModalOpen, handleOk, detailDataMonth, detailDataYear }) {
    const [loading, setLoading] = useState(false);
    const [paymentSummary, setPaymentSummary] = useState([]);
    const [expenseSummary, setExpenseSummary] = useState([]);

    const fetchPaymentSummary = async (year, month) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/payment-summary/${year}/${month}`);
            setPaymentSummary(response.data);
        } catch (error) {
            console.error('Gagal fetch pembayaran:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isModalOpen && detailDataYear && detailDataMonth) {
            fetchPaymentSummary(detailDataYear, detailDataMonth);
        }
    }, [isModalOpen, detailDataYear, detailDataMonth]);
    
    const fetchExpenseSummary = async (year, month) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/expense-summary/${year}/${month}`);
            setExpenseSummary(response.data);
        } catch (error) {
            console.error('Gagal fetch pembayaran:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isModalOpen && detailDataYear && detailDataMonth) {
            fetchExpenseSummary(detailDataYear, detailDataMonth);
        }
    }, [isModalOpen, detailDataYear, detailDataMonth]);

    const paymentColumns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tanggal Pembayaran',
            dataIndex: 'payment_date', // sesuai field API kamu
            key: 'payment_date', 
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
            title: 'Nominal (Rp)',
            dataIndex: 'amount',
            key: 'amount',
        },
    ];

    const ExpenseColumns = [
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
    ];

    return (
        <Modal
            title={`Detail Laporan Bulan ${getMonthName(detailDataMonth)}`}
            open={isModalOpen}
            onCancel={handleOk}         // Tombol X pakai handleOk juga
            footer={[
                <Button key="close" type="primary" onClick={handleOk}>
                Close
                </Button>,
            ]}
        >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Pemasukan</h4>
        </div>
        <Table columns={paymentColumns} dataSource={paymentSummary} loading={loading} rowKey="payment_id" pagination={{ pageSize: 5 }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Pengeluaran</h4>
        </div>
        <Table columns={ExpenseColumns} dataSource={expenseSummary} loading={loading} rowKey="expense_id" pagination={{ pageSize: 5 }} />

        </Modal>
    );
}
