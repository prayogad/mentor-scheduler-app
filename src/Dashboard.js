import Header from "./Header"
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [dashboardData, setDashboardData] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        fetchDashboard();
    }, []);

    async function fetchDashboard() {
        const uid = JSON.parse(localStorage.getItem('user-info')).id;
        const accessToken = JSON.parse(localStorage.getItem('user-info')).access_token;
        try {
            let result = await fetch(`${apiUrl}/user/api/dashboard`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json',
                    "Authorization": accessToken
                },
                credentials: 'include'
            });
            result = await result.json();
            if (result.success && Array.isArray(result.data)) {
                setDashboardData(result.data);
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
                                    <h5 className="card-title">Tanggal: {new Date(item.scheduledAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</h5>
                                    <p className="card-text">Nama Murid: {item.student_name}</p>
                                    <p className="card-text">Nama Mentor: {item.mentor_name}</p>
                                    <p className="card-text">Field: {item.field}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Dashboard Empty</p>
                )}
            </div>
        </div>
    )
}

export default Dashboard;