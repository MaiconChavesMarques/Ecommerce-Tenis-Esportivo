import React from 'react';
import IconeLogo from './IconeLogo';
import IconeHome from './IconeHome';
import IconeIA from './IconeIA';
import IconeCarrinho from './IconeCarrinho';
import IconePerfil from './IconePerfil';

const NavBar = ({ onLogout, token }) => {
    return ( 
        <>
            <div id="barraNavegacao">
                <IconeLogo />
                <IconeHome />
                <div className="lateralEsquerda">
                    <IconeIA />
                    <IconeCarrinho />
                    <IconePerfil token={token} />
                </div>
            </div> 
        </>
     );
}
 
export default NavBar;