import { JSX } from "react";

export default function Signup():JSX.Element{
  return(
    <>
      <div>
        <input type="email" placeholder='Enter your college Email'/>
        <input type="password" placeholder='Enter your Password'/>
        <input placeholder='Enter your full name'/>
        <input placeholder='Enter your department'/>
        <input placeholder='Enter your college regd num'/>
      </div>
      <div>
        <button className="cursor-pointer">Sign Up</button>
      </div>
  
    </>
  )
}