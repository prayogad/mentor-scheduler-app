import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Protected(props) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let Cmp = props.Cmp;

    useEffect(() => {
        let isMounted = true; // add flag
        if (false) {
            navigate("/login");
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