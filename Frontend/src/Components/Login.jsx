import {Link, redirect} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {useState} from 'react'
function Login(){
    const navigate = useNavigate();
    const [email,setEmail] = useState("")      
        const [password,setPassword] = useState("")
      const handler = async(e)=>{  
          e.preventDefault();   
        try{
               const res = await fetch('http://localhost:3000/login', {
                method :'POST',
                credentials:"include",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({email,password})
            })
            const data = await res.json()
            if(res.ok){
                // alert('Login Sucessful');
            navigate('/profile');    
            }else{
                alert(data.message)
            }
            setEmail("")
            setPassword("")
        } catch(error){
             console.log(error)     
        }                     
        }
    return(
        <div className=" bg-black h-screen w-full text-white gap-5 flex flex-col justify-center items-center">
            
        <form onSubmit={(e)=>handler(e)}>
          <div className="flex flex-col gap-6 border-1 rounded-4xl px-25 py-30">
            <div>
                  <h1 className="text-2xl mb-10 flex items-center justify-center ">Glad to see you again♡</h1>
            </div>
            <input   className=" w-100 px-6 py-4  bg-transparent text-xl border-1 rounded-2xl "   type="email" placeholder="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
            <input  className=" w-100 px-6 py-4 bg-transparent text-xl border-1 rounded-2xl "   type="password" placeholder="password" name="password" value ={password} onChange={(e)=>setPassword(e.target.value)} required/>
            <button type="submit" className="bg-blue-700 py-4 rounded-2xl hover:scale-105 transition duration-200 hover:bg-blue-900 text-xl">Login</button>
             <p className='text-lg'>Don`t have an account?<Link className='text-blue-400'  to = '/'>SignUp</Link></p>

       </div>
        </form>
        </div>
    )
}
export default Login;