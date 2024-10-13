import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Swal from 'sweetalert2'

function MentorDetail() {
    const { uid } = useParams();
    const [mentorDetail, setMentorDetail] = useState({});
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        fetchMentorDetail();
    }, []);

    async function fetchMentorDetail() {
        try {

            let result = await fetch(`/users/${uid}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            setMentorDetail(result.data);
            setSchedule(result.data.jadwal.filter(item => item.date && item.time));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function registerToSchedule(docId) {
        const studentId = JSON.parse(localStorage.getItem('user-info')).data.uid;
        let result = await fetch(`/dashboard/${studentId}`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({
                uidMentor: mentorDetail.uid,
                docId: docId,
            })
        });
        result = await result.json();
        console.log(result.message);
        if (result.success) {
            fetchMentorDetail()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Jadwal Berhasil Didaftarkan',
                showConfirmButton: false,
                timer: 1600
            })
        } else if (result.message === "Kuota sudah habis") {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Kuota Sudah Habis',
                showConfirmButton: false,
                timer: 1600
            })
        }
    }
    return (
        <div >
            <Header />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{marginBottom: '2rem'}}>Detail Mentor</h1>
                <div className="card" style={{ width: '18rem' }}>
                    <img className="card-img-top" src={mentorDetail.picture} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Nama: {mentorDetail.username}</h5>
                        <p className="card-text">Bidang: {mentorDetail.bidang}</p>
                        <p className="card-text">Email: {mentorDetail.email}</p>
                        <p className="card-text">Phone: +{mentorDetail.phone}</p>
                    </div>
                </div>
                <br />
                <br />
            </div>
            <br />
            <div className='row align-items-center' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <h2>Ketersediaan Jadwal</h2>
                {schedule.length > 0 ? (
                    schedule.map((item) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 my-4">
                            <div className="card mx-auto" style={{ width: '18rem' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Tanggal: {item.date}</h5>
                                    <p className="card-text">Waktu: {item.time}</p>
                                    <p className="card-text">Kuota: {item.kuota}</p>
                                    <button onClick={(e) => registerToSchedule(item.id)} className='btn btn-success'>Daftar</button>
                                    <br />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                    <p style={{margin: '45px'}}>Tidak aja jadwal yang tersedia</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MentorDetail;