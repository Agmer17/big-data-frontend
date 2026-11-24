import { useQuery } from "@tanstack/react-query"
import { keywordsApi } from "../api/keyword.client"

type TopKeywordsParams = Parameters<typeof keywordsApi.getTop>[0]
type DistinctiveKeywordsParams = Parameters<typeof keywordsApi.getDistinctive>[0]
type NegativeVsPositiveParams = Parameters<
  typeof keywordsApi.getNegativeVsPositive
>[0]

const STALE_TIME = 5 * 60 * 1000

export function useTopKeywords(params?: TopKeywordsParams) {
  return useQuery({
    queryKey: ["keywords", "top", params],
    queryFn: async () => {
      const response = await keywordsApi.getTop(params)
      return response
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useDistinctiveKeywords(params: DistinctiveKeywordsParams) {
  return useQuery({
    queryKey: ["keywords", "distinctive", params],
    queryFn: async () => {
      const response = await keywordsApi.getDistinctive(params)
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useNegativeVsPositiveKeywords(params?: NegativeVsPositiveParams) {
  return useQuery({
    queryKey: ["keywords", "negative-vs-positive", params],
    queryFn: async () => {
      const response = await keywordsApi.getNegativeVsPositive(params)
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useKeywordThemes() {
  return useQuery({
    queryKey: ["keywords", "themes"],
    queryFn: async () => {
      const response = await keywordsApi.getThemes()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useKeywordThemeDefinitions() {
  return useQuery({
    queryKey: ["keywords", "themes", "definitions"],
    queryFn: async () => {
      const response = await keywordsApi.getThemeDefinitions()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}