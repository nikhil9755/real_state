import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignOut from './pages/SignOut'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home/> } />
        <Route path='/sing-in' element={<SignIn/> } />
        <Route path='/sing-out' element={<SignOut/> } />
        <Route path='/about' element={<About/> } />
        <Route path='/profile' element={<Profile/> } />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App