import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para navegação via rota declarativa

const IconeIA = () => {
    return (  
        // Link que leva para a rota "/chat" com ícone de IA
        <Link to="/chat" className="linkBarra">
            <img src="/imagens/tecnologia-de-ia(1)(1).png" width="30px" alt="Ícone IA"/>
        </Link>
     );
}
 
export default IconeIA;
