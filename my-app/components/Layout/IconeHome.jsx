import React from 'react';
import { useNavigate } from 'react-router-dom';

const IconeHome = () => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate("/home")} className="linkBarra">
            Home
        </div>
    );
}

export default IconeHome;