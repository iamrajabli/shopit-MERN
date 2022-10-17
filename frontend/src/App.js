import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import { useEffect } from 'react';
import './App.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails'

import Login from './components/user/Login';
import Register from './components/user/Register';

import { loadUser } from './redux/actions/user.actions';
import store from './store'
import Profile from './components/user/Profile';

import ProtectedRoute from './components/route/ProtectedRoute';

function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className="App">
        <Header />
        <div className='container container-fluid'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search/:keyword' element={<Home />} />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            {/* <Route path='/me' element={<Profile />} /> */}

            <Route path='/me' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
