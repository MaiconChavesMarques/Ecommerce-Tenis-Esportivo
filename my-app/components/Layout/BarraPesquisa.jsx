import React, { useState } from 'react';
import "./BarraPesquisa.css";

const BarraPesquisa = ({ placeholder, onBuscar }) => {
    const [termo, setTermo] = useState('');

    function handleInputChange(e) {
        const valor = e.target.value;
        setTermo(valor);
    }

    function handleBuscar() {
        onBuscar(termo);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleBuscar();
        }
    }

    return ( 
        <div className="caixaBusca">
            <div id="barraPesquisa">
                {/* Mudança: caminho absoluto começando com / */}
                <img src="/imagens/lupa6.png" height="15px" alt="buscar"/>
                <input 
                    type="text" 
                    id="formPesquisa" 
                    placeholder={placeholder}
                    value={termo}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <button id="buscar" onClick={handleBuscar}>Busca</button>
        </div>
     );
}

export default BarraPesquisa;