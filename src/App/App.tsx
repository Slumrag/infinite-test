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
    triggerUserById,
    { data: user, isLoading: isUserLoading, isSuccess: isUserSuccess, isError: isUserError },
  ] = useLazyGetUserByIdQuery();

  useEffect(() => {
    if (userId) {
      triggerUserById(userId);
    }
  }, [triggerUserById, userId]);

  const [editUser, { isLoading: isUserMutating }] = useEditUserMutation();
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
      <>
        {isUserError && 'Error'}
        {isUserLoading && 'загрузка...'}
        {isUserSuccess && (
          <div style={{ marginBottom: '2rem' }}>
            <Header title={`${user?.firstName} ${user?.lastName}`} subtitle={user?.company} />
          </div>
        )}
        <div style={{ padding: ' 0 2rem' }}>
          {isUserSuccess && (
            <div style={{ maxWidth: 400 }}>
              <UserForm
                value={user}
                loading={isUserMutating}
                onSubmitValue={(value) => {
                  editUser({ id: userId, ...value });
                }}
              />
            </div>
          )}
        </div>
      </>
    </Layout>
  );
}

export default App;
