import './App.css';
import './Tailwind.css';
import './Reset.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import Login from './components/Login/Login';
import Main from './components/Main/Main';
import NewCategory from './components/Categories/NewCategory';
import CategoryList from './components/Categories/CategoryList';
import NewProduct from './components/Main/NewProduct';
import ProductDetail from './components/Main/ProductDetail';
import EditProduct from './components/Main/EditProduct';

function App() {
        // Efeitos
        useEffect(() => {
          ScrollReveal({
              reset: true,
              distance: '80px',
              duration: 1000,
              delay: 200
          });
  
          ScrollReveal().reveal('.c-header', { origin: 'top' });
          ScrollReveal().reveal('.p-left', { origin: 'bottom' });
          ScrollReveal().reveal('.sidebar, .get-text', { origin: 'left' });
          ScrollReveal().reveal('.c-right, .card-login', { origin: 'right' });
      }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/category/create" element={<NewCategory />} />

        <Route path="/product/create" element={<NewProduct />} />
        <Route path="/products/detail/:id" element={<ProductDetail />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
