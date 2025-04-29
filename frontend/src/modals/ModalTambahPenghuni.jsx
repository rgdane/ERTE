import { Modal, Form, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function ModalTambahPenghuni({ isModalOpen, setIsModalOpen, fetchPenghuni }) {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        console.log('Form Values:', values);
    
        const formData = new FormData();
        formData.append('resident_fullname', values.resident_fullname);
        formData.append('resident_phone', values.resident_phone);
        formData.append('is_permanent', values.is_permanent);
        formData.append('is_married', values.is_married);
        formData.append('is_married', values.is_active);
    
        // cek ada file atau tidak
        if (values.resident_id_card && values.resident_id_card.file) {
            formData.append('resident_id_card', values.resident_id_card.file);
        }
    
        try {
            await axios.post('http://127.0.0.1:8000/api/residents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchPenghuni();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Gagal tambah penghuni:', error.response.data);
        }
    };

    return (
        <Modal
            title="Tambah Penghuni"
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
            okText="Simpan"
            cancelText="Batal"
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="resident_fullname" label="Nama Lengkap" rules={[{ required: true, message: 'Masukkan nama lengkap!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="resident_phone" label="Nomor Telepon" rules={[{ required: true, message: 'Masukkan nomor telepon!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="is_permanent" label="Status Tinggal" rules={[{ required: true, message: 'Pilih status tinggal!' }]}>
                    <Select placeholder="Pilih status tinggal">
                        <Select.Option value={1}>Tetap</Select.Option>
                        <Select.Option value={0}>Kontrak</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="is_married" label="Status Pernikahan" rules={[{ required: true, message: 'Pilih status pernikahan!' }]}>
                    <Select placeholder="Pilih status pernikahan">
                        <Select.Option value={1}>Menikah</Select.Option>
                        <Select.Option value={0}>Belum Menikah</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Status Aktivasi" name="is_active" rules={[{ required: true, message: 'Pilih status aktivasi' }]}>
                    <Select placeholder="Pilih status aktivasi">
                        <Select.Option value={1}>Aktif</Select.Option>
                        <Select.Option value={0}>Nonaktif</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="resident_id_card" label="Upload Foto KTP" valuePropName="file" getValueFromEvent={(e) => e}>
                    <Upload beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Pilih File</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
}
