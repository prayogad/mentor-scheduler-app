import React, { useState, useEffect } from 'react'
import Header from './Header'

function Profile() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [userData, setUserDetail] = useState({});

    useEffect(() => {
        fetchUserProfile();
    }, []);

    async function fetchUserProfile() {
        // const uid = JSON.parse(localStorage.getItem('user-info')).id;
        const accessToken = JSON.parse(localStorage.getItem('user-info')).access_token;

        try {
            let result = await fetch(`${apiUrl}/user/api/current`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json',
                    "Authorization": accessToken
                },
                credentials: 'include'
            });
            result = await result.json();

            if (result.success && result.data) {
                setUserDetail(result.data);
            }

            
            // fetchUserProfile();

        } catch (error) {
            console.warn("Error fetching user data", error);
        }
    }
    return (
        <div>
            <Header />
            <br />
            <h1>Profile</h1>
            <br />
            <div className="row align-items-start px-3" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div className='col my-2'>
                    <div className='card mx-2 border-0'>
                        <div className='card-body' style={{ lineHeight: '2.3rem' }}>
                            <p>Nama: {userData.name}</p>
                            <p>Email: {userData.email}</p>
                            <p>Nomor Telepon: +{userData.phone}</p>
                            <p>Role: {userData.role}</p>
                            {JSON.parse(localStorage.getItem('user-info')).role === 'mentor' ?
                                <>
                                <p>Bidang: {userData.field}</p>
                                <p>Bio: {userData.bio}</p>
                                </>
                                :
                                null
                            }

                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default Profile;