import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Protected(props) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let Cmp = props.Cmp;
    
    const isTokenExpired = () => {
        const expirationTime = localStorage.getItem('expirationTime');
        if (!expirationTime) return true;

        return Date.now() > parseInt(expirationTime, 10); // Check if current time is greater than expiration time
    };

    const refreshToken = async () => {
        try {
            let result = await fetch(`${apiUrl}/user/refresh-token`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                credentials: 'include'
            });
            result = await result.json();
            if (result.success) {
                const expirationTime = Date.now() + (15 * 60 * 1000)
                localStorage.setItem("user-info", JSON.stringify(result.data))
                localStorage.setItem('expirationTime', expirationTime);
                // return data.accessToken;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true; // add flag
        if (isTokenExpired()) {
            localStorage.removeItem('user-info');
            localStorage.removeItem('expirationTime');
        }
        if (!localStorage.getItem('user-info')) {
            if (Cookies.get('refreshToken')) {
                refreshToken()
                // navigate(0)
            } else {
                navigate("/login");
            }
        } else {
            if (isMounted) setIsLoggedIn(true);
        }
        return () => { isMounted = false };
    }, [navigate]);
    return (
        <div>
            {isLoggedIn && <Cmp />}
        </div>
    )
}

export default Protected;