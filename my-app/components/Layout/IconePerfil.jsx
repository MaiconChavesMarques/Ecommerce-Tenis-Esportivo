import React from 'react';
import { Link } from 'react-router-dom';

const IconePerfil = ({ token }) => {
    // Define o destino do link baseado na presença do token (usuário logado ou não)
    const linkDestino = token ? "/perfil" : "/login";
    
    return ( 
        // Link que direciona para a página de perfil ou login, com ícone de usuário
        <Link to={linkDestino} className="linkBarra">
            <img src="/imagens/do-utilizador9.png" width="30px" alt="Perfil do usuário"/>
        </Link>
     );
}
 
export default IconePerfil;
