import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Modal, Layout } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import cookie from "../../core/helpers/cookie";
import Update from "./component/Update";
import { getBaseUrl } from "../../config";
const { Content } = Layout;

function CheckSchedule() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReminders = useCallback(async () => {
    const userCookie = cookie.get("user");
    if (!userCookie) {
      console.error("User data tidak ditemukan di cookie");
      navigate("/login");
      return [];
    }

    try {
      const user = JSON.parse(userCookie);
      const userId = user.user_id;

      if (!userId) {
        console.error("User ID tidak ditemukan dalam cookie");
        navigate("/login");
        return [];
      }

      setLoading(true)
      const response = await fetch(getBaseUrl(`/reminder?user_id=${userId}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reminders");
      }

      const data = await response.json();
      console.log("Reminders:", data.data);
      setLoading(false)

      return data.data;
    } catch (error) {
      setLoading(false)

      console.error("Error fetching reminders:", error);
      return [];
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    const data = await fetchReminders();
    setReminders(
      data.map((item) => ({
        key: item.id_reminder,
        dosage: item.dosage,
        frequency: item.frequency,
        medicine_name: item.medicine_name,
        reminder_time: item.reminder_time,
        start_date: item.start_date,
        end_date: item.end_date,
        description: item.description,
      }))
    );
  }, [fetchReminders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showDeleteModal = (record) => {
    setRecordToDelete(record);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteReminder(recordToDelete.key);
      setReminders(reminders.filter(item => item.key !== recordToDelete.key));
      setIsModalVisible(false);
      setLoading(false)
    } catch (error) {
      setLoading(false)

      console.error("Failed to delete reminder:", error);
    }
  };

  async function deleteReminder(id) {
    try {
      const response = await fetch(getBaseUrl(`/reminder/${id}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete reminder");
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  const showEditModal = (record) => {
    setRecordToUpdate(record);
    setIsEditModalVisible(true);
  };

  const handleUpdate = (updatedReminder) => {
    setIsEditModalVisible(false);
    fetchData()
  };

  const columns = [
    {
      title: "Drug Name",
      dataIndex: "medicine_name",
      key: "medicine_name",
    },
    {
      title: "Reminder Time",
      dataIndex: "reminder_time",
      key: "reminder_time",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            color="danger"
            variant="dashed"
            className="mr-4"
            onClick={() => showDeleteModal(record)}
          >
            <DeleteOutlined />
          </Button>
          <Button
            color="primary"
            variant="dashed"
            className="btn-sm btn-faint-primary ml-4"
            onClick={() => showEditModal(record)}
          >
            <EditOutlined />
          </Button>
        </div>
      ),
    },
  ];

  function handleBack() {
    navigate("/dashboard")
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px", backgroundColor: "#F2F9FF" }}>
        <h1 className="title">Jadwal Minum Obat</h1>
        <Table
          loading={loading}
          columns={columns}
          dataSource={reminders}
          scroll={{ x: "max-content" }}
        />
        <Button color="primary" variant="filled" onClick={handleBack}>
          Back
        </Button>
        <Modal
          title="Hapus"
          visible={isModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsModalVisible(false)}
          okText="Ya"
          cancelText="Batal"
        >
          <p>Apakah anda yakin ingin menghapus pengingat?</p>
        </Modal>
        <Modal
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
        >
          {recordToUpdate && <Update reminder={recordToUpdate} onUpdate={handleUpdate} />}
        </Modal>
      </Content>
    </Layout>
  );
}

export default CheckSchedule;  
