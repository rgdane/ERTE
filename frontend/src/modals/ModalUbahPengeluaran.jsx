import { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber} from 'antd';
import dayjs from 'dayjs';

export default function ModalUbahPengeluaran({ isModalOpen, handleCancel, editingData, handleUpdate }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingData) {
            form.setFieldsValue({
                expense_type: editingData.expense_type,
                expense_description: editingData.expense_description,
                amount: editingData.amount,
                expense_date: editingData.expense_date ? dayjs(editingData.expense_date) : null,
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
        title="Ubah Data Pengeluaran"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
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

            <Form.Item name="expense_date" label="Tanggal Pengeluaran" rules={[{ required: false }]}>
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
