import { useNavigate } from 'react-router-dom'; // Importa hook para navegação programática
import './Administrador.css'; // Importa estilos específicos do componente

function Administrador() {
  const navigate = useNavigate(); // Inicializa o hook de navegação

  // Função para navegar para a página de administradores
  function handleGerenciarAdmins() {
    navigate('/admin/pessoas/administradores');
  }

  // Função para navegar para a página de clientes
  function handleGerenciarClientes() {
    navigate('/admin/pessoas/clientes');
  }

  // Função para navegar para a página de produtos
  function handleGerenciarProdutos() {
    navigate('/admin/estoque');
  }

  // Função para gerenciar pedidos - ainda não implementada
  function handleGerenciarPedidos() {
    // Implementar navegação para pedidos
    console.log('Gerenciar pedidos');
  }

  return (
    <div className="container-admin">
      <h1>Painel Administrativo</h1>

      {/* Container dos cards administrativos */}
      <div className="cards-container">

        {/* Card para gerenciar administradores */}
        <div className="card-admin">
          <div className="card-icon">👥</div> {/* Ícone do card */}
          <h2>Administradores</h2>
          <p>Gerencie administradores do sistema</p>
          <button onClick={handleGerenciarAdmins}>Gerenciar</button>
        </div>

        {/* Card para gerenciar clientes */}
        <div className="card-admin">
          <div className="card-icon">🧑‍💼</div> {/* Ícone do card */}
          <h2>Clientes</h2>
          <p>Gerencie clientes cadastrados</p>
          <button onClick={handleGerenciarClientes}>Gerenciar</button>
        </div>

        {/* Card para gerenciar produtos */}
        <div className="card-admin">
          <div className="card-icon">📦</div> {/* Ícone do card */}
          <h2>Produtos</h2>
          <p>Gerencie produtos do catálogo</p>
          <button onClick={handleGerenciarProdutos}>Gerenciar</button>
        </div>

      </div>
    </div>
  );
}

export default Administrador;
