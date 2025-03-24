import Layout from '@components/Layout';
import UsersList from '@/App/components/UsersList';
import { useEffect, useState } from 'react';
import { userService } from '@api/services';
import { ApiUser } from '@api/schema';
import UserForm from '@/App/components/UserForm';
import Header from '@components/Header';
import {
  useEditUserMutation,
  useGetUserByIdQuery,
  useGetUsersInfiniteQuery,
} from '@/store/features/api/apiSlice';

function App() {
  const [userId, setUserId] = useState<string>('');
  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
  } = useGetUserByIdQuery(userId!, { skip: !userId });
  const { data: users, isLoading, isFetching, refetch } = useGetUsersInfiniteQuery();
  const [editUser] = useEditUserMutation();
  return (
    <Layout
      sidebar={
        <UsersList
          value={userId}
          onSelectValue={(value) => setUserId(value)}
          users={users?.pages[0]}
        />
      }
    >
      <div style={{ padding: ' 0 2rem' }}>
        {isUserError && 'Error'}
        {isUserLoading && 'loading..'}
        {isUserSuccess && (
          <Header title={`${user?.firstName} ${user?.lastName}`} subtitle={user?.company} />
        )}
        {isUserSuccess && (
          <UserForm value={user} onSubmitValue={(value) => editUser({ id: userId, ...value })} />
        )}
      </div>
    </Layout>
  );
}

export default App;
