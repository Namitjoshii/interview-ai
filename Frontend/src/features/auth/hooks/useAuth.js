import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data?.token) {
                localStorage.setItem("token", data.token)
            }
            if (data?.user) {
                setUser(data.user)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data?.token) {
                localStorage.setItem("token", data.token)
            }
            if (data?.user) {
                setUser(data.user)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            localStorage.removeItem("token")
            setUser(null)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data?.user) {  // ✅ null check - loading stuck nahi hogi
                    setUser(data.user)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false) // ✅ har case mein false hoga
            }
        }

        getAndSetUser()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}