import { useNavigate } from 'react-router-dom';
import './Administrador.css';

function Administrador() {
  const navigate = useNavigate();

  function handleGerenciarAdmins() {
    navigate('/administradores');
  }

  function handleGerenciarClientes() {
    navigate('/clientes');
  }

  function handleGerenciarProdutos() {
    navigate('/estoque');
  }

  function handleGerenciarPedidos() {
    // Implementar navegação para pedidos
    console.log('Gerenciar pedidos');
  }

  return (
    <div className="container-admin">
      <h1>Painel Administrativo</h1>
      <div className="cards-container">
        <div className="card-admin">
          <div className="card-icon">👥</div>
          <h2>Administradores</h2>
          <p>Gerencie administradores do sistema</p>
          <button onClick={handleGerenciarAdmins}>Gerenciar</button>
        </div>

        <div className="card-admin">
          <div className="card-icon">🧑‍💼</div>
          <h2>Clientes</h2>
          <p>Gerencie clientes cadastrados</p>
          <button onClick={handleGerenciarClientes}>Gerenciar</button>
        </div>

        <div className="card-admin">
          <div className="card-icon">📦</div>
          <h2>Produtos</h2>
          <p>Gerencie produtos do catálogo</p>
          <button onClick={handleGerenciarProdutos}>Gerenciar</button>
        </div>
      </div>
    </div>
  );
}

export default Administrador;