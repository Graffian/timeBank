"use client";
import React, { useRef } from 'react';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation'
import supabase from "../supabase"
export default function Login(): JSX.Element {
  const emailRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const router = useRouter();
  function handleSingup(){
    router.push('/auth/SignUp');
  }
  async function handleLogin(){
    const email = emailRef.current?.value
    const pass = passRef.current?.value
    const {data , error} = await supabase
                                  .from("login_credentials")
                                  .select("*")
                                  .eq("college_email" , email)
                                  .eq("password_hash" , pass)
                                  .single()

    if(data){
      console.log("user already exists" , data)
      return
    }
    console.log("ERROR Scanning db" , error)
  }
  return(
    <>
    <div className='bg-black h-screen w-full text-white flex justify-center items-center flex-col p-10 gap-5'>
      <div  className='flex flex-col gap-5 '>
        <input ref={emailRef} className='border-slate-600 bg-blue-950 w-[400px] h-[30px] rounded' type="email" placeholder='Enter your college Email'/>
        <input ref={passRef} className='border-slate-600 bg-blue-950 w-[400px] h-[30px] rounded' type="password" placeholder='Enter your Password'/>
       <span className='text-blue-700 font-mono cursor-pointer hover:underline' onClick={handleSingup}>Donot have a account?Signup</span>
      </div>

      <div>
        <button onClick={handleLogin} className="cursor-pointer bg-blue-700 rounded text-white w-[200px] h-10 hover:bg-white hover:text-black">Login</button>
      </div>
    </div>
  
    </>
  )
}




