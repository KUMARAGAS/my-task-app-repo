import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("tm_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    if (result.error.status === 401) {
      localStorage.removeItem("tm_token");
      localStorage.removeItem("tm_user");
      window.location.href = "/login";
    }
    return result;
  }
  if (result.data && typeof result.data === "object" && "data" in result.data) {
    result.data = result.data.data;
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Tasks", "Dashboard"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getDashboardStats: builder.query({
      query: () => "dashboard",
      providesTags: ["Dashboard"],
    }),

    getTasks: builder.query({
      query: (params) => ({
        url: "tasks",
        params,
      }),
      providesTags: ["Tasks"],
    }),

    createTask: builder.mutation({
      query: (data) => ({
        url: "tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks", "Dashboard"],
    }),

    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tasks", "Dashboard"],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks", "Dashboard"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetDashboardStatsQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = api;
