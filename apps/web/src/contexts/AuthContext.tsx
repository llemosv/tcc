import Cookies from 'js-cookie'
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '@/lib/axios'
// import { nameFormatter } from '@/lib/utils'
// import { modulesInfo } from '@/services/info'
// import { getUserModules, ModulesProps } from '@/services/modules'

interface AuthContextProviderProps {
  children: ReactNode
}

interface User {
  id: number
  name: string
  email: string
  tipo_pessoa: number
  id_curso: number
}

interface SignInProps {
  email: string
  senha: string
}

interface SingInContextType {
  user: User | null
  signIn: ({ email, senha }: SignInProps) => Promise<void>
  signOut: () => void
  token: string | null
  name: string | null
}

export const AuthContext = createContext({} as SingInContextType)

export function AuthProvider({ children }: AuthContextProviderProps) {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(() => {
    const storageUser = Cookies.get('gerenciadortcc::user')
    if (storageUser) return JSON.parse(storageUser)
    return null
  })

  const [name, setName] = useState(null)

  const [token, setToken] = useState(() => {
    const storageToken = Cookies.get('gerenciadortcc::token')

    if (storageToken) {
      api.defaults.headers.common.Authorization = `Bearer ${storageToken}`

      return storageToken
    }

    return null
  })

  async function signIn({ email, senha }: SignInProps) {
    const auth = await api.post('/auth', {
      email,
      senha,
    })

    Cookies.set('gerenciadortcc::token', auth.data.token, {
      expires: 1,
      domain:
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
          ? 'localhost'
          : '',
    })
    Cookies.set('gerenciadortcc::user', JSON.stringify(auth.data.user), {
      expires: 1,
      domain:
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
          ? 'localhost'
          : '',
    })

    api.defaults.headers.common.authorization = `Bearer ${auth.data.token}`

    navigate('/')
    console.log(auth.data.user)
    setUser(auth.data.user)
    setToken(auth.data.token)
  }

  const signOut = useCallback(() => {
    const cookies = Object.keys(Cookies.get())

    cookies.forEach((cookieName) => {
      if (cookieName.includes('gerenciadortcc')) {
        Cookies.remove(cookieName)
      }
    })

    navigate('/sign-in')

    setUser(null)

    setToken(null)

    setName(null)
  }, [navigate, setUser, setToken, setName])

  useEffect(() => {
    const clearStorage = () => {
      try {
        signOut()
      } catch (error) {
        // error;
      }
    }

    const id = setInterval(() => {
      clearStorage()
    }, 86522222) // a cada 24 horas

    return () => clearInterval(id)
  }, [signOut])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, token, name }}>
      {children}
    </AuthContext.Provider>
  )
}
