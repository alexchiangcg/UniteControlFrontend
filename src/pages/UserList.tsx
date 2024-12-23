import React, { useEffect } from "react";
import { List, Card, Typography } from "antd";
import Header from "../components/Header";
import { useGetUsersQuery } from "../services/userListServices";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setUsers } from "../slices/userSlice";

const { Title } = Typography;

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.userReducer.users);
  const { data, isLoading } = useGetUsersQuery();

  useEffect(() => {
    if (data) {
      dispatch(setUsers(data));
    }
  }, [data, dispatch]);


  return (
    <>
      <Header />
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <Title level={2}>使用者列表</Title>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={users}
          renderItem={(item) => {
            const { id, username, email } = item;
            return (
              <List.Item key={id}>
                <Card
                  loading={isLoading}
                  title={username}
                  bordered
                  hoverable
                  className="w-full max-w-md mx-auto shadow-md rounded-lg"
                >
                  <p className="text-gray-700">
                    <strong>Email:</strong> {email}
                  </p>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </>
  );
};

export default UserList;
