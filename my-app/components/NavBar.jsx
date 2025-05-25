import React from 'react';
import IconeLogo from './IconeLogo';
import IconeHome from './IconeHome';
import IconeIA from './IconeIA';
import IconeCarrinho from './IconeCarrinho';
import IconePerfil from './IconePerfil';

const NavBar = ({ onLogout, token, paginaAtual }) => {
    // Verifica se é página de login ou registro
    const isPaginaAuth = paginaAtual === 'login' || paginaAtual === 'registro';
    
    // Verifica se é página do administrador
    const isPaginaAdmin = paginaAtual === 'admin' || 
                         paginaAtual === 'administradores' || 
                         paginaAtual === 'clientes' || 
                         paginaAtual === 'estoque' || 
                         paginaAtual === 'editar-pessoa' || 
                         paginaAtual === 'editar-produto';

    return ( 
        <>
            <div id="barraNavegacao">
                <IconeLogo />
                <IconeHome />
                <div className="lateralEsquerda">
                    {/* Mostra IA apenas se NÃO for página de auth E NÃO for página de admin */}
                    {!isPaginaAuth && !isPaginaAdmin && <IconeIA />}
                    
                    {/* Mostra Carrinho apenas se NÃO for página de auth E NÃO for página de admin */}
                    {!isPaginaAuth && !isPaginaAdmin && <IconeCarrinho />}
                    
                    <IconePerfil token={token} />
                </div>
            </div> 
        </>
     );
}
 
export default NavBar;