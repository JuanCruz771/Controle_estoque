let tabelaData = []; // Armazenará os dados da tabela (em formato JSON)
let cabecalhoTabela = []; // Armazenará o cabeçalho da tabela (primeira linha)
let pop_up = document.getElementById('pop_up');

window.onload = function() {
    // Caminho para o arquivo Excel
    const excelFilePath = 'Localização.xlsx';

    // Usando fetch para carregar o arquivo Excel
    fetch(excelFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Arquivo não encontrado!');
            }
            return response.arrayBuffer(); // Obtemos o arquivo como array buffer
        })
        .then(data => {
            // Lê o arquivo Excel usando SheetJS
            const workbook = XLSX.read(data, { type: 'array' });

            // Selecionar a primeira planilha
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Converte a planilha em um formato JSON (matriz de objetos)
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Armazenar o cabeçalho e os dados da tabela
            cabecalhoTabela = jsonData[0];
            tabelaData = jsonData.slice(1); // Remover o cabeçalho dos dados

            // Gerar a tabela HTML com todos os dados
            gerarTabela(tabelaData);
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo Excel:', error);
            const resultadoDiv = document.getElementById('tabela-container');
            resultadoDiv.innerHTML = '<p>Erro ao carregar o arquivo Excel.</p>';
        });
};

// Função para gerar a tabela HTML com os dados da planilha
function gerarTabela(data) {
    const container = document.getElementById('tabela-container');
    
    // Limpa a tabela anterior antes de gerar a nova
    container.innerHTML = '';

    // Criar a tabela
    const tabela = document.createElement('table');
    tabela.setAttribute('border', '1');
    
    // Criar o cabeçalho da tabela (linha 1)
    const thead = document.createElement('thead');
    const cabecalhoTr = document.createElement('tr');
    cabecalhoTabela.forEach(coluna => {
        const th = document.createElement('th');
        th.textContent = coluna;
        cabecalhoTr.appendChild(th);
    });
    thead.appendChild(cabecalhoTr);
    tabela.appendChild(thead);

    // Criar o corpo da tabela
    const tbody = document.createElement('tbody');
    data.forEach(linha => {
        const tr = document.createElement('tr');
        linha.forEach(celula => {
            const td = document.createElement('td');
            td.textContent = celula;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    // Adicionar a tabela ao container
    tabela.appendChild(tbody);
    container.appendChild(tabela);
}

function abrir_pop_up(){
    pop_up.style.display = "block";
}

function fechar_pop_up(){
    pop_up.style.display = "none";
}

// Função para adicionar uma nova linha à tabela e salvar no Excel
function adicionar_item() {
    // Pega os valores dos inputs (substitua com os IDs reais dos inputs)
    const codigo = document.getElementById('adicionar_codigo').value;
    const descricao = document.getElementById('adicionar_descricao').value;
    const marca = document.getElementById('adicionar_marca').value;
    const quantidade = document.getElementById('adicionar_quantidade').value;
    const local = document.getElementById('adicionar_local').value;

    // Verifica se ambos os campos foram preenchidos
    if (codigo && descricao && marca && quantidade && local) {
        // Adiciona uma nova linha ao array de dados
        tabelaData.push([codigo, descricao, marca, quantidade, local]);

        gerarExcel();
        // Atualiza a tabela na página
        gerarTabela(tabelaData);

        // Limpa os campos de input
        document.getElementById('adicionar_codigo').value = '';
        document.getElementById('adicionar_descricao').value = '';
        document.getElementById('adicionar_marca').value = '';
        document.getElementById('adicionar_quantidade').value = '';
        document.getElementById('adicionar_local').value = '';
    } else {
        alert("Por favor, preencha todos os campos!");
    }
}

// Função para gerar e baixar o novo arquivo Excel com a nova linha
function gerarExcel() {
    // Cria uma nova planilha com os dados atualizados
    const wb = XLSX.utils.book_new();

    // Converte os dados da tabela para o formato adequado
    const ws = XLSX.utils.aoa_to_sheet([cabecalhoTabela, ...tabelaData]);

    // Adiciona a planilha ao livro
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');

    // Gera o arquivo Excel e permite o download
    XLSX.writeFile(wb, 'Localização_atualizado.xlsx');  // Aqui você pode usar o nome desejado
}

const API_URL = "https://api_palusa.railway.internal/Estoque"; // Troque pelo URL real

// Buscar usuários
fetch(API_URL)
  .then(response => response.json())
  .then(data => console.log("Estoque", data))
  .catch(error => console.error("Erro ao buscar usuários:", error));

// Criar um novo usuário
fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ codigo: "João", descricao: "joao@email.com" })
})
.then(response => response.json())
.then(data => console.log("item criado:", data))
.catch(error => console.error("Erro ao criar usuário:", error));
