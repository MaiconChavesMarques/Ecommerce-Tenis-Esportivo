import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EditarPessoa.css';
import FormEditarConta from './FormEditarConta';

function EditarPessoa() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [dadosPessoa, setDadosPessoa] = useState(null);

  useEffect(() => {
    // Verifica se os dados da pessoa foram passados via state da navegação
    if (location.state && location.state.pessoa) {
      const pessoa = location.state.pessoa;
      const tipo = location.state.tipo || 'cliente';
      
      setDadosPessoa({
        ...pessoa,
        tipo: tipo
      });
    }
  }, [location.state]);

  const handleSalvar = async (dadosFormulario) => {
    if (!dadosPessoa) return;
    
    // Monta o objeto com os dados atualizados
    const pessoaAtualizada = {
      ...dadosPessoa,
      ...dadosFormulario,
      ativo: dadosPessoa.ativo,
      tipo: dadosFormulario.tipo || dadosPessoa.tipo
    };

    // Se a senha está vazia, remove ela do objeto (mantém a atual)
    if (!dadosFormulario.senha || dadosFormulario.senha.trim() === '') {
      delete pessoaAtualizada.senha;
    }

    // Determina o endpoint baseado no tipo
    const endpoints = {
      administrador: '/api/administradores',
      administradores: '/api/administradores',
      cliente: '/api/clientes',
      clientes: '/api/clientes'
    };
    
    const endpoint = endpoints[pessoaAtualizada.tipo] || endpoints.clientes;

    try {
      // Faz a requisição para atualizar
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pessoaAtualizada,
          acao: 'editar'
        })
      });

      if (response.ok) {
        console.log('Pessoa atualizada com sucesso');
        // Volta para a página anterior após salvar
        navigate(-1);
      } else {
        console.error('Erro ao atualizar pessoa');
        alert('Erro ao salvar as alterações. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao salvar as alterações. Verifique sua conexão.');
    }
  };

  // Se não há dados da pessoa (acesso direto à URL)
  if (!dadosPessoa) {
    return (
      <div className="container-editar">
        <div className="container-conteudo-editar">
          <div className="erro-acesso">
            <h2>Acesso Negado</h2>
            <p>Esta página só pode ser acessada através do painel administrativo.</p>
            <button 
              className="btn-erro"
              onClick={() => navigate('/admin')}
            >
              Voltar ao Painel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepara os dados iniciais para o formulário
  const dadosIniciais = {
    tipo: dadosPessoa.tipo || "cliente",
    nome: dadosPessoa.nome || "",
    email: dadosPessoa.email || "",
    senha: "", // Sempre vazio por segurança
    telefone: dadosPessoa.telefone || "",
    rua: dadosPessoa.rua || "",
    cidade: dadosPessoa.cidade || "",
    estado: dadosPessoa.estado || "",
    cep: dadosPessoa.cep || "",
    pais: dadosPessoa.pais || ""
  };

  return (
    <div className="container-editar">
      <FormEditarConta
        dadosIniciais={dadosIniciais}
        onSubmit={handleSalvar}
        mostrarTipo={true}
      />
    </div>
  );
}

export default EditarPessoa;