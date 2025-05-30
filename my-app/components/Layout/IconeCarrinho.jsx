import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para navegação interna

const IconeCarrinho = () => {
    return ( 
        // Link que redireciona para a página do carrinho
        <Link to="/carrinho" className="linkBarra">
          {/* Imagem do ícone do carrinho de compras */}
          <img src="/imagens/carrinho-de-compras11.png" width="30px" alt="Carrinho de Compras" />
        </Link>
      );
}
 
export default IconeCarrinho;
