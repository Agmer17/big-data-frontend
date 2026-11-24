import { useQuery } from "@tanstack/react-query"
import { usersApi } from "../api/users.client"

const STALE_TIME = 5 * 60 * 1000

export function useKarmaSentiment() {
  return useQuery({
    queryKey: ["users", "karma", "sentiment"],
    queryFn: async () => {
      const response = await usersApi.getKarmaSentiment()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useKarmaWeightedComparison() {
  return useQuery({
    queryKey: ["users", "karma", "weighted-comparison"],
    queryFn: async () => {
      const response = await usersApi.getKarmaWeightedComparison()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useAccountAgeSentiment() {
  return useQuery({
    queryKey: ["users", "account-age"],
    queryFn: async () => {
      const response = await usersApi.getAccountAge()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}

export function useVerificationSentiment() {
  return useQuery({
    queryKey: ["users", "verification"],
    queryFn: async () => {
      const response = await usersApi.getVerification()
      return response.data
    },
    staleTime: STALE_TIME,
    retry: 1,
  })
}