import Header from "./Header"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { InputGroup, Dropdown, DropdownButton } from "react-bootstrap";

function AddSchedule() {
    const navigate = useNavigate()
    useEffect(() => {
        if (JSON.parse(localStorage.getItem('user-info')).data.posisi === "mentor") {
            navigate("/add")
        } else if (JSON.parse(localStorage.getItem('user-info')).data.posisi === "murid") {
            navigate("/mentor")
        }
    }, [])

    const [kuota, setKuota] = useState("");
    const [date, setDate] = useState("Date.now()");
    const [dropdownValue1, setDropdownValue1] = useState("8");
    const [dropdownValue2, setDropdownValue2] = useState("AM");
    const [calorieHistory, setCalorieHistory] = useState([]);
    let uid = JSON.parse(localStorage.getItem('user-info')).data.uid;

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
        let item = { time: `${dropdownValue1} ${dropdownValue2}`, date, kuota };
        let result = await fetch(`/users/${uid}/schedule`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
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
            let result = await fetch(`/users/${uid}/schedule`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            if (Array.isArray(result.data)) {
                setCalorieHistory(result.data);
            } else {
                console.log('Data returned from API is not an array');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function deleteProduct(docId) {
        let result = await fetch(`/users/${uid}/jadwal/${docId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
        });

        result = await result.json();
        if (result.success) {
            // Refresh list of products after successful deletion
            fetchSchedule();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Jadwal berhasil dihapus',
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

                <InputGroup style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: "2rem" }}>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ marginRight: '1rem', maxWidth: '200px' }} className="form-control" />
                    <DropdownButton

                        variant="info"
                        title={dropdownValue1}
                        id="input-group-dropdown-1"
                    >
                        <Dropdown.Item onClick={() => setDropdownValue1('1')}>1</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('2')}>2</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('3')}>3</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('4')}>4</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('5')}>5</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('6')}>6</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('7')}>7</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('8')}>8</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('9')}>9</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('10')}>10</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('11')}>11</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue1('12')}>12</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton

                        variant="outline-primary"
                        title={dropdownValue2}
                        id="input-group-dropdown-2"
                    >
                        <Dropdown.Item onClick={() => setDropdownValue2('AM')}>AM</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdownValue2('PM')}>PM</Dropdown.Item>
                    </DropdownButton>
                </InputGroup>
                <br />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', maxWidth: '900px' }}>
                    <input type="number" value={kuota} onChange={(e) => setKuota(e.target.value)} placeholder="Kuota" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                </div>
                <br />
                <br />
                <button onClick={addSchedule} className="btn btn-primary" style={{ marginTop: "1rem" }}>Tambah</button>

            </div>
            <div className="row align-items-center " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {calorieHistory.length > 0 ? (
                    calorieHistory.map((item) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 my-4">
                            <div className="card mx-auto" style={{ width: '18rem' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Tanggal: {item.date}</h5>
                                    <p className="card-text">Waktu: {item.time}</p>
                                    <p className="card-text">Kuota: {item.kuota}</p>
                                    <button className="btn btn-danger" onClick={() => deleteProduct(item.docId)}>Hapus</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ marginTop: '100px' }}>
                        <div className="">
                            <p className="">Jadwal Belum Dipilih</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default AddSchedule