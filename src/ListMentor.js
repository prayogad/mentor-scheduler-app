import Header from "./Header"
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ListMentor() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [mentors, setMentors] = useState([]);

    useEffect(() => {
        fetchMentors();
    }, []);

    async function fetchMentors() {
        try {
            let result = await fetch(`${apiUrl}/mentor`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            if (Array.isArray(result.data)) {
                setMentors(result.data);
            } else {
                console.error('Data returned from API is not an array');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div>
            <Header />
            <br />
            <h1>Daftar Mentor</h1>
            <br />
            <div className="row align-items-center" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                {mentors.length > 0 ? (
                    mentors.map((mentor) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 my-4">
                            <Link to={`/mentor/${mentor.id}`} style={{ textDecoration: 'none' }}>
                                <div className="card mx-auto" style={{ width: '15rem' }}>
                                    <img className="card-img-top" src={mentor.picture} alt="Card image cap" />
                                    <div className="card-body">
                                        <h5 className="card-title">{mentor.name}</h5>
                                        <p className="card-text">Field: {mentor.field}</p>
                                        <p className="card-text">Email: {mentor.email}</p>
                                        <p className="card-text">Phone: +{mentor.phone}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div style={{ marginTop: '100px' }}>
                        <div className="">
                            <p className="">Tidak ada mentor yang ditemukan</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListMentor