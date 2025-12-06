"use client";
import React from 'react';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation'
export default function Login(): JSX.Element {
  const router = useRouter();
  function handleSingup(){
    router.push('/auth/SignUp');
  }
  return(
    <>
    <div className='bg-black h-screen w-full text-white flex justify-center items-center flex-col p-10 gap-5'>
      <div  className='flex flex-col gap-5 '>
        <input className='border-slate-600 bg-blue-950 w-[400px] h-[30px] rounded' type="email" placeholder='Enter your college Email'/>
        <input className='border-slate-600 bg-blue-950 w-[400px] h-[30px] rounded' type="password" placeholder='Enter your Password'/>
       <span className='text-blue-700 font-mono cursor-pointer hover:underline' onClick={handleSingup}>Don't have a account?Signup</span>
      </div>

      <div>
        <button className="cursor-pointer bg-blue-700 rounded text-white w-[200px] h-10 hover:bg-white hover:text-black">Login</button>
      </div>
    </div>
  
    </>
  )
}




