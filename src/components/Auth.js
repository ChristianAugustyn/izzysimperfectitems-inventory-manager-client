import { navigate, useLocation } from '@reach/router'
import { data } from 'autoprefixer'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Login from './Login'

const KEY = "izzys-inventory-manager"

const login = (credentials) => {
    const { username, password } = credentials
    console.log("LOGGING IN...")
    return axios.post('https://izzys-inventory-manager.herokuapp.com/api/auth/login', credentials)
        .then(res => res.data)
        .then(data => {
            const { id, firstName, lastName, username, token } = data
            localStorage.setItem(KEY, JSON.stringify({token: token, name: firstName}))
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
    const sessionInfo = JSON.parse(localStorage.getItem(KEY))

    if (sessionInfo == null){
        // console.log('NO VALIDATION SESSION')
        return false
    }

    if (!sessionInfo.token){
        // console.log("NO VALID TOKEN PRESENT")
        return false
    }

    return axios.get('https://izzys-inventory-manager.herokuapp.com/api/auth/validate', {
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

const PrivateRoute = ({ component: Component, location, ...rest }) => {
    if (!validateToken() && location.pathname !== `/login`) {
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