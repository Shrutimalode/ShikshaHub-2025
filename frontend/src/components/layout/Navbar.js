import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const AppNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <>
      <Nav className="me-auto">
        {user && user.role === 'admin' && (
          <Button as={Link} to="/communities/create" variant="outline-primary" className="me-2" size="sm">Create Community</Button>
        )}
      </Nav>
      <Nav>
        <NavDropdown title={user ? (
          <span className="navbar-text me-3" style={{ marginRight: '2rem', fontSize: '1.1rem', fontWeight: '500' }}>
            Welcome, {user.name}
          </span>
        ) : 'Account'} id="basic-nav-dropdown">
          <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </>
  );

  const guestLinks = (
    <Nav className="ms-auto">
      <Button as={Link} to="/login" variant="outline-primary" className="me-2" size="sm">Login</Button>
      <Button as={Link} to="/register" variant="primary" size="sm">Register</Button>
    </Nav>
  );

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-primary" style={{ marginLeft: '-6rem', fontSize: '1.2rem' }}>
          <i className="fas fa-book-reader me-2"></i>
          ShikshaHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <>
              {authLinks}
            </>
          ) : (
            guestLinks
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar; 