import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Edit(){
    const navigate = useNavigate()
    const {id} = useParams()
    const [content,setContent] = useState('')
    async function editHandle(e){
         e.preventDefault(); 
        try{
          
           const res = await fetch(`http://localhost:3000/edit/${id}`,{
            method:"PUT",
            credentials:"include",
            headers:{
                'Content-type':'application/json'
            } ,
              body:JSON.stringify({content})
           }) 
           const data = await res.json()
           
           if(res.ok){
            navigate('/profile')
           }
           else{
            console.log('Something went wrong');
            
           }
        }catch(err){
            console.log(err); 
        }
       
    }
   async function fetchData(){
        try{
            const res = await fetch(`http://localhost:3000/edit/${id}`,{
                credentials:'include'
            })
            const data= await res.json()
            setContent(data.content)
            
        }catch(err){
            console.log(err);   
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    return(
        <div className="bg-black min-h-screen w-full flex justify-center items-center ">
            <form onSubmit={(e)=>editHandle(e)}>
                <textarea className="text-white m-4 w-150 h-45 border-1 p-4 resize-none" value={content} onChange={(e)=>setContent(e.target.value)}></textarea>
                <button type="submit" className="text-black bg-yellow-400 px-14 py-4 text-2xl font-bold rounded block ml-55 mt-4 hover:scale-105">Update</button>
            </form>
        </div>
    )
}
export default Edit;