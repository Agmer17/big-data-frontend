import { useQuery } from "@tanstack/react-query"
import { subredditsApi } from "../api/subreddit.client"

type SubredditParams = Parameters<typeof subredditsApi.getAll>[0]
type TopSubredditParams = Parameters<typeof subredditsApi.getTop>[0]

const STALE_TIME = 5 * 60 * 1000

export function useSubreddits(params?: SubredditParams) {
  return useQuery({
    queryKey: ["subreddits", "list", params],
    queryFn: async () => {
      const response = await subredditsApi.getAll(params)
      return response
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useTopSubreddits(params?: TopSubredditParams) {
  return useQuery({
    queryKey: ["subreddits", "top", params],
    queryFn: async () => {
      const response = await subredditsApi.getTop(params)
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}