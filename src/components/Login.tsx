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

    const [loading, setLoading] = useState(false)

    const [credentials, setCredentials] = useState<Credentials>(startCredentials)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    const handleLogin = async (): Promise<void> => {
        setLoading(true)
        const res = await login(credentials)
        if (res){
            navigate("/")
        }
        else {
            setLoading(false)
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
                {
                    loading ? (
                        <div className='flex flex-row items-center my-3'>
                            <svg className='animate-spin h-6 w-6 feather feather-refresh-cw mr-2' xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                            <p>Loading...</p>
                        </div>
                    ) : ''
                }
            </div>
    )
}

export default Login