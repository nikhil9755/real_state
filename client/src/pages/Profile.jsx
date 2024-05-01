import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase' 
import { updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutUserFailure,signoutUserStart,signInSuccess, signoutUserSuccess } from '../redux/user/userSlice'

export default function Profile() {
  const fileRef=useRef();
  const {currentUser,error,loading}=useSelector(state=>state.user);
  const [file,setFile]=useState(undefined)
  const[filePerc,setfilePerc]=useState(0);
  const[formData,setformData]=useState({})
  const[fileUploadError,setfileUploadError]=useState(false); 
  const[updateSuccess,setupdateSuccess]=useState(false);
  const[deleteeSuccess,setdeleteSuccess]=useState(false);
  const dispatch=useDispatch();
  // console.log(file);
  console.log(filePerc);
  console.log(fileUploadError);
  console.log(formData);

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])

  const handleFileUpload=(file)=>{
    const storage=getStorage(app);
    const fileName = new Date().getTime() + file.name;
    // const fileName=file.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',(snapshot)=>{
      const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      // console.log('Upload is'+ progress + '% done');
      setfilePerc(Math.round(progress));
    },

    (error)=>{
      setfileUploadError(true);
      console.log(error);
    },

    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>{

        setformData({...formData, avatar:downloadURL})
      });
    });

  }

  const handleChange=(event)=>{
    setformData({...formData,[event.target.id]:event.target.value});
    console.log(formData);
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
        dispatch(updateUserStart());
        const res=await fetch(`/api/user/update/${currentUser._id}`,{
          method:"POST",
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data=await res.json();
        if(data.success===false)
        {
          dispatch(updateUserFailure(data.message))
          return;
        }
        dispatch(updateUserSuccess(data)); 
        setupdateSuccess(true); 

    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDelete = async (e)=>{
    // e.preventDefault();
    try {
        dispatch(deleteUserStart());
        const res=await fetch(`/api/user/delete/${currentUser._id}`,{
          method:"POST",
         });

        const data=await res.json();
        if(data.success===false)
        {
          dispatch(deleteUserFailure(data.message))
          return;
        }
        dispatch(deleteUserSuccess(data)); 
        setdeleteSuccess(true); 

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout=async ()=>{
    try {
      dispatch(signoutUserStart);
      const res=await fetch('api/auth/signout/');
      const data=await res.json();
        if(data.success===false)
        {
          dispatch(signoutUserFailure(data.message))
          return;
        }
        dispatch(signoutUserSuccess(data)); 
        setdeleteSuccess(true); 
      
    } catch (error) {
      
    }
  }
  return (
    <div className='p-3 max-w-ls'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4' >
      <input onChange={(e)=>setFile(e.target.files[0])} type="file" name="" id="" ref={fileRef} accept='image/*' hidden/>
        <img src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' onClick={()=>fileRef.current.click()}/>
        <p className='self-center'>
        {fileUploadError ? (
        <span className="text-red-700">Error image upload (image must be less than 2 mb)</span> ) 
          : filePerc > 0 && filePerc < 100 ? (
          <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>)
          : filePerc === 100 ? (<span className='text-green-700'>Image Uploaded </span>) 
          : ('')}</p>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} defaultValue={currentUser.username}/>
        <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} defaultValue={currentUser.email}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} defaultValue={currentUser.password}/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
        {loading ? 'Loading': 'Update'}</button>
        
      </form>
      <div className='flex justify-between mt-5'>
      <span className='text-red-700 cursor-pointer' onClick={handleDelete}>Delete Account</span>
      <span className='text-red-700 cursor-pointer' onClick={handleSignout}>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error :""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "user updated successfully" :""}</p>
      <p className='text-green-700 mt-5'>{deleteeSuccess ? "user deleted successfully" :""}</p>
    </div>
  )
}
