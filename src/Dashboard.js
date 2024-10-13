import Header from "./Header"
import React, { useEffect, useState } from 'react';

function Dashboard() {
    const [dashboardData, setDashboardData] = useState([]);

    useEffect(() => {
        fetchDashboard();
    }, []);

    async function fetchDashboard() {
        const uid = JSON.parse(localStorage.getItem('user-info')).data.uid;
        try {
            let result = await fetch(`/users/dashboard/${uid}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            if (result.success && Array.isArray(result.data)) {
                setDashboardData(result.data);
            } else {
                console.log('Data returned from API is not an array');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div>
            <Header />
            <br />
            <h1>Dashboard Sesi Mentoring</h1>
            <br />
            <div className="row align-items-start px-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                {dashboardData.length > 0 ? (
                    dashboardData.map((item) => (
                        <div className="col my-2">
                            <div className="card mx-2">
                                <div className="card-body text-start">
                                    <h5 className="card-title">Tanggal: {item.date}</h5>
                                    <p className="card-text">Waktu: {item.time}</p>
                                    <p className="card-text">
                                        {JSON.parse(localStorage.getItem('user-info')).data.posisi === 'mentor' ?
                                            `Nama Murid: ${item.namaMurid}`
                                            :
                                            `Nama Mentor: ${item.namaMentor}`
                                        }
                                    </p>
                                    <p className="card-text">
                                        {JSON.parse(localStorage.getItem('user-info')).data.posisi === 'mentor' ?
                                            `Email Murid: ${item.emailMurid}`
                                            :
                                            `Email Mentor: ${item.emailMentor}`
                                        }
                                    </p>
                                    <p className="card-text">
                                        {JSON.parse(localStorage.getItem('user-info')).data.posisi === 'mentor' ?
                                            `Nomor Telepon Murid: +${item.phoneMurid}`
                                            :
                                            `Nomor Telepon Mentor: +${item.phoneMentor}`
                                        }
                                    </p>
                                    <p className="card-text">
                                        {JSON.parse(localStorage.getItem('user-info')).data.posisi === 'mentor' ?
                                            null
                                            :
                                            `Bidang Mentor: ${item.bidangMentor}`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Belum ada perjanjian mentoring</p>
                )}
            </div>
        </div>
    )
}

export default Dashboard;