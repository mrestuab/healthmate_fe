import { React, useEffect, useState } from "react";
import { Button, Table, Layout } from "antd";
import { useNavigate } from "react-router-dom";

import cookie from "../../core/helpers/cookie";
import "./style.css";
import { getBaseUrl } from "../../config";

const { Content } = Layout;

function CheckRecords() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReminders() {
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

        const response = await fetch(getBaseUrl(`/reminder/history/${userId}`), {
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
        return data.data;
      } catch (error) {
        console.error("Error fetching reminders:", error);
        return [];
      }
    }

    async function fetchData() {
      setLoading(true);
      const data = await fetchReminders().finally(() => setLoading(false));
      setReminders(
        data.map((item) => ({
          key: item.id_reminder,
          medicine_name: item.medicine_name,
          reminder_time: item.reminder_time,
          start_date: item.start_date,
          end_date: item.end_date,
          description: item.description,
        }))
      );
    }

    fetchData();
  }, [navigate]);

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
  ];

  function handleBack() {
    navigate("/dashboard");
  }

  return (
    <Content style={{ minHeight: "90vh", padding: "50px", backgroundColor: "#F2F9FF" }}>
      <div className="records">
        <h1>Riwayat Reminder</h1>
        <Table loading={loading} dataSource={reminders} columns={columns} scroll={{ x: "max-content" }} />
        <Button style={{ marginTop: "20px" }} color="primary" variant="filled" onClick={handleBack}>
          Back
        </Button>
      </div>
    </Content>
  );
}

export default CheckRecords;
