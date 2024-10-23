import Header from "./Header";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

function Login() {
    useEffect(() => {
        if (localStorage.getItem('user-info') && Cookies.get('refreshToken')) {
            navigate("/dashboard")
        }
    }, [])
    const apiUrl = process.env.REACT_APP_API_URL;
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    async function login() {
        try {
            let item = { email, password }
            let result = await fetch(`${apiUrl}/user/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify(item),
                credentials: 'include'
            })
            result = await result.json();
            if (result.success) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Login Success',
                    showConfirmButton: false,
                    timer: 1500
                })
                const expirationTime = Date.now() + (15 * 60 * 1000)
                localStorage.setItem("user-info", JSON.stringify(result.data))
                localStorage.setItem('expirationTime', expirationTime);
                navigate("/dashboard")
            } else if (result.message == "email or password wrong") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Email or Password Wrong!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Error',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error logging in user:', error);
        }
    }
    return (
        <div>
            <Header />
            <div className="col-sm-6 offset-sm-3 align-items-center mx-auto" >
                <div style={{ margin: '20px' }}>
                    <h1>Halaman Login</h1>
                    <br />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="form-control" />
                    <br />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="form-control" />
                    <br />
                    <button onClick={login} className="btn btn-primary" style={{ width: '6rem' }}>Login</button>
                    <br />
                    <br />
                    <Link to="/register"><button className="btn btn-warning" style={{ width: '6rem' }}>Register</button></Link>
                </div>
            </div>
        </div>
    )
}

export default Login