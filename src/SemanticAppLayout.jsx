import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


// Import all of my homemade components
import './internationalization/i18n';
import Login from './components/User/Login';
import CreateUser from './components/User/CreateUser.jsx';
import UpdateUser from './components/User/UpdateUser';
import DeleteUser from './components/User/DeleteUser';
import CartHistory from './components/User/CartHistory';
import Logout from './components/User/Logout';
import UserContext from './context/UserContext';
import Homepage from './components/Homepage';
import ShoppingCart from './components/Product/ShoppingCart';
import NotFound from './components/NotFound';
import AccessDenied from './components/AccessDenied';

//import styles & bootstrap to make the webpages gorgeous
import './AppStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient(); // QueryClient() helps to manage caching


function SemanticAppLayout() {
  const [user, setUser] = useState({ name: '', isLoggedIn: false });
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);  // Change the language
    localStorage.setItem('language', language);  // Store language choice in localStorage
  };
  

  useEffect(() => {
    // Check for existing user session when app loads
    const storedUser = localStorage.getItem('userSession');
    if (storedUser) {
      const userSession = JSON.parse(storedUser);
      if (userSession.isLoggedIn) {
        setUser(userSession); // Set user state if logged in
      }
    }
  }, []); // Only run on mount

  useEffect(() => {
    // Check for stored language preference in localStorage
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);  // Set the language if it exists
    } else {
      i18n.changeLanguage('en');  // Default to English if no preference is found
    }
  }, [i18n]);  // Only run on mount  

  return (
    // provides access to everything that it wraps to react-query functionality
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}>
        <Navbar bg="light" expand="lg" className="px-5" as="header" role="navigation">
          <Navbar.Brand href="/" aria-label="Homepage">{t('home')}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle Navigation"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto" as="nav" role="menubar">
              <Nav.Link href="/create-user" role="menuitem">{t('createUser')}</Nav.Link>
              {user.isLoggedIn ? ( 
                <>
                  <Nav.Link href="/update-user" role="menuitem">{t('updateUser')}</Nav.Link>
                  <Nav.Link href="/delete-user" role="menuitem">{t('deleteUser')}</Nav.Link>
                  <Nav.Link href="/cart-history" role="menuitem">{t('cartHistory')}</Nav.Link>
                  <Nav.Link href="/cart" role="menuitem">{t('shoppingCart')}</Nav.Link>
                </>
              ) : ""}
            </Nav>
            <Nav className="mr-auto" as="nav" role="menubar">
              <Nav.Link onClick={() => changeLanguage('en')}>English</Nav.Link>
              <Nav.Link onClick={() => changeLanguage('fr')}>Français</Nav.Link>
            </Nav>
            <Nav className="ms-auto" as="nav" role="menubar">
                {user.isLoggedIn ? (
                  <>
                    <Nav.Link role="menuitem" aria-label="user signed in" className="d-flex align-items-center text-success" disabled>{t('signedInAs')} {user.username}</Nav.Link>
                    <Nav.Link href="/logout" role="menuitem">
                        <Button variant="danger" aria-label="logout from application">{t('logout')}</Button>
                    </Nav.Link>
                  </>
                ) : (
                  <Nav.Link href="/login" role="menuitem">
                    <Button variant="primary" aria-label="login to application">{t('login')}</Button>
                  </Nav.Link>
                )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Router>
            <main id="main-content" tabIndex="-1">
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/home" element={<Homepage />} />
                    <Route path="/create-user" element={<CreateUser />} />
                    {user.isLoggedIn ? (
                    <>
                      <Route path="/update-user" element={<UpdateUser />} />
                      <Route path="/delete-user" element={<DeleteUser />} />
                      <Route path="/cart-history" element={<CartHistory />} />
                      <Route path="/cart" element={<ShoppingCart />} />
                      <Route path="/logout" element={<Logout />} />
                    </>
                        ) : (
                    <>
                      <Route path="/update-user" element={<AccessDenied />} />
                      <Route path="/delete-user" element={<AccessDenied />} />
                      <Route path="/cart-history" element={<AccessDenied />} />
                      <Route path="/cart" element={<AccessDenied />} />
                      <Route path="/logout" element={<AccessDenied />} />
                    </>
                        )}
                    <Route path="*" element={<NotFound />} />          
                </Routes>
            </main>
        </Router>

      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default SemanticAppLayout;