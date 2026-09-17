import { useAuth } from "@clerk/react-router"
import { mergeConfig, type AxiosRequestConfig } from "axios"
import { useCallback, useMemo } from "react"

import { api } from "~/lib/api"

export function useApi() {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  const request = useCallback(
    async <T = unknown, D = unknown>(
      config: AxiosRequestConfig<D>
    ): Promise<T> => {
      if (!isLoaded) throw new Error("Authentication is still loading")
      if (!isSignedIn) throw new Error("Please sign in to continue")

      const token = await getToken()
      if (!token)
        throw new Error("Your session has expired. Please sign in again")

      const { headers } = mergeConfig(config, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const response = await api.request<T>({ ...config, headers })
      return response.data
    },
    [getToken, isLoaded, isSignedIn]
  )

  return useMemo(
    () => ({
      isLoaded,
      isSignedIn,
      request,
      get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: "GET", url }),
      post: <T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
      ) => request<T, D>({ ...config, method: "POST", url, data }),
      put: <T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
      ) => request<T, D>({ ...config, method: "PUT", url, data }),
      patch: <T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
      ) => request<T, D>({ ...config, method: "PATCH", url, data }),
      delete: <T = void>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: "DELETE", url }),
    }),
    [isLoaded, isSignedIn, request]
  )
}
