import  { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { FaGoogle, FaApple } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleGoogleLogin = () => {
        // Lógica para iniciar sesión con Google
        console.log('Iniciar sesión con Google')
    }

    const handleAppleLogin = () => {
        // Lógica para iniciar sesión con Apple
        console.log('Iniciar sesión con Apple')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('https://backend-project-a.vercel.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, password }),
        })
        console.log('user:', user);
        console.log('Password:', password);
        if (res.ok) {
            const data = await res.json()
            console.log('Login success');
            window.localStorage.setItem( 'userLocalStorage', user )
            window.localStorage.setItem( 'id', data.id)
            navigate('/inicio')
        } else {
            console.log('Login failed',res);
        }
    };


    return (
        <div className='bg-[#fdfdfd] w-110 h-auto m-auto  rounded-[10px] '>
            <div className='flex flex-col m-auto mt-10  text-[#110f0f] w-90 h-250] mb-10'>
                <img className='w-15 h-15 m-auto mt-10' src="/logopage.png" alt="logo" />
                <h2 className='m-auto mt-2 text-xl'>sign into your account</h2>
                <div className='m-auto flex flex-row  '>
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center bg-[#dddd] text-[#110f0f] p-2 rounded mt-4 mr-2 text-[15px]">
                        <FaGoogle className="mr-2 justify-between" color='#4285f4' /> Sign in with Google
                    </button>
                    <button
                        onClick={handleAppleLogin}
                        className="flex items-center justify-center bg-[#dddd] text-[#110f0f] p-2 rounded mt-4 text-[15px]">
                        <FaApple className="mr-2" /> Sign in with Apple
                    </button>
                </div>
                <div className='flex flex-row items-center  mt-3 '>
                    <div className='bg-[#1111] w-35 h-0.5 rounded-[50px]'></div>
                    <span className='text-xs ml-1 mr-1 text-gray-600' >Or use Email</span>
                    <div  className='bg-[#1111] w-35 h-0.5 rounded-[50px]'></div>
                </div>
                <form onSubmit={handleSubmit}  >
                    <div className=' border border-gray-300  mt-8 rounded-[10px]'>
                        <input
                            type="text"
                            id="email"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required
                            placeholder='user'
                            className='h-12 w-[100%] outline-none border-b border-b-gray-300  '
                        />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='password'
                            className='h-12 outline-none w-[100%]   '
                        />
                    </div>
                    <div className='mt-3'>
                        <input 
                        type="checkbox" 
                        name="remenberDevice" id="remenberDevise" 
                        className=''
                        />
                        <label 
                        htmlFor="remenberDevice"
                        className='text-sm text-gray-500'
                        >
                            Remenber me on this device
                        </label>
                        <a className='ml-[12%] text-gray-500 text-sm' href=""
                        >
                            forgot password?
                        </a>
                    </div>
                    <button 
                    className='bg-[#110f0f] text-[#fdfdfd] w-[100%] h-8 rounded-[10px] mt-7' 
                    type="submit">
                        sign in
                    </button>
                </form>
                <p className='m-auto mt-5 mb-5 text-gray-600'>
                    Not a member? <Link className='text-[#110f0f]' to="/register">Registrate aqui</Link>
                </p>
            </div>
        </div>
    )
};

export default Login;