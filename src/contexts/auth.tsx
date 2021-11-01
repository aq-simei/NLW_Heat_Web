import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type AuthResponse = {
    token: string;
    user: {
        id: string, 
        avatar_url: string;
        name: string;
        login: string;
    }
}
type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthProviderProps = {
    children: ReactNode;
}
type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}


export const AuthContext = createContext({} as AuthContextData)


export function AuthProvider(props: AuthProviderProps){
    const signInUrl = ` https://github.com/login/oauth/authorize?scope=user&client_id=c93339867589163f3f6e `;

    const [user, setUser] = useState<User | null>(null)

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate',{
            code: githubCode,
        })
        const {token, user} = response.data;
        localStorage.setItem('@dowhile:token', token) //Salvamos o token do usuário dentro do cache do navegador :: evita que autenticação seja perdida se fechar a janela
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        setUser(user)
    }

    function signOut (){
        setUser(null)
        localStorage.removeItem('@dowhile:token')
    }

    useEffect(() => { //recupera o token dentro do local storage
        const token = localStorage.getItem('@dowhile:token') 
        if(token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;
            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }

    })
    

    useEffect (() => { //recupera o código de autenticação do github na URL 
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');
        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=')

            window.history.pushState({}, '', urlWithoutCode)

            signIn(githubCode)

        }
    }, [])

    return(
        <AuthContext.Provider value = {{ signInUrl , user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    );
}