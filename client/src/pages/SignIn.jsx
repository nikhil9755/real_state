import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'

export default function SignIp() {
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
      const res= await fetch('api/auth/signin', {
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
      navigate('/');
    }
    catch(error){
          // console.log(data);
          setloading(false);
          seterror(error.message);

    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
    <form onSubmit={handlesubmit} className='flex flex-col gap-4'>
    
      <input type='text' className='border p-3 rounded-lg' placeholder='Email' name='username' id='email' onChange={handleChange} />

      <input type='password' className='border p-3 rounded-lg' placeholder='Password' name='username' id='password' onChange={handleChange} />
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign In'}</button>
    </form>
    <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
       
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    
  )
}
