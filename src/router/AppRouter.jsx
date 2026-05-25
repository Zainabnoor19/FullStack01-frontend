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
import ProtectedRoute from '../components/ProtectedRoute'  // Add this

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashboardLayout><Home/></DashboardLayout>}/>
        <Route path='/about' element={<DashboardLayout><About/></DashboardLayout>}/>
        <Route path='/users' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><Users/></DashboardLayout>
          </ProtectedRoute>
        }/>
        <Route path='/analytics' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><Analytics/></DashboardLayout>
          </ProtectedRoute>
        }/>
        <Route path='/my-profile' element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <DashboardLayout><MyProfile/></DashboardLayout>
          </ProtectedRoute>
        }/>
        <Route path='/my-activity' element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <DashboardLayout><MyActivity/></DashboardLayout>
          </ProtectedRoute>
        }/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter