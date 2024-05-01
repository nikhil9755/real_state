import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignOut from './pages/SignOut'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/Header'
import SignUp from './pages/SignUp';
import PrivateRouter from './components/PrivateRouter';
import CreateListing from './pages/CreateListing';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home/> } />
        <Route path='/sign-in' element={<SignIn/> } />
        <Route path='/sign-out' element={<SignOut/> } />
        <Route path='/about' element={<About/> } />
        <Route element={<PrivateRouter/>}>
          <Route path='/profile' element={<Profile/> } />
          <Route path='/create-listing' element={<CreateListing/>}></Route>
        </Route>
        <Route path='/sign-up' element={<SignUp/> } />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App