import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

export default function ModalUbahRiwayatPenghuni({ isModalOpen, handleCancel, editingData, handleUpdate }) {
    const [form] = Form.useForm();
    const [houses, setHouses] = useState([]);
    const [residents, setResidents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rumahResponse = await axios.get('http://127.0.0.1:8000/api/houses');
                setHouses(rumahResponse.data);
    
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
                house_id: editingData.house_id,
                resident_id: editingData.resident_id,
                start_date: editingData.start_date ? dayjs(editingData.start_date) : null,
                end_date: editingData.end_date ? dayjs(editingData.end_date) : '',
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
        title="Ubah Data Riwayat Penghuni"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
    >
        <Form form={form} layout="vertical">
            <Form.Item name="house_id" label="Alamat" rules={[{ required: true }]}>
                    <Select placeholder="Pilih alamat rumah">
                    {houses.map((house) => (
                        <Select.Option key={house.house_id} value={house.house_id}>
                        {house.house_address}
                        </Select.Option>
                    ))}
                    </Select>
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
                
                <Form.Item name="start_date" label="Tanggal Mulai" rules={[{ required: true, message: 'Masukkan tanggal mulai!' }]}>
                    <DatePicker />
                </Form.Item>

                <Form.Item name="end_date" label="Tanggal Berakhir" rules={[{ required: false }]}>
                    <DatePicker />
                </Form.Item>
        </Form>
        </Modal>
    );
}
