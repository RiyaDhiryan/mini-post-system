import {Routes,Route} from 'react-router-dom'
import Register from './Components/Register';
import Login from './Components/Login';
import Profile from './Components/Profile';
import Edit from './Components/Edit';
function app(){
  return(
   <Routes>
            <Route path='/' element = {<Register/>} />
            <Route path='/login'element={<Login/>} />
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/edit/:id' element={<Edit/>}/>
   </Routes>
  )
}
export default app;