import React from 'react';
import "./BarraPesquisa.css";

const BarraPesquisa = () => {
    return ( 
        <div className="procura">
            <h2>Procure seu modelo</h2>
            <div className="caixaBusca">
                <div id="barraPesquisa">
                    <img src="imagens/lupa6.png" height="15px"/>
                    <input type="text" id="formPesquisa"/>
                </div>
                <button id="buscar">Buscar</button>
            </div>
        </div>
     );
}
 
export default BarraPesquisa;