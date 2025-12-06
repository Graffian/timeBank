"use client";

import { JSX } from "react";
import { useRouter } from 'next/navigation'


export default function Signup():JSX.Element{
      const router = useRouter();
    
    function handleLogin(){
        router.push('/auth');
    }
  return(
    <>
    <div className="flex flex-col justify-center items-center bg-black text-white h-screen w-full ">
      <div className="flex flex-col  " >
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" type="email" placeholder='Enter your college Email'/>
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" type="password" placeholder='Enter your Password'/>
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" placeholder='Enter your full name'/>
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" placeholder='Enter your department'/>
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" placeholder='Enter your college regd num'/>
        <span className='text-blue-700 font-mono cursor-pointer hover:underline mt-2' onClick={handleLogin}>Already have a account? Login</span>
      </div>
      <div>
        <button className="cursor-pointer bg-blue-700 text-white hover:bg-white hover:text-black rounded mt-5 w-[100px] p-2">Sign Up</button>
      </div>
    </div>
  
    </>
  )
}