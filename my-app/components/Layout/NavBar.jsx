import React from 'react';
import IconeLogo from './IconeLogo';
import IconeHome from './IconeHome';
import IconeIA from './IconeIA';
import IconeCarrinho from './IconeCarrinho';
import IconePerfil from './IconePerfil';
import './NavBar.css';

const NavBar = ({ onLogout, token, paginaAtual }) => {
    // Verifica se é página de login ou registro
    const isPaginaAuth = paginaAtual === 'login' || paginaAtual === 'registro';
    
    // Verifica se é página do administrador
    const isPaginaAdmin = paginaAtual === 'admin' || 
                         paginaAtual === 'administradores' ||
                         paginaAtual === 'pessoas' ||
                         paginaAtual === 'clientes' ||
                         paginaAtual === 'perfil-adm' ||
                         paginaAtual === 'estoque' || 
                         paginaAtual === 'editar-pessoa' || 
                         paginaAtual === 'editar-produto';

    return ( 
        <>
            <div id="barraNavegacao">
                <div className="navbar-logo-container-unico">
                    <IconeLogo />
                </div>
                
                <div className="navbar-lateral-esquerda-container">
                    {/* Ícones que ficavam à esquerda - agora serão centralizados em telas pequenas */}
                </div>
                
                <div className="navbar-home-container-fixo-centro">
                    <IconeHome />
                </div>
                
                <div className="navbar-lateral-direita-container">
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