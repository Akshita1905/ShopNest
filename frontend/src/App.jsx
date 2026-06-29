import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import  Home  from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './pages/About'
import Disclaimer from './pages/Disclaimer'
import ReturnPolicy from './pages/ReturnPolicy'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/return" element={<ReturnPolicy />}/>
        <Route path="/disclaimer" element={<Disclaimer/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/products/:id" element={<ProductDetail/>}/>


      </Routes>
      <Footer />
    </Router>
  )
}

export default App

