import { useQuery } from "@tanstack/react-query"
import { postsApi } from "../api/posts.client"

type PostsParams = Parameters<typeof postsApi.getAll>[0]
type TopPostsParams = Parameters<typeof postsApi.getTop>[0]
type CommentCountDistributionParams = Parameters<
  typeof postsApi.getCommentCountDistribution
>[0]

const STALE_TIME = 5 * 60 * 1000

export function usePosts(params?: PostsParams) {
  return useQuery({
    queryKey: ["posts", "list", params],
    queryFn: async () => {
      const response = await postsApi.getAll(params)
      return response
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useTopPosts(params?: TopPostsParams) {
  return useQuery({
    queryKey: ["posts", "top", params],
    queryFn: async () => {
      const response = await postsApi.getTop(params)
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function usePostCommentCountDistribution(
  params?: CommentCountDistributionParams
) {
  return useQuery({
    queryKey: ["posts", "comment-count-distribution", params],
    queryFn: async () => {
      const response = await postsApi.getCommentCountDistribution(params)
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}