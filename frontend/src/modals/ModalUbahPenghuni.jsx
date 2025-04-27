import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function ModalUbahPenghuni({ isModalOpen, handleCancel, editingData, handleUpdate }) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (editingData) {
        form.setFieldsValue({
            resident_fullname: editingData.resident_fullname,
            resident_phone: editingData.resident_phone,
            is_permanent: editingData.is_permanent,
            is_married: editingData.is_married,
        });

        if (editingData.resident_id_card) {
            setFileList([
            {
                uid: '-1',
                name: 'KTP',
                status: 'done',
                url: `http://127.0.0.1:8000/storage/${editingData.resident_id_card}`, // sesuaikan path storage Laravel kamu
            },
            ]);
        } else {
            setFileList([]);
        }
        }
    }, [editingData, form]);

    const handleSubmit = async () => {
        try {
        const values = await form.validateFields();
        values.resident_id_card = fileList[0]?.originFileObj || null; // ambil file baru kalau ada
        handleUpdate(values); // kirim ke parent
        } catch (error) {
        console.error('Gagal submit:', error);
        }
    };

    const uploadProps = {
        onRemove: () => {
        setFileList([]);
        },
        beforeUpload: (file) => {
        setFileList([file]); // langsung replace file lama
        return false; // prevent upload otomatis
        },
        fileList,
    };

    return (
    <Modal
        title="Ubah Data Penghuni"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
    >
        <Form form={form} layout="vertical">
            <Form.Item label="Nama Lengkap" name="resident_fullname" rules={[{ required: true, message: 'Masukkan nama lengkap' }]}>
            <Input />
            </Form.Item>
            <Form.Item label="Telepon" name="resident_phone" rules={[{ required: true, message: 'Masukkan nomor telepon' }]}>
            <Input />
            </Form.Item>
            <Form.Item label="Status Tinggal" name="is_permanent" rules={[{ required: true, message: 'Pilih status tinggal' }]}>
            <Select placeholder="Pilih status tinggal">
                <Select.Option value={1}>Tetap</Select.Option>
                <Select.Option value={0}>Kontrak</Select.Option>
            </Select>
            </Form.Item>
            <Form.Item label="Status Pernikahan" name="is_married" rules={[{ required: true, message: 'Pilih status pernikahan' }]}>
            <Select placeholder="Pilih status pernikahan">
                <Select.Option value={1}>Menikah</Select.Option>
                <Select.Option value={0}>Belum Menikah</Select.Option>
            </Select>
            </Form.Item>
            <Form.Item label="Foto KTP">
            <Upload {...uploadProps} listType="picture">
                <Button icon={<UploadOutlined />}>Upload KTP</Button>
            </Upload>
            </Form.Item>
        </Form>
        </Modal>
    );
}
