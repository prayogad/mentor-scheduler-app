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
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [phone, setPhone] = useState("+62")
    const [posisi, setPosisi] = useState("")
    const [bidang, setBidang] = useState("")
    const navigate = useNavigate()

    async function register() {
        try {
            let item = { email, password, username, phone, posisi, bidang }
            if (posisi === 'mentor') {
                item.posisi = posisi;
            }
            console.warn(item)

            let result = await fetch("/register", {
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
                    title: 'Berhasil register, silahkan login',
                    showConfirmButton: false,
                    timer: 1600
                })
            } else if (result.message == "That email is already taken") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'That email is already taken ',
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
            } else if (result.message == "\"username\" must only contain alpha-numeric characters" 
                        || result.message == "\"username\" is not allowed to be empty" 
                        || result.message == "Username must be between 3 and 20 characters") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Username minimal 3 karakter dan tanpa spasi',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"bidang\" is required" 
                        || result.message == "\"bidang\" is not allowed to be empty" 
                        || result.message == "\"bidang\" must be a string") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Silahkan pilih bidang terlebih dahulu',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"posisi\" is required" 
                        || result.message == "\"posisi\" must be one of [mentor, murid]") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Silahkan pilih posisi terlebih dahulu',
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
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                className="form-control" placeholder="Nama" />
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
                    <label className="form-label"><strong>Daftar Sebagai</strong></label>
                    <div className="form-check">
                        <input type="radio" value="murid" checked={posisi === 'murid'} onChange={(e) => setPosisi(e.target.value)} 
                        id="murid" name="posisi" className="form-check-input" />
                        <label htmlFor="murid" className="form-check-label">Murid</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" value="mentor" checked={posisi === 'mentor'} onChange={(e) => setPosisi(e.target.value)} 
                        id="mentor" name="posisi" className="form-check-input" />
                        <label htmlFor="mentor" className="form-check-label">Mentor</label>
                    </div>
                </div>

                {posisi === 'mentor' &&
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Bidang</strong></label>
                        <select onChange={(e) => setBidang(e.target.value)} className="form-control">
                            <option value="">Pilih Bidang</option>
                            <option value="Frontend Web">Frontend Web</option>
                            <option value="Backend Web">Backend Web</option>
                            <option value="Fullstack Web">Fullstack Web</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="Machine Learning">Machine Learning</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="UI/UX">UI/UX</option>
                            <option value="DevOps">DevOps</option>
                            <option value="IoT">IoT</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="IT Support">IT Support</option>
                            <option value="Game Development">Game Development</option>
                            <option value="Project Management">Project Management</option>
                        </select>
                    </div>
                }
                <br />
                <button onClick={register} className="btn btn-primary" style={{ width: '6rem' }}>Register</button>
            </div>
            </div>
        </div>
    )
}
export default Register