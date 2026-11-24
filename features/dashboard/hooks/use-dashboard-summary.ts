import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "../api/dashboard.client"


export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const response = await dashboardApi.getSummary()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
