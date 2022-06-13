import { navigate, useLocation, RouteComponentProps } from '@reach/router'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import Login from './Login'

const KEY = "izzys-inventory-manager"

export interface Credentials {
    username: string,
    password: string
}

interface StoredData {
    token: string,
    name: string
}

interface AuthResponse {
    id: string,
    firstName: string,
    lastName: string,
    token: string
}

const login = (credentials: Credentials): Promise<boolean> => {
    const { username, password } = credentials
    return axios.post('http://localhost:5000/api/auth/login', credentials)
        .then(res => res.data as AuthResponse)
        .then(data => {
            const { token, firstName } = data

            const storedData: StoredData = {token: token, name: firstName}

            localStorage.setItem(KEY, JSON.stringify(storedData))
            // console.log("LOGGED IN")
            return true
        }).catch(err => {
            // console.log("LOGIN FAILED")
            return false
        })
}

const logout = () => {
    // console.log("LOGGED OUT")
    localStorage.removeItem(KEY)
}

const validateToken = () => {
    const rawData = localStorage.getItem(KEY)

    if (rawData == null){
        // console.log('NO VALIDATION SESSION')
        return false
    }

    const sessionInfo: StoredData = JSON.parse(rawData)

    if (!sessionInfo.token){
        // console.log("NO VALID TOKEN PRESENT")
        return false
    }

    return axios.get('http://localhost:5000/api/auth/validate', {
        headers: {
            'Authorization': `Bearer ${sessionInfo.token}`
        }
    }).then(res => {
        // console.log("TOKEN VALID")
        return true
    })
    .catch(err => {
    //     console.log('TOKEN INVALID')
        return false
    })
}

const getSessionInfo = (): StoredData | null => {
    const raw = localStorage.getItem(KEY)
    if (raw == null) {
        return null
    }
    const sessionInfo: StoredData = JSON.parse(raw)
    return sessionInfo

}

interface ProtectedProps extends RouteComponentProps {
    component: React.FC<RouteComponentProps>
}

const PrivateRoute: FC<ProtectedProps> = ({ component: Component, location, ...rest }) => {
    if (!validateToken() && !!location && location.pathname !== `/login`) {
        navigate('/login')
        return <Login/>
    }

    return <Component {...rest}/>
}

export {
    login,
    logout,
    validateToken,
    PrivateRoute,
    getSessionInfo
}