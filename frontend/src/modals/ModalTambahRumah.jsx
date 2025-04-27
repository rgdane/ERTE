import { Modal, Form, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function ModalTambahRumah({ isModalOpen, setIsModalOpen, fetchRumah }) {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        console.log('Form Values:', values);
    
        const formData = new FormData();
        formData.append('house_address', values.house_address);
        formData.append('is_occupied', values.is_occupied);
    
        try {
            await axios.post('http://127.0.0.1:8000/api/houses', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchRumah();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Gagal tambah rumah:', error.response.data);
        }
    };

    return (
        <Modal
            title="Tambah Rumah"
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
            okText="Simpan"
            cancelText="Batal"
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="house_address" label="Alamat" rules={[{ required: true, message: 'Masukkan alamat!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="is_occupied" label="Status Huni" rules={[{ required: true, message: 'Pilih status huni!' }]}>
                    <Select placeholder="Pilih status tinggal">
                        <Select.Option value={1}>Dihuni</Select.Option>
                        <Select.Option value={0}>Tidak Dihuni</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}
