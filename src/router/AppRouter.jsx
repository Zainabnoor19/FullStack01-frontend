import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from '../Pages/Signup'
import About from '../Pages/About'
import Login from '../Pages/Login'
import Home from '../Pages/Home'
import Users from '../Pages/Users'  // Add this import
import DashboardLayout from '../components/DashboardLayout'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashboardLayout><Home/></DashboardLayout>}/>
        <Route path='/about' element={<DashboardLayout><About/></DashboardLayout>}/>
        <Route path='/users' element={<DashboardLayout><Users/></DashboardLayout>}/>  {/* Add this line */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter