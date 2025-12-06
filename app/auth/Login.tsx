import { JSX } from "react";

export default function Login():JSX.Element{
  return(
    <>
      <div>
        <input type="email" placeholder='Enter your college Email'/>
        <input type="password" placeholder='Enter your Password'/>
      </div>
      <div>
        <button className="cursor-pointer">Login</button>
      </div>
  
    </>
  )
}




