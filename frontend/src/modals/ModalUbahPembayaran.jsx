import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

export default function ModalUbahPembayaran({ isModalOpen, handleCancel, editingData, handleUpdate }) {
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

    useEffect(() => {
        if (editingData) {
            form.setFieldsValue({
                resident_id: editingData.resident_id,
                payment_type: editingData.payment_type,
                month: editingData.month,
                amount: editingData.amount,
                payment_date: editingData.payment_date ? dayjs(editingData.payment_date) : '',
                month_period: editingData.month_period,
                year_period: editingData.year_period,
            });
        }
    }, [editingData, form]);

    const handleSubmit = async () => {
        try {
        const values = await form.validateFields();
        handleUpdate(values); // kirim ke parent
        } catch (error) {
        console.error('Gagal submit:', error);
        }
    };

    return (
    <Modal
        title="Ubah Data Pembayaran"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
    >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>

            <Form.Item name="payment_date" label="Tanggal Pembayaran" rules={[{ required: false }]}>
                <DatePicker />
            </Form.Item>

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

        </Form>
    </Modal>
    );
}
