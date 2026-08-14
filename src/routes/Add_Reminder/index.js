import React, { useState } from "react";
import { Form, Input, Button, DatePicker, TimePicker, Row, Col, Layout, Modal } from "antd";
import { useNavigate } from 'react-router-dom';
import moment from "moment";
import cookie from '../../core/helpers/cookie';
import "./style.css";
import { getBaseUrl } from "../../config";

const { TextArea } = Input;
const { Content } = Layout;

function AddReminder() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function onFinish(values) {
        console.log(values);

        const userCookie = cookie.get('user');
        console.log("User Cookie:", userCookie);
        if (!userCookie) {
            Modal.error({
                title: "Error",
                content: "User not found. Please log in again.",
            });
            return;
        }

        let user;

        try {
            user = JSON.parse(userCookie);
            console.log("Parsed User:", user);
        } catch (error) {
            console.error("Error parsing user cookie:", error);
            Modal.error({
                title: "Error",
                content: "Failed to retrieve user information. Please log in again.",
            });
            return;
        }

        const userId = user.user_id || (user.user && user.user.user_id);
        if (!userId) {
            Modal.error({
                title: "Error",
                content: "User ID not found. Please log in again.",
            });
            return;
        }
        console.log("User ID:", userId);

        const reminderTime = values.reminder_time.format("HH:mm:ss");
        const formattedReminderTime = `${reminderTime}`;

        const payload = {
            medicine_name: values.medicine_name,
            dosage: values.dosage,
            frequency: values.frequency,
            start_date: values.start_date[0].format("YYYY-MM-DD"),
            end_date: values.start_date[1].format("YYYY-MM-DD"),
            reminder_time: formattedReminderTime,
            description: values.description,
            user_id: userId,
        };

        console.log("Payload yang akan dikirim:", payload);

        setLoading(true)

        try {
            const response = await fetch(getBaseUrl('/reminder'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response:", data);

            Modal.success({
                title: "Success",
                content: "Reminder berhasil disimpan!",
                onOk: () => navigate('/check-schedule'),
            });
        } catch (error) {
            setLoading(false)

            console.error("Error:", error);
            Modal.error({
                title: "Error",
                content: "Gagal menyimpan reminder.",
            });
        }
    }

    const disabledDate = (current, selectedDates) => {      
        if (!selectedDates || selectedDates.length === 0) {      
            return current && current < moment().startOf("day");      
        }      
    };

    function cancelBtn() {
        navigate('/dashboard');
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Content style={{ backgroundColor: "#F2F9FF" }}>
                <div className="add-reminder-container">
                    <h1 className="title">Atur Jadwal Minum Obat</h1>
                    <Form layout="vertical" onFinish={onFinish} form={form} className="form-container">
                        <Row gutter={[16, 16]} justify="center">
                            <Col xs={24} md={12}>
                                <Form.Item
                                    disabled={loading}
                                    label="Nama Obat"
                                    name="medicine_name"
                                    rules={[{ required: true, message: "Silakan masukkan nama obat" }]}
                                >
                                    <Input placeholder="Nama Obat" />
                                </Form.Item>

                                <Form.Item
                                    disabled={loading}
                                    label="Dosis"
                                    name="dosage"
                                    rules={[{ required: true, message: "Silakan masukkan dosis" }]}
                                >
                                    <Input placeholder="Dosis" />
                                </Form.Item>

                                <Form.Item
                                    disabled={loading}
                                    label="Deskripsi Penggunaan"
                                    name="description"
                                    rules={[{ required: true, message: "Silakan masukkan deskripsi" }]}
                                >
                                    <TextArea placeholder="Deskripsi Penggunaan" rows={4} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    disabled={loading}
                                    label="Frekuensi"
                                    name="frequency"
                                    rules={[{ required: true, message: "Silakan masukkan frekuensi" }]}
                                >
                                    <Input placeholder="3 kali sehari" />
                                </Form.Item>

                                <Form.Item
                                    disabled={loading}
                                    label="Waktu"
                                    name="reminder_time"
                                    rules={[{ required: true, message: "Silakan pilih waktu" }]}
                                >
                                    <TimePicker format={"HH:mm"} style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item
                                    disabled={loading}
                                    label="Rentang Tanggal"
                                    name="start_date"
                                    rules={[{ required: true, message: "Silakan pilih rentang tanggal" }]}
                                >
                                    <DatePicker.RangePicker disabledDate={(current) => disabledDate(current, form.getFieldValue("start_date"))} style={{ width: "100%" }} format={"YYYY-MM-DD"} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item className="button-group">
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Simpan
                            </Button>
                            <Button htmlType="button" color="primary" variant="outlined" onClick={cancelBtn}>
                                Batal
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
}

export default AddReminder;    
