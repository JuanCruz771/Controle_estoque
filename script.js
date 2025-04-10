window.carregarProdutos = async function () {
  const apiUrl = 'https://api-estoque-palusa.onrender.com/API/Estoque';

  try {
    const resposta = await fetch(apiUrl);
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();
    const lista = document.getElementById('tabela-container');
    lista.innerHTML = '';

    dados.forEach(produto => {

      const linha = document.createElement('a');

      const item_id = document.createElement('ul');
      const item_codigo = document.createElement('ul');
      const item_descricao = document.createElement('ul');
      const item_marca = document.createElement('ul');
      const item_quantidade = document.createElement('ul');
      const item_local = document.createElement('ul');
      item_id.textContent = `${produto.id}`;
      item_codigo.textContent = `${produto.codigo}`;
      item_descricao.textContent = `${produto.descricao} `;
      item_marca.textContent = `${produto.marca} `;
      item_quantidade.textContent = `${produto.quantidade}`;
      item_local.textContent = `${produto.local}`;

      linha.appendChild(item_id);
      linha.appendChild(item_codigo);
      linha.appendChild(item_descricao);
      linha.appendChild(item_quantidade);
      linha.appendChild(item_local);

      lista.appendChild(linha);

    });

  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
  }
};

// Chamar a função ao carregar a página
window.addEventListener("load", carregarProdutos);
