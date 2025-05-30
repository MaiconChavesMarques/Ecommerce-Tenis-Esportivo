import React, { useState } from 'react';
import "./BarraPesquisa.css";

const BarraPesquisa = ({ placeholder, onBuscar }) => {
    const [termo, setTermo] = useState(''); // Estado para armazenar o termo digitado pelo usuário

    // Função chamada quando o conteúdo do input muda
    function handleInputChange(e) {
        const valor = e.target.value; // Pega o valor digitado
        setTermo(valor); // Atualiza o estado com o valor atual do input
    }

    // Função para disparar a busca com o termo atual
    function handleBuscar() {
        onBuscar(termo); // Chama a função passada via props com o termo de busca
    }

    // Função que captura a tecla pressionada para permitir busca ao pressionar Enter
    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleBuscar(); // Se Enter for pressionado, dispara a busca
        }
    }

    return ( 
        <div className="caixaBusca">
            <div id="barraPesquisa">
                {/* Ícone da lupa com caminho absoluto */}
                <img src="/imagens/lupa6.png" height="15px" alt="buscar"/>
                <input 
                    type="text" 
                    id="formPesquisa" 
                    placeholder={placeholder} // Placeholder recebido via props
                    value={termo} // Valor controlado pelo estado termo
                    onChange={handleInputChange} // Atualiza termo ao digitar
                    onKeyDown={handleKeyDown} // Detecta tecla para buscar ao pressionar Enter
                />
            </div>
            {/* Botão para disparar busca ao clicar */}
            <button id="buscar" onClick={handleBuscar}>Busca</button>
        </div>
     );
}

export default BarraPesquisa;
