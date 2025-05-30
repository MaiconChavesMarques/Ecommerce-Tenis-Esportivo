import React from 'react';
import { Link } from 'react-router-dom';

const IconeLogo = () => {
    return ( 
        <Link to="/home" className="linkBarra">
            <img src="/imagens/v11_cleaned3.png" width="150px" />
        </Link>
     );
}
 
export default IconeLogo;