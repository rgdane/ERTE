import { Modal, Form, Input, Select, Upload, Button, DatePicker, InputNumber } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ModalTambahPembayaran({ isModalOpen, setIsModalOpen, fetchPembayaran }) {
    const [form] = Form.useForm();
    const [residents, setResidents] = useState([]);
    const jenisPembayaran = Form.useWatch('payment_type', form);
    const nominalBulan = Form.useWatch('month', form);

    useEffect(() => {
        let hargaPerBulan = 0;
        if (jenisPembayaran === 'Satpam') {
            hargaPerBulan = 100000;
        } else if (jenisPembayaran === 'Kebersihan') {
            hargaPerBulan = 15000;
        }

        if (hargaPerBulan && nominalBulan) {
            const totalNominal = hargaPerBulan * nominalBulan;
            form.setFieldsValue({ amount: totalNominal });
        } else {
            form.setFieldsValue({ amount: 0 });
        }
    }, [jenisPembayaran, nominalBulan, form]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const penghuniResponse = await axios.get('http://127.0.0.1:8000/api/residents');
                setResidents(penghuniResponse.data);
            } catch (error) {
                console.error('Gagal fetch data:', error);
            }
        };
    
        fetchData();
    }, []);

    const handleSubmit = async (values) => {
        const payload = {
            resident_id: values.resident_id,
            payment_type: values.payment_type,
            month: values.month,
            amount: values.amount,
            payment_date: values.payment_date.format('YYYY-MM-DD'),
            month_period: values.month_period,
            year_period: values.year_period,
        };

        console.log('Payload:', payload);
    
        try {
            await axios.post('http://127.0.0.1:8000/api/payments', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchPembayaran();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Gagal tambah pembayaran:', error.response?.data || error.message);
        }
    };
    

    return (
        <Modal
            title="Tambah Pembayaran"
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
            okText="Simpan"
            cancelText="Batal"
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>

                <Form.Item name="resident_id" label="Penghuni" rules={[{ required: true }]}>
                    <Select placeholder="Pilih penghuni">
                    {residents.map((resident) => (
                        <Select.Option key={resident.resident_id} value={resident.resident_id}>
                        {resident.resident_fullname}
                        </Select.Option>
                    ))}
                    </Select>
                </Form.Item>
                
                <Form.Item label="Jenis Pembayaran" name="payment_type" rules={[{ required: true, message: 'Pilih jenis pembayaran' }]}>
                    <Select placeholder="Pilih jenis pembayaran">
                        <Select.Option value="Kebersihan">Kebersihan</Select.Option>
                        <Select.Option value="Satpam">Satpam</Select.Option>
                    </Select>
                </Form.Item>
                
                <Form.Item label="Nominal Bulan" name="month" rules={[{ required: true, message: 'Masukkan nominal bulan' }]}>
                    <InputNumber min={1} max={12} placeholder="Masukkan jumlah bulan" style={{ width: '100%' }} />
                </Form.Item>
                
                <Form.Item label="Nominal (Rp)" name="amount" rules={[{ required: true, message: 'Masukkan nominal (Rp)' }]}>
                    <Input disabled />
                </Form.Item>

                <Form.Item name="payment_date" label="Tanggal Pembayaran" rules={[{ required: true }]}>
                    <DatePicker />
                </Form.Item>

                <Form.Item label="Periode Bulan" name="month_period" rules={[{ required: true, message: 'Masukkan periode bulan' }]}>
                    <InputNumber placeholder="Masukkan periode bulan dalam angka" style={{ width: '100%' }}/>
                </Form.Item>
            
                <Form.Item label="Periode Tahun" name="year_period" rules={[{ required: true, message: 'Masukkan periode tahun' }]}>
                    <InputNumber style={{ width: '100%' }}/>
                </Form.Item>
            
            </Form>
        </Modal>
    );
}
