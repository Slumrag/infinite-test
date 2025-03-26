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
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    getUsers: builder.infiniteQuery<UserEntity, void, UsersInitialPageParam>({
      infiniteQueryOptions: {
        initialPageParam: {
          offset: 0,
          limit: 100,
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const nextOffset = lastPageParam.offset + lastPageParam.limit;

          const totalCount = 1_000_000;
          if (totalCount - nextOffset <= 0) {
            return undefined;
          }
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
      transformResponse: (response: ApiUser[]) => {
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

type GetPostSelectFromResultArg = TypedUseQueryStateResult<
  InfiniteData<UserEntity, UsersInitialPageParam>,
  unknown,
  BaseQueryFn
>;

export const selectAllUsersFromResult = createSelector(
  (res: GetPostSelectFromResultArg) => res.data,
  (data) => {
    const list =
      data?.pages.reduce(
        (acc, cur) => [...acc, ...Object.values(cur.entities)],
        [] as SimplifiedUser[]
      ) ?? [];
    return list;
  }
);

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors();

export const {
  useGetUsersInfiniteQuery,
  useLazyGetUserByIdQuery,
  useGetUserByIdQuery,
  useEditUserMutation,
} = apiSlice;
