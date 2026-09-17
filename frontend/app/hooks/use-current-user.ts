import { useEffect, useState } from "react"

import { useApi } from "~/hooks/use-api"

export interface CurrentUser {
  user_id: number
  clerk_user_id: string | null
  name: string
  email: string
  created_at: string
}

export function useCurrentUser() {
  const { get, isLoaded, isSignedIn } = useApi()
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setUser(null)
      return
    }

    let cancelled = false
    setError(null)

    get<CurrentUser>("/api/users/me")
      .then((data) => {
        if (!cancelled) setUser(data)
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load user")
      })

    return () => {
      cancelled = true
    }
  }, [get, isLoaded, isSignedIn])

  return { user, error }
}
