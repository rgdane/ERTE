import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import monthName from '../utils/monthName.js';
import { Button, Select, Space, Table } from 'antd';
import ModalDetailLaporanKeuangan from '../modals/ModalDetailLaporanKeuangan.jsx';

export default function LaporanKeuangan() {
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState([]);
    const [expense, setExpense] = useState([]);
    const [mergeData, setMergeData] = useState([]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailDataMonth, setDetailDataMonth] = useState(null);
    const [detailDataYear, setDetailDataYear] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [yearsData, setYearsData] = useState([]);

    const fetchYears = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/years`);
            
            const yearsData = response.data;
    
            setYearsData(yearsData);
    
        } catch (error) {
            console.error('Gagal fetch years:', error);
            setYearsData([]);
        }
    }
    
    const fetchLaporanKeuangan = async (year) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/payment-summary/${year}`);
    
            let paymentData = response.data;
    
            if (!Array.isArray(paymentData)) {
                paymentData = Object.entries(paymentData).map(([month, total]) => ({
                    month_date: parseInt(month),
                    total: parseInt(total)
                }));
            }
    
            setPayment(paymentData);
    
        } catch (error) {
            console.error('Gagal fetch total payment:', error);
            setPayment([]);
        }
    
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/expense-summary/${year}`);
            
            let expenseData = response.data;
    
            if (!Array.isArray(expenseData)) {
                expenseData = Object.entries(expenseData).map(([month, total]) => ({
                    month_date: parseInt(month),
                    total: parseInt(total)
                }));
            }
    
            setExpense(expenseData);
    
        } catch (error) {
            console.error('Gagal fetch total expense:', error);
            setExpense([]);
        }
    
        setLoading(false);
    };
    
    
    useEffect(() => {    
        fetchLaporanKeuangan(selectedYear);
        fetchYears();
    }, [selectedYear]);

    useEffect(() => {
        if (Array.isArray(payment) && Array.isArray(expense)) {
            let previousRemains = 0;

            const merged = monthName().map((month, index) => {
                const monthIndex = index + 1;

                const currentPayment = payment.find(item => item.month_date === monthIndex);
                const currentExpense = expense.find(item => item.month_date === monthIndex);

                const paymentTotal = currentPayment ? currentPayment.total : 0;
                const expenseTotal = currentExpense ? currentExpense.total : 0;

                const currentRemains = previousRemains + (paymentTotal - expenseTotal);
                previousRemains = currentRemains; // Update sisa untuk bulan berikutnya

                return {
                    month: month,
                    payment: paymentTotal,
                    expense: expenseTotal,
                    remains: currentRemains, // Ini sudah akumulatif
                };
            });

            setMergeData(merged);
        }
    }, [payment, expense]);

    const openDetailModal = (record) => {
        setDetailDataMonth(monthName().indexOf(record.month) + 1);
        setDetailDataYear(selectedYear);
        setIsDetailModalOpen(true);
    };

    const columns = [
        {
            title: 'Bulan',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Pemasukan',
            dataIndex: 'payment',
            key: 'payment',
            render: value => new Intl.NumberFormat('id-ID').format(value),
        },
        {
            title: 'Pengeluaran',
            dataIndex: 'expense',
            key: 'expense',
            render: value => new Intl.NumberFormat('id-ID').format(value),
        },
        {
            title: 'Sisa',
            dataIndex: 'remains',
            key: 'remains',
            render: value => new Intl.NumberFormat('id-ID').format(value),
        },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => openDetailModal(record)}>Detail</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h1>Statistik Keuangan</h1>
            </div>

            <div style={{ width: '100%', height: 400 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontWeight: 500 }}>Tahun:</span>
                    <Select
                        value={selectedYear}
                        onChange={(value) => setSelectedYear(value)}
                        style={{ width: 120 }}
                    >
                        {yearsData.map((year) => (
                            <Select.Option key={year} value={year}>
                                {year}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <ResponsiveContainer>
                    <BarChart data={mergeData} loading={loading} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
                        <Legend />
                        <Bar dataKey="payment" fill="#82ca9d" name="Pemasukan" />
                        <Bar dataKey="expense" fill="#f87171" name="Pengeluaran" />
                    </BarChart>
                </ResponsiveContainer>
            
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 32 }}>
                <h1>Laporan Bulanan</h1>
            </div>
            <Table columns={columns} dataSource={mergeData} loading={loading} rowKey="resident_id" pagination={{ pageSize: 12 }} />
            <ModalDetailLaporanKeuangan
                isModalOpen={isDetailModalOpen}
                handleOk={() => setIsDetailModalOpen(false)}
                detailDataMonth={detailDataMonth}
                detailDataYear={detailDataYear}
            />
        </div>
    );
}
