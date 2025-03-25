import Layout from '@components/Layout';
import UsersList from '@/App/components/UsersList';
import { useEffect, useState } from 'react';
import UserForm from '@/App/components/UserForm';
import Header from '@components/Header';
import {
  selectAllUsersFromResult,
  useEditUserMutation,
  useGetUsersInfiniteQuery,
  useLazyGetUserByIdQuery,
} from '@/store/features/api/apiSlice';

function App() {
  const [userId, setUserId] = useState<string>('');
  const [
    trigger,
    { data: user, isLoading: isUserLoading, isSuccess: isUserSuccess, isError: isUserError },
  ] = useLazyGetUserByIdQuery();

  useEffect(() => {
    if (userId) {
      trigger(userId);
    }
  }, [trigger, userId]);

  const [editUser] = useEditUserMutation();
  const { data, isSuccess, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUsersInfiniteQuery(undefined, {
      selectFromResult: (result) => {
        return {
          ...result,
          data: selectAllUsersFromResult(result),
        };
      },
    });
  return (
    <Layout
      sidebar={
        <>
          {isSuccess && (
            <UsersList
              hasNextPage={hasNextPage}
              list={data!}
              isNextPageLoading={isFetchingNextPage}
              value={userId}
              onSelectValue={setUserId}
              loadNextPage={() => fetchNextPage()}
            />
          )}
        </>
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
