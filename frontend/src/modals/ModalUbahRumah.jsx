import { useEffect } from 'react';
import { Modal, Form, Input, Select} from 'antd';

export default function ModalUbahRumah({ isModalOpen, handleCancel, editingData, handleUpdate }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingData) {
            form.setFieldsValue({
                house_address: editingData.house_address,
                is_occupied: editingData.is_occupied,
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
        title="Ubah Data Rumah"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
    >
        <Form form={form} layout="vertical">
            <Form.Item label="Nama Lengkap" name="house_address" rules={[{ required: true, message: 'Masukkan alamat' }]}>
            <Input />
            </Form.Item>
            <Form.Item label="Status Tinggal" name="is_occupied" rules={[{ required: true, message: 'Pilih status huni' }]}>
            <Select placeholder="Pilih status tinggal">
                <Select.Option value={1}>Dihuni</Select.Option>
                <Select.Option value={0}>Tidak Dihuni</Select.Option>
            </Select>
            </Form.Item>
        </Form>
        </Modal>
    );
}
