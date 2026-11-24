import { useQuery } from "@tanstack/react-query"
import { engagementApi } from "../api/engagement.client"

const STALE_TIME = 5 * 60 * 1000

export function useScoreDistribution() {
  return useQuery({
    queryKey: ["engagement", "score-distribution"],
    queryFn: async () => {
      const response = await engagementApi.getScoreDistribution()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useEngagementBySentiment() {
  return useQuery({
    queryKey: ["engagement", "by-sentiment"],
    queryFn: async () => {
      const response = await engagementApi.getBySentiment()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useScoreCategorySentiment() {
  return useQuery({
    queryKey: ["engagement", "score-category-sentiment"],
    queryFn: async () => {
      const response = await engagementApi.getScoreCategorySentiment()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useControversiality() {
  return useQuery({
    queryKey: ["engagement", "controversiality"],
    queryFn: async () => {
      const response = await engagementApi.getControversiality()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useControversialityBySentiment() {
  return useQuery({
    queryKey: ["engagement", "controversiality", "by-sentiment"],
    queryFn: async () => {
      const response = await engagementApi.getControversialityBySentiment()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}