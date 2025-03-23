import Layout from '@components/Layout';
import UsersList from '@components/UsersList';
import { useEffect, useState } from 'react';
import { userService } from '@api/services';
import { ApiUser } from '@api/schema';
import UserForm from '@components/UserForm';
import Header from '@components/Header';

function App() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userService.get({ size: 50 });
      setUsers(response.data);
    };
    fetchUsers();
  }, []);
  const [user, setUser] = useState<ApiUser>({} as ApiUser);

  return (
    <Layout
      sidebar={<UsersList value={user} onSelectValue={(value) => setUser(value)} users={users} />}
    >
      {user?.id && (
        <div style={{ padding: ' 0 2rem' }}>
          <Header title={`${user.firstName} ${user.lastName}`} subtitle={user.company} />
          <UserForm value={user as ApiUser}></UserForm>
        </div>
      )}
    </Layout>
  );
}

export default App;
