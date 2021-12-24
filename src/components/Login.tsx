import { ChangeEvent, FC, useState } from 'react'
import {Credentials, login, logout, validateToken} from './Auth'
import { useNavigate, RouteComponentProps } from '@reach/router';

const startCredentials: Credentials = {
    username: "",
    password: ""
}

const Login: FC<RouteComponentProps> = () => {
    const navigate = useNavigate()

    const [error, setError] = useState(false)

    const [credentials, setCredentials] = useState<Credentials>(startCredentials)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    const handleLogin = async (): Promise<void> => {
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
            <div className="container mx-auto flex flex-col items-center justify-center p-10">
                <h1>Izzys Imperfect Items</h1>
                <div className="form-control w-full max-w-md">
                    <label className="label">
                    <span className="label-text">Username</span>
                    </label> 
                    <input type="text" name='username' placeholder="username" className="input input-ghost" value={credentials.username} onChange={handleChange}/>
                    <label className="label">
                    <span className="label-text">Password</span>
                    </label> 
                    <input type="password" name='password' placeholder="password" className="input input-ghost" value={credentials.password} onChange={handleChange}/>
                </div>
                <button className='btn' onClick={() => handleLogin()}>Login</button>
                {
                    error ? <p className='text-red-700'>Login failed, try again</p> : ''
                }
            </div>
    )
}

export default Login