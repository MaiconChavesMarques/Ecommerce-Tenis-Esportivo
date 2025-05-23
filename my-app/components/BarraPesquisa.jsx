import React, { useState } from 'react';
import "./BarraPesquisa.css";

const BarraPesquisa = ({ placeholder = "Buscar administradores...", onBuscar }) => {
    const [termo, setTermo] = useState('');

    function handleInputChange(e) {
        const valor = e.target.value;
        setTermo(valor);
    }

    function handleBuscar() {
        onBuscar(termo);
    }

    return ( 
        <div className="caixaBusca">
            <div id="barraPesquisa">
                <img src="imagens/lupa6.png" height="15px" alt="buscar"/>
                <input 
                    type="text" 
                    id="formPesquisa" 
                    placeholder={placeholder}
                    value={termo}
                    onChange={handleInputChange}
                />
            </div>
            <button id="buscar" onClick={handleBuscar}>Busca</button>
        </div>
     );
}

export default BarraPesquisa;