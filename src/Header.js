import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

function Header() {
    let user = JSON.parse(localStorage.getItem('user-info'));
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    let accessToken;
    if (localStorage.getItem('user-info')) {
        accessToken = JSON.parse(localStorage.getItem('user-info')).access_token;
    }

    async function logOut() {
        let result = await fetch(`${apiUrl}/user/api/logout`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json',
                "Authorization": accessToken
            },
            credentials: 'include'
        })
        result = await result.json();
        if (result.success) {
            localStorage.clear()
            navigate("/login")
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Berhasil Logout',
                showConfirmButton: false,
                timer: 1600
            })
        }
    }

    return (
        <div>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href="#">Mentor App</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            {
                                Cookies.get('refreshToken') && localStorage.getItem('user-info') ?
                                    (
                                        JSON.parse(localStorage.getItem('user-info')).role === "mentor" ?
                                            (
                                                <>
                                                    <Link to="/add" class='navv'>Jadwal</Link>
                                                    <Link to="/dashboard" class='navv'>Dashboard</Link>
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <Link to="/mentor" class='navv'>Daftar Mentor</Link>
                                                    <Link to="/dashboard" class='navv'>Dashboard</Link>
                                                </>
                                            )
                                    )
                                    :
                                    (
                                        <>
                                            <Link to="/login" class='navv'>Login</Link>
                                            <Link to="/register" class='navv'>Register</Link>
                                        </>
                                    )
                            }
                        </Nav>

                        {Cookies.get('refreshToken') && localStorage.getItem('user-info') ?

                            <Nav style={{ marginRight: '1.5rem' }}>
                                <NavDropdown title={user && user.name}>
                                    <NavDropdown.Item><Link to="/profile" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>Profile</Link></NavDropdown.Item>
                                    <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            : null
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default Header