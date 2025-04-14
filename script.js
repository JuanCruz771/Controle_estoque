const apiUrl = 'https://api-estoque-palusa.onrender.com/API/Estoque';
const pop = document.getElementById('pop_up');


function abrir_pop_up(){
  
  pop.style.display = 'block';
}

function fechar_pop_up(){
  pop.style.display = 'none';
}

function filtrar() {
  document.getElementById('input-pesquisa').addEventListener('input', (event) => {
    const termo = event.target.value;
    carregarProdutos(termo);
  });
}

window.adicionar_item = async function (){

  document.getElementById('formCadastro').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o reload
  
    const codigo = document.getElementById("codigo").value;
const descricao = document.getElementById("descricao").value;
const marca = document.getElementById("marca").value;
const quantidade = document.getElementById("quantidade").value;
const local = document.getElementById("local").value;

const novoProduto = {
  codigo,
  descricao,
  marca,
  quantidade,
  local
};
   
  
    try {
      const resposta = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProduto )
      });
  
      if (!resposta.ok) {
        throw new Error(`Erro ao salvar produto: ${resposta.status}`);
      }
  
      alert('Produto cadastrado com sucesso!');
      document.getElementById('formProduto').reset();
      document.getElementById('pop_up').style.display = 'none';
  
      // Atualiza a lista
      carregarProdutos();
  
    } catch (erro) {
      console.error('Erro ao enviar produto:', erro);
      alert('Erro ao salvar produto. Veja o console.');
    }
  });
  

} 

window.carregarProdutos = async function (filtro = '') {
  try {
    const resposta = await fetch(apiUrl);
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();
    const lista = document.getElementById('tabela-container');
    lista.innerHTML = '';

    const filtroLower = filtro.toLowerCase();

    dados
      .filter(produto =>
        produto.codigo.toLowerCase().includes(filtroLower) ||
        produto.descricao.toLowerCase().includes(filtroLower) ||
        produto.marca.toLowerCase().includes(filtroLower) ||
        produto.local.toLowerCase().includes(filtroLower)
      )
      .forEach(produto => {
        const linha = document.createElement('a');

        const item_id = document.createElement('ul');
        const item_codigo = document.createElement('ul');
        const item_descricao = document.createElement('ul');
        const item_marca = document.createElement('ul');
        const item_quantidade = document.createElement('ul');
        const item_local = document.createElement('ul');

        item_id.textContent = `${produto.id}`;
        item_codigo.textContent = `${produto.codigo}`;
        item_descricao.textContent = `${produto.descricao}`;
        item_marca.textContent = `${produto.marca}`;
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

// Chama a função ao carregar a página
window.addEventListener("load", () => {
  carregarProdutos();
  filtrar(); // <<-- essa linha estava faltando
});
