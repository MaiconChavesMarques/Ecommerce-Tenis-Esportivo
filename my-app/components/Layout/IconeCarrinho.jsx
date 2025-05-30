import React from 'react';
import { Link } from 'react-router-dom';

const IconeCarrinho = () => {
    return ( 
        <Link to="/carrinho" className="linkBarra">
          <img src="/imagens/carrinho-de-compras11.png" width="30px" />
        </Link>
      );
}
 
export default IconeCarrinho;