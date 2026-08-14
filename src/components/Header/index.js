import React, { useEffect, useState } from "react";
import { Modal, List, notification, Popover } from 'antd';
import { Link, useNavigate } from "react-router-dom";


import useLocalData from "../../core/hook/useLocalData";
import cookie from "../../core/helpers/cookie";
import "./style.css";
import { getBaseUrl } from "../../config";


function Header() {
  const { store, dispatch } = useLocalData();
  const userData = store.userData;
  const navigate = useNavigate()
  const [notif, setNotif] = useState()

  console.log("header cuy", userData)

  function handleLogout() {
    Modal.confirm({
      title: 'Logout',
      content: 'Apakah Anda yakin ingin logout?',
      okText: 'Ya',
      cancelText: 'Batal',
      onOk: () => {
        cookie.del('user');
        dispatch({ type: 'update', value: null, name: 'userData' });
        // goOffline(firebaseDB)

        navigate('/login');
      },
    })
  }

  function handleLogin() {
    navigate("/login")
  }

  const [api, contextHolder] = notification.useNotification();

  const cookieUser = cookie.get("user");
  const cookieUserId = cookieUser?.id || cookieUser?.user_id;

  useEffect(() => {
    const getNotificationList = async () => {
      if (!cookieUserId) return;
      const response = await fetch(getBaseUrl(`/notification/${cookieUserId}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setNotif(result);
    };

    getNotificationList();
  }, [cookieUserId]);

  useEffect(() => {
    if (store.notification) {
      api.info({
        message: 'Reminder',
        description: store.notification.message,
      });
    }
  }, [store.notification, api]);
  return (
    <header>
      {contextHolder}
      <nav className="navbar">
        <img src="image/logoapp.jpg" alt="Logo" className="logo" />
        <p>Health Mate</p>
        <div className="nav-links">
          {userData ? (
            <>
              <Popover content={<List
                className="demo-loadmore-list"
                // loading={initLoading}
                itemLayout="horizontal"
                // loadMore={loadMore}
                dataSource={notif}
                renderItem={(item) => (
                  <List.Item
                    actions={[<a key="list-loadmore-edit" href="#!">edit</a>, <a key="list-loadmore-more" href="#!">more</a>]}
                  >
                    <List.Item.Meta
                      // avatar={<Avatar src={item.picture.large} />}
                      title={<a href="https://ant.design">{item.name?.last}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />} title="Title" trigger="click">
                {/* <Badge
                  className="site-badge-count-109"
                  // count={10}
                  style={{ backgroundColor: '#52c41a' }}
                >
                  <Button size="small" shape="circle" icon={<BellOutlined />} />

                </Badge> */}
              </Popover>

              {
                Number(userData?.user_id) !== 1 && (
                  <>
                    <Link to="/dashboard">Home</Link>
                    <Link to="/profile">Profile</Link>
                  </>
                )
              }

              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={handleLogin}>Login</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
