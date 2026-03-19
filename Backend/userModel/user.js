const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/miniProject01')
const userModel = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    posts:[
         { type:mongoose.Schema.Types.ObjectId,
            ref:"post"
          }
    ]
})
module.exports = mongoose.model("user",userModel)
