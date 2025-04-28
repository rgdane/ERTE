import { Modal, Form, Input, Select, Upload, Button, DatePicker, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function ModalTambahPengeluaran({ isModalOpen, setIsModalOpen, fetchPengeluaran }) {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const payload = {
            expense_type: values.expense_type,
            expense_description: values.expense_description,
            amount: values.amount,
            expense_date: values.expense_date.format('YYYY-MM-DD'),
            month_period: values.month_period,
            year_period: values.year_period,
        };

        console.log('Payload:', payload);
    
        try {
            await axios.post('http://127.0.0.1:8000/api/expenses', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchPengeluaran();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Gagal tambah pembayaran:', error.response?.data || error.message);
        }
    };
    

    return (
        <Modal
            title="Tambah Riwayat Penghuni"
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
            okText="Simpan"
            cancelText="Batal"
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                
                <Form.Item label="Jenis Pengeluaran" name="expense_type" rules={[{ required: true, message: 'Pilih jenis pembayaran' }]}>
                    <Select placeholder="Pilih jenis pembayaran">
                        <Select.Option value="Kebersihan">Kebersihan</Select.Option>
                        <Select.Option value="Satpam">Satpam</Select.Option>
                        <Select.Option value="Lainnya">Lainnya</Select.Option>
                    </Select>
                </Form.Item>
                
                <Form.Item label="Deskripsi" name="expense_description" rules={[{ required: false, message: 'Masukkan deskripsi' }]}>
                    <Input/>
                </Form.Item>
                
                <Form.Item label="Nominal (Rp)" name="amount" rules={[{ required: true, message: 'Masukkan nominal (Rp)' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="expense_date" label="Tanggal Pengeluaran" rules={[{ required: true }]}>
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
