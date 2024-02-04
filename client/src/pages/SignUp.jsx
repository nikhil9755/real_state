import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'

export default function SignUp() {
  const[formdata,setformdata]=useState({});
  const[error,seterror]=useState(null);
  const[loading,setloading]=useState(false);
  const navigate=useNavigate();
  const handleChange= (e) =>{
    setformdata({
      ...formdata,
      [e.target.id]:e.target.value,
    });
  };
  console.log(formdata);
  const handlesubmit= async (e) => {
    e.preventDefault();
    try{
      setloading(true);
      const res= await fetch('api/auth/signup', {
        method : 'POST',
        headers : {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formdata),
      });
      const data=await res.json();
      console.log(data);
      if(data.success== false){
      setloading(false);
      seterror(data.message);
      return;  
      }
      setloading(false);
      seterror(null);
      navigate('/sign-in');
    }
    catch(error){
          // console.log(data);
          setloading(false);
          seterror(error.message);

    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
    <form onSubmit={handlesubmit} className='flex flex-col gap-4'>
      <input type='text' className='border p-3 rounded-lg' placeholder='Username' name='username' id='username' onChange={handleChange} />
      <input type='text' className='border p-3 rounded-lg' placeholder='Email' name='username' id='email' onChange={handleChange} />

      <input type='text' className='border p-3 rounded-lg' placeholder='Password' name='username' id='password' onChange={handleChange} />
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign Up'}</button>
    </form>
    <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
    </div>
    
  )
}
