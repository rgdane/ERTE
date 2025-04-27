import { Modal, Form, Input, Select, Upload, Button, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Rumah from '../pages/Rumah';
import Penghuni from '../pages/Penghuni';
import { useEffect, useState } from 'react';

export default function ModalTambahRiwayatPenghuni({ isModalOpen, setIsModalOpen, fetchRiwayatPenghuni }) {
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

    const handleSubmit = async (values) => {
        const payload = {
            house_id: values.house_id,
            resident_id: values.resident_id,
            start_date: values.start_date.format('YYYY-MM-DD'),
            end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : '',
        };

        console.log('Payload:', payload);
    
        try {
            await axios.post('http://127.0.0.1:8000/api/resident-histories', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchRiwayatPenghuni();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Gagal tambah riwayat penghuni:', error.response?.data || error.message);
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
