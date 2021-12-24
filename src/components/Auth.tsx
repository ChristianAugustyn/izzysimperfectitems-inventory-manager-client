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

const login = (credentials: Credentials) => {
    const { username, password } = credentials
    console.log("LOGGING IN...")
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
    const sessionInfo: StoredData = JSON.parse(localStorage.getItem(KEY) || '')

    if (sessionInfo == null){
        // console.log('NO VALIDATION SESSION')
        return false
    }

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
    PrivateRoute
}