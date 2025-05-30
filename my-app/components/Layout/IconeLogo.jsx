import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para navegação declarativa via rota

const IconeLogo = () => {
    return ( 
        // Link que redireciona para a página inicial "/home" com o logo da loja
        <Link to="/home" className="linkBarra">
            <img src="/imagens/v11_cleaned3.png" width="150px" alt="Logo Velox" />
        </Link>
     );
}
 
export default IconeLogo;
