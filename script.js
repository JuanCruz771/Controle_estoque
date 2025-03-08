let tabelaData = []; // Armazenará os dados da tabela (em formato JSON)
let cabecalhoTabela = []; // Armazenará o cabeçalho da tabela (primeira linha)

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

// Função para filtrar a tabela com base no valor do input
function filtrarTabela() {
    const filtro = document.getElementById('filtro').value.toLowerCase();

    // Filtra os dados da tabela com base no valor digitado
    const dadosFiltrados = tabelaData.filter(linha => {
        // Verifica se algum valor na linha contém o filtro
        return linha.some(celula => celula.toString().toLowerCase().includes(filtro));
    });

    // Exibe a tabela filtrada
    gerarTabela(dadosFiltrados);
}
