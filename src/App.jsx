import { useState } from 'react'
import Signup from './Pages/Signup'
import {AuthContext} from './context/AuthContext'
import AppRouter from './router/AppRouter'






function App() {


  return (
   <AuthContext>

     <AppRouter/>
  
    </AuthContext>
  
  )
}

export default App
