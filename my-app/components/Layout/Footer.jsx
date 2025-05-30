import React from 'react';
import IconeLogo from './IconeLogo';
import { Link } from 'react-router-dom';

const Footer = () => {
    return ( 
        <div id="Rodape">
            <IconeLogo />
            <Link to="home" className="linkBarra"><p>© 2025 Velox. Todos os direitos reservados</p></Link>
        </div>
     );
}
 
export default Footer;