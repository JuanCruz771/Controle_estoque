const apiUrl = 'https://api-estoque-palusa.onrender.com/API/Estoque';
const pop = document.getElementById('pop_up');

let validacao;

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

window.adicionar_item = async function () {
  document.getElementById('formCadastro').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o reload
    const btn_adicionar = document.getElementById(btn_adicionar);
    btn_adicionar.style.visibility = 'hidden';
    const codigo = document.getElementById("codigo").value;
    const descricao = document.getElementById("descricao").value;
    const marca = document.getElementById("marca").value;
    const quantidade = document.getElementById("quantidade").value;
    const local = document.getElementById("local").value;

    let quant_int = parseInt(quantidade);

    if (isNaN(quant_int)) {
      alert('Essa quantidade não é válida');
      return; // Interrompe o envio se quantidade inválida
      btn_adicionar.style.visibility = 'visible';
    }

    const novoProduto = {
      codigo,
      descricao,
      marca,
      quantidade, // usa o valor convertido
      local
    };

    try {
      const resposta = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProduto)
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao salvar produto: ${resposta.status}`);
      }

      alert('Produto cadastrado com sucesso!');
      document.getElementById('formCadastro').reset();
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
        linha.classList = 'linha';

        const item_id = document.createElement('ul');
        item_id.textContent = `${produto.id}`;
        item_id.id = 'item_id'+ item_id.textContent;
        item_id.classList = 'item_id';
        linha.id = 'linha' + item_id.textContent;

        const item_codigo = document.createElement('ul');
        item_codigo.textContent = `${produto.codigo}`;
        item_codigo.id = 'item_codigo' + item_id.textContent;
        item_codigo.classList = 'item_codigo';

        const item_descricao = document.createElement('ul');
        item_descricao.textContent = `${produto.descricao}`;
        item_descricao.id = 'item_descricao' + item_id.textContent;
        item_descricao.classList = 'item_descricao';

        const item_marca = document.createElement('ul');
        item_marca.textContent = `${produto.marca}`;
        item_marca.id = 'item_marca' + item_id.textContent;
        item_marca.classList = 'item_marca';

        const item_quantidade = document.createElement('ul');
        item_quantidade.textContent = `${produto.quantidade}`;
        item_quantidade.id = 'item_quantidade' + item_id.textContent;
        item_quantidade.classList = 'item_quantidade';

        const item_local = document.createElement('ul');
        item_local.textContent = `${produto.local}`;
        item_local.id = 'item_local' + item_id.textContent;
        item_local.classList = 'item_local';

        const btn_alterar = document.createElement('button')
        btn_alterar.id = 'btn_alterar' + item_id.textContent;
        btn_alterar.classList = 'btn_alterar';
        btn_alterar.textContent = 'alterar';
        btn_alterar.addEventListener('click', function() {
          alterarlocal(btn_alterar.id); 
        });
        
        
        linha.appendChild(item_id);
        linha.appendChild(item_codigo);  
        linha.appendChild(item_descricao);
        linha.appendChild(item_marca);
        linha.appendChild(item_quantidade);
        linha.appendChild(item_local);
        linha.appendChild(btn_alterar);

        lista.appendChild(linha);
      });

  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
  }
};

function alterarlocal(valor){
  let qual_local = 'item_local';
  let qual_botao = 'btn_alterar';
  let repetir = true;
  let i = 0;
  while(repetir == true){
    i++
    qual_local = 'item_local' + i;
    qual_botao = 'btn_alterar' + i;
      if(valor == qual_botao){
        
        repetir = false;
        
        
        const local_antigo = document.getElementById(qual_local);
        
        
        const botao_alterar = document.getElementById(qual_botao);
        
        const btn_alterar = botao_alterar.cloneNode(true);
        btn_alterar.id = 'btn_alterar' + i;
        btn_alterar.classList = 'btn_alterar';
        btn_alterar.addEventListener('click', function() {
          alterarlocal(btn_alterar.id);
        })
          

        const input_local = document.createElement('input');
        input_local.type = 'text';
        input_local.id = 'input_local';
        input_local.classList - 'input_local';
        input_local.placeholder = "Digite aqui";
        local_antigo.replaceWith(input_local);
        
        const item_id = document.getElementById('item_id' + i);
        item_id.value = item_id.textContent;

        const btn_ok = document.createElement('button');
        btn_ok.textContent = 'ok';
        btn_ok.id = 'btn_ok' + i;
        btn_ok.classList = 'btn_ok';
        botao_alterar.replaceWith(btn_ok); 
        btn_ok.addEventListener('click', function() {
          
          local_antigo.textContent = input_local.value;
          input_local.replaceWith(local_antigo);
          btn_ok.replaceWith(btn_alterar);
          salvar_banco(parseInt(item_id.value) ,input_local.value);
          
        });
        

        i=0;
      }
    }
    
  }

  window.salvar_banco = async function (id, novo_local) {
    
    fetch(apiUrl + '/' + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ local: novo_local }) // <- chave "local"
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao atualizar o local");
      }
      return response.json();
    })
    .then(data => {
      console.log("Item atualizado:", data);
    })
    .catch(error => {
      console.error("Erro:", error);
    });
  };
  
  

  


// Chama a função ao carregar a página
window.addEventListener("load", () => {
  carregarProdutos();
  filtrar(); // <<-- essa linha estava faltando
});
