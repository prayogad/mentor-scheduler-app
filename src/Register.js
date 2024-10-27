import Header from "./Header"
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

function Register() {
    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            navigate("/add")
        }
    }, [])
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("+62");
    const [role, setRoles] = useState("");
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    async function register() {
        try {
            let item = { email, password, name, phone, role }
            if (role === 'mentor') {
                item.role = role;
            }
            let result = await fetch(`${apiUrl}/user/register`, {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            })
            result = await result.json()
            if (result.success) {
                navigate("/login")
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Successfully Register',
                    showConfirmButton: false,
                    timer: 1600
                })
            } else if (result.message == "email already registered") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Email Is Already Registered',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"email\" must be a valid email" 
                        || result.message == "\"email\" is not allowed to be empty") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Tolong masukan alamat email yang valid',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "Password must be at least 6 characters long" 
                        || result.message == "\"password\" is not allowed to be empty") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Password minimal 6 karakter',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"name\" must only contain alpha-numeric characters" 
                        || result.message == "\"name\" is not allowed to be empty" 
                        || result.message == "Username must be between 3 and 20 characters") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Username minimal 3 karakter dan tanpa spasi',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"role\" is required" 
                        || result.message == "\"role\" must be one of [mentor, murid]") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Silahkan pilih role terlebih dahulu',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"phone\" is not allowed to be empty" 
                        || result.message == "\"phone\" must be a number" 
                        || result.message == "\"phone\" is required" 
                        || result.message == "\"phone\" must be greater than or equal to 70") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Nomor handphone tidak valid',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }
    return (
        <div>
            <Header />
            <div className="col-sm-6 offset-sm-3 align-items-center mx-auto" >
                <div style={{ margin: '20px' }}>
                <h1>Halaman Register</h1>
                <br />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                className="form-control" placeholder="Email" />
                <br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                className="form-control" placeholder="Password" />
                <br />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} 
                className="form-control" placeholder="Name" />
                <br />

                <div className="mb-3 text-start">
                    <label htmlFor="phone" className="form-label"><strong>Phone</strong></label>
                    <div>
                        <input
                            type="phone"
                            id="phone"
                            value={phone}
                            onChange={(e) => {
                                if (e.target.value.startsWith('+62')) {
                                    setPhone(e.target.value);
                                } else {
                                    setPhone('+62' + e.target.value.slice(2));
                                }
                            }}
                            className="form-control"
                        />
                    </div>
                </div>
                <br />

                <div className="mb-3 text-start">
                    <label className="form-label"><strong>Register As :</strong></label>
                    <div className="form-check">
                        <input type="radio" value="student" checked={role === 'student'} onChange={(e) => setRoles(e.target.value)} 
                        id="student" name="role" className="form-check-input" />
                        <label htmlFor="student" className="form-check-label">Student</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" value="mentor" checked={role === 'mentor'} onChange={(e) => setRoles(e.target.value)} 
                        id="mentor" name="role" className="form-check-input" />
                        <label htmlFor="mentor" className="form-check-label">Mentor</label>
                    </div>
                </div>
                <br />
                <button onClick={register} className="btn btn-primary" style={{ width: '6rem' }}>Register</button>
            </div>
            </div>
        </div>
    )
}
export default Register