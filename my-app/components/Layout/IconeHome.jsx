import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para navegação programática

const IconeHome = () => {
    const navigate = useNavigate(); // Hook para controlar navegação

    return (
        // Div clicável que navega para "/home" ao ser clicada
        <div onClick={() => navigate("/home")} className="linkBarra">
            Home
        </div>
    );
}

export default IconeHome;
