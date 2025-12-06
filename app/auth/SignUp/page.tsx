"use client";

import { JSX, useRef } from "react";
import supabase from "../../supabase"
import { useRouter } from 'next/navigation'


export default function Signup():JSX.Element{
  const emailRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const fullNameRef = useRef<HTMLInputElement>(null)
  const deptRef = useRef<HTMLInputElement>(null)
  const collegeRegdRef = useRef<HTMLInputElement>(null)
      const router = useRouter();
    async function handleSignUp(){

      const email = emailRef.current?.value
      const password = passRef.current?.value
      const fullName = fullNameRef.current?.value
      const dept = deptRef.current?.value
      const collegeRegd = collegeRegdRef.current?.value

      const {data ,error} = await supabase
                                    .from("login_credentials")
                                    .insert([{
                                      college_email : email,
                                      password_hash : password,
                                      full_name : fullName,
                                      department : dept,
                                      college_id : collegeRegd
                                    }]).select().single()

      if (error){
        console.log("ERROR STORING THE USER INFO" , error)
        return
      }
      
      console.log("INSERTED DATA" , data)

    }
    async function handleLogin(){
      router.push('/auth');
    }
  return(
    <>
    <div className="flex flex-col justify-center items-center bg-black text-white h-screen w-full ">
      <div className="flex flex-col  " >
        <input ref={emailRef} className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" type="email" placeholder='Enter your college Email'/>
        <input ref={passRef} className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" type="password" placeholder='Enter your Password'/>
        <input ref={fullNameRef} className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" placeholder='Enter your full name'/>
        <input ref={deptRef} className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" placeholder='Enter your department'/>
        <input ref={collegeRegdRef} className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" placeholder='Enter your college regd num'/>
        <span className='text-blue-700 font-mono cursor-pointer hover:underline mt-2' onClick={handleLogin}>Already have a account? Login</span>
      </div>
      <div>
        <button onClick={handleSignUp} className="cursor-pointer bg-blue-700 text-white hover:bg-white hover:text-black rounded mt-5 w-[100px] p-2">Sign Up</button>
      </div>
    </div>
  
    </>
  )
}



