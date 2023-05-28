import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!username || !password){
      setRemoveError('Please fill all the fields');
      return;
    }
    const loginCreds = {
      username,
      password
    };
    console.log(loginCreds);
    axios({
      method: 'post',
      url: 'http://localhost:3000/users/login',
      data: loginCreds,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    }).catch((err) => {
      setRemoveError(err.response.data.message);
    });
  };
  const setRemoveError = (error) => {
    setError(error);
    setTimeout(() => {
      setError('');
    }, 3000) ;
  };

  return (
    <div className='w-screen h-screen bg-blue-900 flex justify-center items-center' >
      
      <div className='sm:w-96 border-2 border-cyan-600 sm:p-8 p-5 rounded-md flex flex-col gap-5 items-center'>
      <p className="text-2xl text-red-400 font-bold w-full text-center ">Welcome to admin site.</p>
        <input placeholder='Username' className='px-2 py-1  w-full rounded-sm' type="text" onChange={(e)=>setUsername(e.target.value)}></input>
        <input placeholder='Password' className='px-2 py-1  w-full rounded-sm' type='password' onChange={(e)=>setPassword(e.target.value)}></input>
        <button className='px-2 py-1 bg-cyan-600 rounded-sm w-full text-white' onClick={handleSubmit}>Login</button>
        {
          error && <p className='text-red-500'>*{error}</p>
        }
      </div>
    </div>
  )
}

export default Login;