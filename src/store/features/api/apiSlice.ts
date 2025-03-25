import { ApiUser } from '@/api/schema';
import { createSelector } from '@reduxjs/toolkit';
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
    getUsers: builder.infiniteQuery<SimplifiedUser[], void, UsersInitialPageParam>({
      infiniteQueryOptions: {
        initialPageParam: {
          offset: 0,
          limit: 20,
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const nextOffset = lastPageParam.offset + lastPageParam.limit;
          // const remainingItems = lastPage?.length - nextOffset;

          // if (remainingItems <= 0) {
          //   return undefined;
          // }

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
        return response.map(({ id, firstName, lastName }) => ({
          id,
          fullName: `${firstName} ${lastName}`,
        }));
      },
      // providesTags: (result, error,) =>
      //   result
      //     ? [
      //         ...result.pages.map(({ id }) => ({
      //           type: 'User' as const,
      //           id,
      //         })),
      //         'User',
      //       ]
      //     : ['User'],
    }),

    editUser: builder.mutation<ApiUser, ApiUserPatch>({
      query(data) {
        const { id, ...body } = data;
        return { url: `/users/${id}`, method: 'PATCH', body };
      },

      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],

      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedUser } = await queryFulfilled;
          const patchResult = dispatch(
            apiSlice.util.updateQueryData('getUserById', id, (draft) => {
              Object.assign(draft, updatedUser);
            })
          );
        } catch {}
      },
    }),
  }),
});

export const selectUsersResult = apiSlice.endpoints.getUsers.select();

export const selectAllUsers = createSelector(
  selectUsersResult,
  (usersResult) => usersResult?.data?.pages.flat() ?? []
);

type GetPostSelectFromResultArg = TypedUseQueryStateResult<
  InfiniteData<SimplifiedUser[], UsersInitialPageParam>,
  unknown,
  BaseQueryFn
>;

export const selectAllUsersFromResult = createSelector(
  (res: GetPostSelectFromResultArg) => res.data,
  (data) => data?.pages.flat() ?? []
);

export const {
  useGetUsersInfiniteQuery,
  useLazyGetUserByIdQuery,
  useGetUserByIdQuery,
  useEditUserMutation,
} = apiSlice;
