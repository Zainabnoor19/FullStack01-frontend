import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from '../Pages/Signup'
import About from '../Pages/About'
import Login from '../Pages/Login'
import Home from '../Pages/Home'
import Users from '../Pages/Users'
import Analytics from '../Pages/Analytics'
import MyProfile from '../Pages/MyProfile'
import MyActivity from '../Pages/MyActivity'
import DashboardLayout from '../components/DashboardLayout'
import TestToken from '../Pages/TestToken'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashboardLayout><Home/></DashboardLayout>}/>
        <Route path='/about' element={<DashboardLayout><About/></DashboardLayout>}/>
        <Route path='/users' element={<DashboardLayout><Users/></DashboardLayout>}/>
        <Route path='/analytics' element={<DashboardLayout><Analytics/></DashboardLayout>}/>
        <Route path='/my-profile' element={<DashboardLayout><MyProfile/></DashboardLayout>}/>
        <Route path='/my-activity' element={<DashboardLayout><MyActivity/></DashboardLayout>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/test-token' element={<TestToken/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter