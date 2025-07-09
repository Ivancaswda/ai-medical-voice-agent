// context/AuthContext.tsx
'use client'
import { createContext, useContext, useEffect, useState } from "react"
import {useRouter} from "next/navigation";
import {toast} from "sonner";

interface User {
    email: string
    userName: string
    credits: number
}

interface AuthContextType {
    user: User | null
    setUser: () => void
    loading: boolean
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: () => {},
    setUser: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                setLoading(false)
                return
            }
            console.log('token here ->')
            console.log(token)
            try {
                const res = await fetch("/api/auth/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                console.log('response ')
                console.log(res)
                if (res.ok) {
                    const data = await res.json()
                    console.log(data)
                    setUser(data.user)
                } else {
                    localStorage.removeItem("token")
                }
            } catch (err) {
                console.error("Auth error", err)
                localStorage.removeItem("token")
            }
            setLoading(false)
        }


        fetchUser()
        console.log(user + 'user data')
        console.log('user-data')


    }, [])

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        router.push('/sign-in')
        toast.success('Вы вышли с аккаунта!')
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
