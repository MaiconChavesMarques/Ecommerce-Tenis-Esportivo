import React from 'react';
import IconeLogo from './IconeLogo';
import IconeHome from './IconeHome';
import IconeIA from './IconeIA';
import IconeCarrinho from './IconeCarrinho';
import IconePerfil from './IconePerfil';
import './NavBar.css';

const NavBar = ({ onLogout, token, paginaAtual }) => {
    // Verifica se a página atual é uma página de autenticação (login ou registro)
    const isPaginaAuth = paginaAtual === 'login' || paginaAtual === 'registro';
    
    // Verifica se a página atual é uma página administrativa (admin e suas variações)
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
                    {/* Ícone do logo da aplicação */}
                    <IconeLogo />
                </div>
                
                <div className="navbar-lateral-esquerda-container">
                    {/* Espaço reservado para ícones à esquerda, que serão centralizados em telas pequenas */}
                </div>
                
                <div className="navbar-home-container-fixo-centro">
                    {/* Ícone que leva para a página Home */}
                    <IconeHome />
                </div>
                
                <div className="navbar-lateral-direita-container">
                    {/* Ícone da IA exibido somente se NÃO estiver em páginas de autenticação nem administração */}
                    {!isPaginaAuth && !isPaginaAdmin && <IconeIA />}
                    
                    {/* Ícone do carrinho exibido somente se NÃO estiver em páginas de autenticação nem administração */}
                    {!isPaginaAuth && !isPaginaAdmin && <IconeCarrinho />}
                    
                    {/* Ícone do perfil, que pode variar entre login e perfil dependendo do token */}
                    <IconePerfil token={token} />
                </div>
            </div> 
        </>
     );
}
 
export default NavBar;
