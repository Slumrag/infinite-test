import Layout from '@components/Layout';
import UsersList from '@components/UsersList';
import { useEffect, useState } from 'react';
import { userService } from '@api/services';
import { ApiUser } from '@api/schema';

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
    ></Layout>
  );
}

export default App;
