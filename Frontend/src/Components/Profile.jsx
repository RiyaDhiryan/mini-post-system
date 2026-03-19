import { useState } from "react"
import { useEffect } from "react"
import { useNavigate,Link } from "react-router-dom"
function Profile(){
    const [user,setUser]= useState({})
    const [content,setContent] = useState("")
    const [post,setPost]= useState([])
    const navigate = useNavigate()
    async function LogoutHandler(){
        try{
          const res = await fetch('http://localhost:3000/logout',{
            method:'POST',
            credentials:"include"
          })
          const data = await res.json()
            if(res.ok){
                // alert(data.message)
                navigate('/login')
            }else{
                alert(data.message)
            }
        }catch(error){
           console.log(error);
           
        }
    }
  
   async function fetchData(){
     await fetch('http://localhost:3000/profile',{
            credentials:'include'
        }).then(res=>res.json()).then(((data)=>{
            setUser(data)
            setPost(data.posts)
        }))
   }

    async function postHandler(e){
   e.preventDefault()
   try{
  const res = await fetch('http://localhost:3000/post',{
    method:'POST',
    credentials:'include',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify({content})
  })
  const data = await res.json()
  if(res.ok){
    setContent('')
    fetchData()
  }
  else{
    alert('Somthing Went Wrong!')
  }
   }catch(err){
    console.log(err);  
   }
    }
    async function deletePost(id){
        try{
            const res = await fetch(`http://localhost:3000/delete/${id}`,{
            method:'DELETE',
            credentials:'include'
        })
        if(res.ok){
            fetchData()
        }else{
            console.log("Something went wrong");
            
        }
         }catch(err){
            console.log(err);
            
         }
       

    }
    useEffect(()=>{
      fetchData()
    },[])
    return(
        <div className="relative bg-black min-h-screen w-full text-white">
            <h1 className="text-xl pt-4 pl-14">Inside <span className="text-yellow-400 text-3xl">{user.name}`s</span> World</h1>
            <button className="absolute top-7 right-8 bg-red-800 px-4 py-2 text-lg rounded-xl hover:bg-red-900 hover:scale-105 transition " onClick={LogoutHandler}>Logout</button>
            <div className="flex flex-col pt-15 pl-10">
            <form onSubmit={(e)=>postHandler(e)}>
                <textarea className="text-white m-4 w-150 h-35 border-1 p-4 resize-none" placeholder="Thoughts...." value={content} onChange={(e)=>setContent(e.target.value)}/>
                <button className="block bg-blue-600 px-10 py-3 text-xl rounded ml-4 hover:bg-blue-900 hover:scale-105" type="submit">Post</button>
            </form></div>
            <p className="pt-5 pl-15 text-gray-600">Your Posts.</p>
           <div className=" flex flex-wrap gap-10 ml-15 mt-5 overflow-y-auto ">
              {
                post.slice().reverse().map((post)=>( 
                   
                     <div key={post._id} className="border-1 bg-gray-800 h-auto p-4 w-180 mr-10">
                       <p className="text-blue-500">@{user.name}</p>
                <p className="break-words">
                    {post.content}
                </p>
                <div className="flex justify-between">
                <Link className="bg-yellow-500 px-3 py-1 rounded mt-7" to={`/edit/${post._id}`} >Edit</Link>
                <button className="bg-red-500 px-3 py-1 rounded mt-7"onClick={()=>deletePost(post._id)}>Delete</button></div>
                </div>
                
                ))
              }
             </div>

            

        </div>
    )
}
export default Profile;