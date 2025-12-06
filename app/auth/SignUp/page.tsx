import { JSX } from "react";
import { createClient } from "@supabase/supabase-js";
export default function Signup():JSX.Element{
  const supabaseUrl = process.env.SUPABASE_PROJECT_URL
  const supabaseKey = process.env.SUPABASE_KEY
  if (!supabaseUrl || !supabaseKey){
    throw new Error("Missing supabase url or key")
  }
  const supabase = createClient(supabaseUrl , supabaseKey)
  return(
    <>
    <div className="flex flex-col justify-center items-center bg-black text-white h-screen w-full ">
      <div className="flex flex-col  " >
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" type="email" placeholder='Enter your college Email'/>
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" type="password" placeholder='Enter your Password'/>
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" placeholder='Enter your full name'/>
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" placeholder='Enter your department'/>
        <input className="mt-5 bg-blue-950 w-[400px] h-[45x] p-2 rounded" placeholder='Enter your college regd num'/>
      </div>
      <div>
        <button className="cursor-pointer bg-blue-700 text-white hover:bg-white hover:text-black rounded mt-5 w-[100px] p-2">Sign Up</button>
      </div>
    </div>
  
    </>
  )
}