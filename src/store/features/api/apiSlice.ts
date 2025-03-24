import { ApiUser } from '@/api/schema';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type ApiUserPatch = Pick<ApiUser, 'id'> & Partial<Omit<ApiUser, 'id'>>;
type UsersInitialPageParam = {
  offset: number;
  limit: number;
};
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
    getUsers: builder.infiniteQuery<ApiUser[], void, UsersInitialPageParam>({
      infiniteQueryOptions: {
        initialPageParam: {
          offset: 0,
          limit: 20,
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const nextOffset = lastPageParam.offset + lastPageParam.limit;
          const remainingItems = lastPage?.length - nextOffset;

          if (remainingItems <= 0) {
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
      providesTags: (result) =>
        result ? result.pageParams.map((el) => ({ type: 'User', pageParams: el })) : ['User'],
    }),

    editUser: builder.mutation<ApiUser, ApiUserPatch>({
      query(data) {
        const { id, ...body } = data;
        return { url: `/users/${id}`, method: 'PATCH', body };
      },

      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
  }),
});

export const { useGetUsersInfiniteQuery, useGetUserByIdQuery, useEditUserMutation } = apiSlice;
