import { ApiUser } from '@/api/schema';
import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
  InfiniteData,
  TypedUseQueryStateResult,
} from '@reduxjs/toolkit/query/react';

export type ApiUserPatch = Pick<ApiUser, 'id'> & Partial<Omit<ApiUser, 'id'>>;
export type UsersInitialPageParam = {
  offset: number;
  limit: number;
  total: number;
};
export type SimplifiedUser = Pick<ApiUser, 'id'> & { fullName: string };

const usersAdapter = createEntityAdapter<SimplifiedUser>();
const initialState = usersAdapter.getInitialState();
const simplifiedUserAdapter = ({ id, firstName, lastName }: ApiUser): SimplifiedUser => ({
  id,
  fullName: `${firstName} ${lastName}`,
});
export type UserEntity = EntityState<SimplifiedUser, string>;

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['User'],
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),

  endpoints: (builder) => ({
    getUserById: builder.query<ApiUser, string>({
      query: (id) => `/users/${id}`,
    }),
    getUsers: builder.infiniteQuery<UserEntity, void, UsersInitialPageParam>({
      infiniteQueryOptions: {
        initialPageParam: {
          offset: 1_000_000 - 30,
          limit: 20,
          total: 0,
        },

        getNextPageParam: (lastPage, allPages, lastPageParam, allPagesParam) => {
          const nextOffset = lastPageParam.offset + lastPageParam.limit;

          return {
            ...lastPageParam,
            offset: nextOffset,
          };
        },
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
          const prevOffset = firstPageParam.offset - firstPageParam.limit;
          if (prevOffset < 0) return undefined;

          return {
            ...firstPageParam,
            offset: prevOffset,
          };
        },
      },

      query: ({ pageParam: { offset, limit } }) => `/users?_start=${offset}&_limit=${limit}`,
      transformResponse: (response: ApiUser[], meta) => {
        // const total = meta?.response?.headers.get('X-Total-Count');
        const simplified = response.map(simplifiedUserAdapter);
        return usersAdapter.setAll(initialState, simplified);
      },
    }),

    editUser: builder.mutation<ApiUser, ApiUserPatch>({
      query(data) {
        const { id, ...body } = data;
        return { url: `/users/${id}`, method: 'PATCH', body };
      },

      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],

      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedUser } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData('getUserById', id, (draft) => {
              Object.assign(draft, updatedUser);
            })
          );
          dispatch(
            apiSlice.util.updateQueryData('getUsers', undefined, (draft) => {
              const updatedPageIndex = draft.pages.findIndex((el) => el.entities[id]);

              const updatedPage = usersAdapter.setOne(
                draft.pages[updatedPageIndex],
                simplifiedUserAdapter(updatedUser)
              );

              draft.pages[updatedPageIndex] = updatedPage;
            })
          );
        } catch {
          /* empty */
        }
      },
    }),
  }),
});

export const selectUsersResult = apiSlice.endpoints.getUsers.select();

// const selectUsersData = createSelector(selectUsersResult, (result) => result.data ?? initialState);

type GetPostSelectFromResultArg = TypedUseQueryStateResult<
  InfiniteData<UserEntity, UsersInitialPageParam>,
  unknown,
  BaseQueryFn
>;

export const selectAllUsersFromResult = createSelector(
  (res: GetPostSelectFromResultArg) => res.data,
  (data) => data?.pages.map((el) => Object.values(el.entities)).flat() ?? []
);

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors();

export const {
  useGetUsersInfiniteQuery,
  useLazyGetUserByIdQuery,
  useGetUserByIdQuery,
  useEditUserMutation,
} = apiSlice;
