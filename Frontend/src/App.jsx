import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Signup from './pages/Signup'
import CurrentIssueDetails from './pages/CurrentIssueDetails'
import IssueDetailsPage from './pages/CurrentIssueDetails'
import CreateIssueForm from './pages/CreateIssue'
import Footer from './components/Footer'


function App() {


  return (
    <>



      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/login' element={<Loginpage />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/active-issue' element={<IssueDetailsPage />} />
          <Route path='/create-issue' element={<CreateIssueForm />} />
          <Route path="/active-issue/:id" element={<IssueDetailsPage />} />

        </Routes>
        <Footer />
      </BrowserRouter>


    </>
  )
}

export default App
