import Header from "./Header"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { InputGroup, Dropdown, DropdownButton } from "react-bootstrap";

function AddSchedule() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate()
    
    useEffect(() => {
        if (JSON.parse(localStorage.getItem('user-info')).role === "mentor") {
            navigate("/add")
        } else if (JSON.parse(localStorage.getItem('user-info')).posisi === "murid") {
            navigate("/mentor")
        }
    }, [])

    const getCurrentDateTime = () => {
        const now = new Date();
        return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, -8);  // Remove seconds and milliseconds
    };

    const [kuota, setKuota] = useState("");
    const [date, setDate] = useState(getCurrentDateTime());
    const [mentorSchedule, setMentorSchedule] = useState([]);
    let uid = JSON.parse(localStorage.getItem('user-info')).id;
    const accessToken = JSON.parse(localStorage.getItem('user-info')).access_token;

    useEffect(() => {
        fetchSchedule();
    }, []);

    useEffect(() => {
        const today = new Date();
        const dateStr =
            [today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, '0'),
            String(today.getDate()).padStart(2, '0')
            ].join('-');

        setDate(dateStr);
    }, []);

    async function addSchedule() {
        let item = { scheduledAt: date, quota: Number(kuota) };
        let result = await fetch(`${apiUrl}/session/api/addSession`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json',
                "Authorization": accessToken
            },
            credentials: 'include',
            body: JSON.stringify(item)
        });
        result = await result.json();
        if (result.success) {
            fetchSchedule();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Jadwal berhasil ditambahkan',
                showConfirmButton: false,
                timer: 1600
            })
        } else if (result.message === "\"kuota\" must be a number" || result.message === "\"kuota\" must be a positive number") {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Kuota belum dimasukan',
                showConfirmButton: false,
                timer: 1600
            })
        }
    }
    async function fetchSchedule() {
        try {
            let result = await fetch(`${apiUrl}/session/getSession/${uid}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            if (Array.isArray(result.data)) {
                setMentorSchedule(result.data);
            } else {
                console.error('Data returned from API is not an array');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function deleteSchedule(docId) {
        let result = await fetch(`${apiUrl}/session/api/deleteSession/${docId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json',
                "Authorization": accessToken
            },
            credentials: 'include',
        });

        result = await result.json();
        if (result.success) {
            // Refresh list of products after successful deletion
            fetchSchedule();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Schedule Deleted Successfully',
                showConfirmButton: false,
                timer: 1600
            })
        } else {
            console.error("Failed to delete product", result);
        }
    }
    
    return (
        <div>
            <Header />
            <br />
            <div className="align-items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1>Ketersediaan Jadwal</h1>

                <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ marginRight: '1rem', maxWidth: '200px', marginTop: "2rem" }} 
                    className="form-control"
                    type="datetime-local"
                    name="date"
                    // defaultValue={getCurrentDateTime()}
                />
    
                <br />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', maxWidth: '900px' }}>
                    <input type="number" value={kuota} onChange={(e) => setKuota(e.target.value)} placeholder="Kuota" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                </div>
                <br />
                <br />
                <button onClick={addSchedule} className="btn btn-primary" style={{ marginTop: "1rem" }}>Tambah</button>

            </div>
            <div className="row align-items-center " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {mentorSchedule.length > 0 ? (
                    mentorSchedule.map((item) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 my-4">
                            <div className="card mx-auto" style={{ width: '18rem', height: '180px' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Waktu:</h5>
                                    <h5 className="card-title">{new Date(item.scheduledAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</h5>
                                    <p className="card-text">Kuota: {item.quota}</p>
                                    <button className="btn btn-danger" onClick={() => deleteSchedule(item.id)}>Hapus</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ marginTop: '100px' }}>
                        <div className="">
                            <p className="">Jadwal Belum Dimasukkan</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default AddSchedule