import React, { useState } from 'react'
import {login, logout, validateToken} from './Auth'
import { useNavigate } from '@reach/router';

const startCredentials = {
    username: "",
    password: ""
}

const Login = () => {
    const navigate = useNavigate()

    const [error, setError] = useState(false)

    const [credentials, setCredentials] = useState(startCredentials)

    const handleChange = (event) => {
        
        const { name, value } = event.target
        console.log(name, value)
        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    const handleLogin = async () => {
        const res = await login(credentials)
        if (res){
            navigate("/")
        }
        else {
            setError(true)
            setCredentials(startCredentials)
        }
    }

    return (
        <>
            <h1>Login page</h1>
            <div className="p-10 card bg-base-200">
                <div className="form-control">
                    <label className="label">
                    <span className="label-text">Username</span>
                    </label> 
                    <input type="text" name='username' placeholder="username" className="input input-ghost" value={credentials.username} onChange={handleChange}/>
                    <label className="label">
                    <span className="label-text">Password</span>
                    </label> 
                    <input type="text" name='password' placeholder="password" className="input input-ghost" value={credentials.password} onChange={handleChange}/>
                </div>
                <button className='btn' onClick={() => handleLogin()}>Login</button>
                {
                    error ? <p className='text-red-700'>Login failed, try again</p> : ''
                }
            </div>
        </>
    )
}

export default Login