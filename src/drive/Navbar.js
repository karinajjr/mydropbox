import React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'

export default function NavbarComponent() {
  return (
    <Navbar bg="light" expanded="sm">
       <Navbar.Brand as={Link} to="/">
        Dropboxs
        </Navbar.Brand> 
        <Nav>
            <Nav.Link as={Link} to="/user">
                Profile
            </Nav.Link>
        </Nav>
    </Navbar>
  )
}

