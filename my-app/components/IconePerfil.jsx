import React from 'react';
import { Link } from 'react-router-dom';

const IconePerfil = ({ token }) => {
    // Se o usuário está logado (tem token), vai para perfil, senão vai para login
    const linkDestino = token ? "/perfil" : "/login";
    
    return ( 
        <Link to={linkDestino} className="linkBarra">
            <img src="/imagens/do-utilizador9.png" width="30px" alt="Perfil do usuário"/>
        </Link>
     );
}
 
export default IconePerfil;