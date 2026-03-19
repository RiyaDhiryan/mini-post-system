const express = require('express')
const app = express();
const cors = require('cors')
const userModel = require('./userModel/user')
const postModel = require('./userModel/post');
const user = require('./userModel/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())
app.get('/',(req,res)=>{
    res.send('It`s Working!!!')
})
app.post('/register',async(req,res)=>{
    try{
     const {email,name,password} = req.body
    const user = await userModel.findOne({email})
    if(user) return res.status(400).json({message:"User Already Registered"})
        bcrypt.genSalt(10,(err,salt)=>{
         bcrypt.hash(password,salt, async(err,hash)=>{
         const newUser = await  userModel.create({
                  name,
                  email,
                  password:hash
            })
            let token = jwt.sign({email: email, userId: newUser._id},'secret')
            res.cookie("token",token)
            res.json({
                    message: "Registered"
                   })
         })
        })
    }catch(error){
           res.status(500).json({message:'Server Error'})
    }

})
app.post('/login',async(req,res)=>{
    try{
const {email,password} = req.body
    const user = await userModel.findOne({email})
    if(!user)return res.status(500).json({message:'User not found'})
        bcrypt.compare(password,user.password,(err,result)=>{
         if(result) return res.status(200).json({
    message: "You can login"
})
            else res.status(400).json({message:"User not found"})
        })
        const token = jwt.sign({email:user.email, userId:user._id},'secret')
        res.cookie('token',token)
    }catch(error){
         res.status(500).json({message:"Server Error"})
    }
    
})
app.get('/profile',isLoggedIn,async(req,res)=>{
    try{
        const user = await userModel.findById(req.user.userId).select('name').populate('posts')
        res.json({
            name: user.name,
            posts:user.posts
        })
    }catch(err){
        res.status(500).json({message:"Server Error!"})
    }
    

})
app.post('/logout',isLoggedIn,(req,res)=>{
    res.clearCookie("token")
    res.json({message:"Logged out successfully"})
})
app.post('/post',isLoggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({email:req.user.email}).populate('posts')
    let {content} = req.body
    let post = await postModel.create({
        user:user._id,
        content
    })
    user.posts.push(post._id)
    await user.save()
    res.json({
        message:'Post Created!',
        post
    })
    }catch(err){
        res.status(500).json({message:"Server Error!"})
    }
    
})
 app.get('/edit/:id',isLoggedIn,async(req,res)=>{
    try{
     const post = await postModel.findById(req.params.id)
res.json({
      content:post.content
}) 
    }catch(err){
        res.status(500).json({message:'Server Error!'})
    }
 })

app.put('/edit/:id',isLoggedIn,async(req,res)=>{
    try{
          const {content} = req.body
    const post = await postModel.findById(req.params.id)
    post.content = content;
      
      await post.save();
      res.status(200).json({message:"Updated Successfully!"})
    }catch(err){
        res.status(500).json({message:"Server Error!"})
    }
    })
    app.delete('/delete/:id',isLoggedIn,async(req,res)=>{
        try{
             const post = await postModel.findByIdAndDelete(req.params.id)
             res.status(200).json({message:'Post Deleted!'})
        }catch{
            res.status(500).json({message:'Server Error!'})
        }
  
    
    })










function isLoggedIn(req,res,next){
    if(req.cookies.token === "") res.json({
    message: "you must be logged in"
})
        else{
              let data = jwt.verify(req.cookies.token,'secret')
              req.user = data    
        }
        next()
}
app.listen(3000,()=>{
    console.log('Its Working');
    
})