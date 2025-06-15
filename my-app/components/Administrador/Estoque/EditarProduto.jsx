// Importa hooks do React e função de navegação do React Router
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importa os arquivos de estilo
import '../Pessoas/EditarPessoa.css';
import './EditarProduto.css';

// Componente EditarProduto recebe props de dados e funções de controle
function EditarProduto({ 
  dadosProduto, 
  onLimparEdicao, 
  onAdicionarProduto, 
  onAtualizarProduto 
}) {
  const navigate = useNavigate();
  
  // Array com os tamanhos disponíveis (movido para o escopo global do componente)
  const tamanhos = [38, 39, 40, 41, 42, 43, 44];
  
  // Estado para armazenar dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    imagem: '',
    descricao: '',
    preco: '',
    tamanhos: tamanhos, // Adiciona o array de tamanhos
    quantidade: [0, 0, 0, 0, 0, 0, 0] // Array de quantidades por tamanho
  });

  // Estado para controle de carregamento
  const [salvando, setSalvando] = useState(false);

  // Atualiza o estado formData ao receber dadosProduto por props
  useEffect(() => {
    if (dadosProduto) {
      setFormData({
        nome: dadosProduto.nome || '',
        imagem: dadosProduto.imagem || '',
        descricao: dadosProduto.descricao || '',
        preco: dadosProduto.preco || '',
        tamanhos: dadosProduto.tamanhos || tamanhos, // Usa tamanhos do produto ou padrão
        quantidade: dadosProduto.quantidade || [0, 0, 0, 0, 0, 0, 0]
      });
    }
  }, [dadosProduto]);

  // Atualiza campos do formulário (exceto quantidade)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Atualiza quantidade de estoque por tamanho
  const handleQuantidadeChange = (index, valor) => {
    setFormData(prev => {
      const novaQuantidade = [...prev.quantidade];
      novaQuantidade[index] = parseInt(valor) || 0;
      return {
        ...prev,
        quantidade: novaQuantidade
      };
    });
  };

  // Função para criar novo produto via API
  const criarProduto = async (dadosProduto) => {
    console.log(dadosProduto);
    try {
      const response = await fetch('http://localhost:3000/products/administrador/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosProduto)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar produto');
      }

      const data = await response.json();
      console.log('Produto criado com sucesso:', data);
      return { sucesso: true, data };
      
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return { sucesso: false, erro: error.message };
    }
  };

  // Função para atualizar produto existente via API
  const atualizarProduto = async (dadosProduto) => {
    try {
      // Corrigido: usar id_interno dos dadosProduto originais
      const idInterno = dadosProduto.id_interno;
      
      if (!idInterno) {
        throw new Error('ID interno do produto não encontrado');
      }

      const response = await fetch(`http://localhost:3000/products/administrador/products/${idInterno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosProduto)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar produto');
      }

      const data = await response.json();
      console.log('Produto atualizado com sucesso:', data);
      return { sucesso: true, data };
      
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return { sucesso: false, erro: error.message };
    }
  };

  // Função para salvar produto (adicionar ou atualizar)
  const handleSalvar = async (e) => {
    e.preventDefault();
    
    if (!dadosProduto) return;
    
    const acao = dadosProduto._acao;
    
    // Validações básicas antes de enviar
    if (!formData.nome.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }
    
    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      alert('Preço deve ser maior que zero');
      return;
    }

    setSalvando(true);

    // Monta objeto com dados para envio
    const produtoParaSalvar = {
      nome: formData.nome.trim(),
      imagem: formData.imagem.trim(),
      descricao: formData.descricao.trim(),
      preco: parseFloat(formData.preco),
      tamanhos: formData.tamanhos, // Inclui o array de tamanhos
      quantidade: formData.quantidade
    };

    // Se for edição, mantém todos os IDs originais
    if (acao === 'editar') {
      if (dadosProduto.id) {
        produtoParaSalvar.id = dadosProduto.id;
      }
      if (dadosProduto.id_interno) {
        produtoParaSalvar.id_interno = dadosProduto.id_interno;
      }
    }

    try {
      let resultado;
      
      if (acao === 'adicionar') {
        resultado = await criarProduto(produtoParaSalvar);
        
        if (resultado.sucesso) {
          // Notifica o componente pai sobre o novo produto
          onAdicionarProduto(resultado.data);
          alert('Produto adicionado com sucesso!');
        } else {
          alert(`Erro ao adicionar produto: ${resultado.erro}`);
        }
      } else {
        // Para atualização, passa o produtoParaSalvar mas usa dadosProduto.id_interno na URL
        resultado = await atualizarProduto(produtoParaSalvar);
        
        if (resultado.sucesso) {
          // Notifica o componente pai sobre a atualização
          onAtualizarProduto(resultado.data);
          alert('Produto atualizado com sucesso!');
        } else {
          alert(`Erro ao atualizar produto: ${resultado.erro}`);
        }
      }

      // Se a operação foi bem-sucedida, volta para a lista
      if (resultado.sucesso) {
        onLimparEdicao();
        navigate(-1);
      }

    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  // Função para cancelar edição/adicionar e voltar
  const handleCancelar = () => {
    onLimparEdicao();
    navigate(-1);
  };

  // Se não houver dados do produto, bloqueia acesso e exibe mensagem
  if (!dadosProduto) {
    return (
      <div className="container-editar">
        <div className="container-conteudo-editar">
          <div className="erro-acesso">
            <h2>Acesso Negado</h2>
            <p>Esta página só pode ser acessada através do painel de estoque.</p>
            <button 
              className="btn-erro"
              onClick={() => navigate('/admin/estoque')}
            >
              Voltar ao Estoque
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determina ação (editar ou adicionar)
  const acao = dadosProduto._acao;
  
  // Textos personalizados para cada ação
  const textos = {
    editar: {
      titulo: 'Editar produto',
      subtitulo: 'Atualize as informações do produto',
      icone: '🔄 Atualizar produto Velox!',
      botao: 'Atualizar produto'
    },
    adicionar: {
      titulo: 'Adicionar produto',
      subtitulo: 'Cadastre um novo produto',
      icone: '➕ Novo produto Velox!',
      botao: 'Adicionar produto'
    }
  };

  // Define os textos ativos com base na ação
  const textosAtivos = textos[acao] || textos.editar;

  // Renderização do componente
  return (
    <div className="container-editar">
      <div className="container-conteudo-editar">
        <div className="cabecalho-editar">
          <div className="titulo-pagina">
            <h1>{textosAtivos.titulo}</h1>
            <span className="subtitulo">{textosAtivos.subtitulo}</span>
          </div>
        </div>

        <div className="conteudo-editar">
          <div className="formulario-wrapper">
            <form onSubmit={handleSalvar} className="formulario-produto">
              <div className="cabecalho-formulario">
                <div className="icone-novo-produto">
                  {textosAtivos.icone}
                </div>
              </div>

              {/* Campo Nome */}
              <div className="campo-formulario">
                <label className="label-campo">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="input-campo"
                  disabled={salvando}
                  required
                />
              </div>

              {/* Campo Imagem */}
              <div className="campo-formulario">
                <label className="label-campo">URL da imagem</label>
                <input
                  type="text"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleInputChange}
                  className="input-campo"
                  disabled={salvando}
                />
              </div>

              {/* Campo Descrição */}
              <div className="campo-formulario">
                <label className="label-campo">Descrição do produto</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={4}
                  className="textarea-campo"
                  disabled={salvando}
                />
              </div>

              {/* Campo Preço */}
              <div className="campo-formulario">
                <label className="label-campo">Preço</label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="input-campo"
                  disabled={salvando}
                  required
                />
              </div>

              {/* Estoque por tamanho */}
              <div className="secao-tamanhos">
                <h3 className="titulo-tamanhos">Estoque por Tamanho</h3>
                <div className="grid-tamanhos">
                  {formData.tamanhos.map((tamanho, index) => (
                    <div key={tamanho} className="item-tamanho">
                      <span className="numero-tamanho">{tamanho}</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.quantidade[index] || ''}
                        onChange={(e) => handleQuantidadeChange(index, e.target.value)}
                        placeholder="0"
                        className="input-tamanho"
                        disabled={salvando}
                      />
                    </div>
                  ))}
                </div>
                <div className="info-estoque">
                  {/* Exibe o total de itens somando todas as quantidades */}
                  <p>Total em estoque: {formData.quantidade.reduce((total, qtd) => total + (qtd || 0), 0)} unidades</p>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="acoes-formulario">
                <button 
                  type="submit" 
                  className="btn-atualizar-produto"
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : textosAtivos.botao}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exporta o componente
export default EditarProduto;