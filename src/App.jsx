import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Redirect from './components/Redirect';
import EditProduct from './pages/EditProduct';
import DeleteProduct from './pages/DeleteProduct';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/home" element={<ProtectedRoute element={<Home/>} redirect={"/login"}/>} />
          <Route path="/add-product" element={<ProtectedRoute element={<AddProduct/>} redirect={'/login'}/>} />
          <Route path="/edit-product" element={<ProtectedRoute element={<EditProduct/>} redirect={'/login'}/>} />
          <Route path="/login" element={<Login />} />
          <Route path='*' element={<Redirect redirectAddress={'/login'}/>} />
        </Routes>
      </Router>
  )
}

export default App
