import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { getBaseUrl } from '../../../config';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(getBaseUrl('/allUser'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const result = await response.json();
      console.log(result); // Cek apakah result.data itu array atau objek

      if (response.ok && Array.isArray(result.data)) {
        setUsers(
          result.data.map((item) => ({
            key: item.email,
            ...item,
          }))
        );
      } else {
        message.error(result.message || "Failed to fetch users");
      }

    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Something went wrong while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    // {
    //   title: 'Created At',
    //   dataIndex: 'created_at',
    //   key: 'created_at',
    // },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       {/* <a>View {record.name}</a> */}
    //       <a>Delete</a>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div style={{ minHeight: "90vh", padding: "50px", backgroundColor: "#F2F9FF" }}>
      <h1 className="title">List User</h1>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        scroll={{ x: "max-content", y: 400 }} // 400 bisa diganti sesuai kebutuhan
      />
    </div>
  );
};

export default Admin;