import { useQuery } from "@tanstack/react-query"
import { sentimentApi } from "../api/sentiment.client"

type DailyParams = Parameters<typeof sentimentApi.getDaily>[0]
type MonthlyParams = Parameters<typeof sentimentApi.getMonthly>[0]
type TopParams = Parameters<typeof sentimentApi.getDailyTop>[0]

const STALE_TIME = 5 * 60 * 1000

export function useOverallSentiment() {
  return useQuery({
    queryKey: ["sentiment", "overall"],
    queryFn: async () => {
      const response = await sentimentApi.getOverall()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useOverallSentimentSummary() {
  return useQuery({
    queryKey: ["sentiment", "overall", "summary"],
    queryFn: async () => {
      const response = await sentimentApi.getOverallSummary()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useDailySentiment(params?: DailyParams) {
  return useQuery({
    queryKey: ["sentiment", "daily", params],
    queryFn: async () => {
      const response = await sentimentApi.getDaily(params)
      return response
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useDailyTopSentiment(params?: TopParams) {
  return useQuery({
    queryKey: ["sentiment", "daily", "top", params],
    queryFn: async () => {
      const response = await sentimentApi.getDailyTop(params)
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useMonthlySentiment(params?: MonthlyParams) {
  return useQuery({
    queryKey: ["sentiment", "monthly", params],
    queryFn: async () => {
      const response = await sentimentApi.getMonthly(params)
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useMonthlyTopSentiment(params?: TopParams) {
  return useQuery({
    queryKey: ["sentiment", "monthly", "top", params],
    queryFn: async () => {
      const response = await sentimentApi.getMonthlyTop(params)
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}