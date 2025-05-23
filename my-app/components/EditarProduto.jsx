import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EditarPessoa.css';
import './EditarProduto.css';

function EditarProduto() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [dadosProduto, setDadosProduto] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    imagem: '',
    descricao: '',
    preco: '',
    quantidade: [] // Array de quantidades por tamanho
  });

  useEffect(() => {
    // Verifica se os dados do produto foram passados via state da navegação
    if (location.state && location.state.produto) {
      const produto = location.state.produto;
      
      setDadosProduto(produto);
      setFormData({
        nome: produto.nome || '',
        imagem: produto.imagem || '',
        descricao: produto.descricao || '',
        preco: produto.preco || '',
        quantidade: produto.quantidade || [0, 0, 0, 0, 0, 0, 0] // Array com 7 posições para os tamanhos
      });
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const handleSalvar = async (e) => {
    e.preventDefault();
    
    if (!dadosProduto) return;
    
    // Validações básicas
    if (!formData.nome.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }
    
    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      alert('Preço deve ser maior que zero');
      return;
    }

    // Monta o objeto com os dados atualizados
    const produtoAtualizado = {
      ...dadosProduto,
      nome: formData.nome.trim(),
      imagem: formData.imagem.trim(),
      descricao: formData.descricao.trim(),
      preco: parseFloat(formData.preco),
      quantidade: formData.quantidade // Mantém como array
      // Não precisa calcular quantidade total - os arrays já contêm toda a informação necessária
    };

    try {
      // Faz a requisição para atualizar
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...produtoAtualizado,
          acao: 'editar'
        })
      });

      if (response.ok) {
        console.log('Produto atualizado com sucesso');
        // Volta para a página anterior após salvar
        navigate(-1);
      } else {
        console.error('Erro ao atualizar produto');
        alert('Erro ao salvar as alterações. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao salvar as alterações. Verifique sua conexão.');
    }
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  // Se não há dados do produto (acesso direto à URL)
  if (!dadosProduto) {
    return (
      <div className="container-editar">
        <div className="container-conteudo-editar">
          <div className="erro-acesso">
            <h2>Acesso Negado</h2>
            <p>Esta página só pode ser acessada através do painel de estoque.</p>
            <button 
              className="btn-erro"
              onClick={() => navigate('/estoque')}
            >
              Voltar ao Estoque
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tamanhos = [38, 39, 40, 41, 42, 43, 44]; // Usando números para corresponder ao BD

  return (
    <div className="container-editar">
      <div className="container-conteudo-editar">
        <div className="cabecalho-editar">
          <button className="btn-voltar" onClick={handleVoltar}>
            ← Voltar
          </button>
          <div className="titulo-pagina">
            <h1>Editar produto</h1>
            <span className="subtitulo">Atualize as informações do produto</span>
          </div>
        </div>

        <div className="conteudo-editar">
          <div className="formulario-wrapper">
            <form onSubmit={handleSalvar} className="formulario-produto">
              <div className="cabecalho-formulario">
                <div className="icone-novo-produto">
                  🔄 Atualizar produto Velox!
                </div>
              </div>

              <div className="campo-formulario">
                <label className="label-campo">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="input-campo"
                />
              </div>

              <div className="campo-formulario">
                <label className="label-campo">URL da imagem</label>
                <input
                  type="url"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleInputChange}
                  className="input-campo"
                />
              </div>

              <div className="campo-formulario">
                <label className="label-campo">Descrição do produto</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={4}
                  className="textarea-campo"
                />
              </div>

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
                />
              </div>

              <div className="secao-tamanhos">
                <h3 className="titulo-tamanhos">Estoque por Tamanho</h3>
                <div className="grid-tamanhos">
                  {tamanhos.map((tamanho, index) => (
                    <div key={tamanho} className="item-tamanho">
                      <span className="numero-tamanho">{tamanho}</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.quantidade[index] || ''}
                        onChange={(e) => handleQuantidadeChange(index, e.target.value)}
                        placeholder="0"
                        className="input-tamanho"
                      />
                    </div>
                  ))}
                </div>
                <div className="info-estoque">
                  <p>Total em estoque: {formData.quantidade.reduce((total, qtd) => total + (qtd || 0), 0)} unidades</p>
                </div>
              </div>

              <button type="submit" className="btn-atualizar-produto">
                Atualizar produto
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarProduto;