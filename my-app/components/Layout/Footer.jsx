import React from 'react';
import IconeLogo from './IconeLogo'; // Importa o componente do ícone/logo
import { Link } from 'react-router-dom'; // Importa Link para navegação interna

const Footer = () => {
    return ( 
        <div id="Rodape">
            {/* Exibe o ícone/logo no rodapé */}
            <IconeLogo />

            {/* Link que redireciona para a página "home" */}
            <Link to="home" className="linkBarra">
                {/* Texto de direitos autorais */}
                <p>© 2025 Velox. Todos os direitos reservados</p>
            </Link>
        </div>
     );
}
 
export default Footer;
