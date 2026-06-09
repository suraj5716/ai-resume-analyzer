import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Features from './pages/Features'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import ResumeBuilder from './pages/ResumeBuilder'
import Templates from './pages/Templates'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Contact from './pages/Contact'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/analyzer" element={<ResumeAnalyzer />} />
          <Route path="/builder" element={
            <ProtectedRoute><ResumeBuilder /></ProtectedRoute>
          } />
          <Route path="/templates" element={<Templates />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
