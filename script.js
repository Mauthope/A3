document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
})

function $(id) {
  return document.getElementById(id)
}

function initializeEventListeners() {
  // Login e Logout
  $("login-btn").addEventListener("click", handleLogin)
  $("logout-btn").addEventListener("click", handleLogout)
  $("save-btn").addEventListener("click", handleSave)

  // Botões de adicionar
  $("add-requisito").addEventListener("click", () => adicionarRequisito())
  $("add-situacao-atual").addEventListener("click", () => adicionarLinha("situacao-atual-table"))
  $("add-situacao-alvo").addEventListener("click", () => adicionarLinha("situacao-alvo-table"))
  $("add-plano-acao").addEventListener("click", () => adicionarLinha("plano-acao-table"))
  $("add-indicadores").addEventListener("click", () => adicionarLinha("indicadores-table"))
}

// Funções de Login/Logout
function handleLogin() {
  const setor = $("setor-select").value
  if (!setor) {
    alert("Por favor, selecione um setor.")
    return
  }

  $("login-container").style.display = "none"
  $("a3-container").style.display = "block"
  $("setor-title").textContent = setor
  carregarDados(setor)
}

function handleLogout() {
  $("a3-container").style.display = "none"
  $("login-container").style.display = "block"
  $("setor-select").value = ""
  limparFormulario()
}

function handleSave() {
  const setor = $("setor-title").textContent
  salvarDados(setor)
}

// Funções para Requisitos
function adicionarRequisito() {
  const lista = $("requisitos-list")
  const li = document.createElement("li")
  li.innerHTML = `
        <input type="text" placeholder="Digite o requisito">
        <button class="btn-remover" onclick="removerRequisito(this)">Remover</button>
    `
  lista.appendChild(li)
}

function removerRequisito(button) {
  button.parentElement.remove()
}

// Funções para Tabelas
function adicionarLinha(tableId) {
  const table = $(tableId)
  const row = table.insertRow(-1)
  const numCols = table.rows[0].cells.length

  for (let i = 0; i < numCols; i++) {
    const cell = row.insertCell(i)

    if (tableId === "plano-acao-table") {
      cell.appendChild(criarCelulaPlanoAcao(i))
    } else if (tableId === "indicadores-table") {
      if (i >= 3 && i < numCols - 1) {
        // Células de Jan a Dez
        const input = criarInput()
        input.addEventListener("input", function () {
          const meta = row.cells[1].querySelector("input").value
          const objFuturo = row.cells[2].querySelector("input").value
          aplicarCorCelula(this.parentNode, this.value, meta, objFuturo)
          calcularMedia(row)
        })
        cell.appendChild(input)
      } else if (i === numCols - 1) {
        // Célula de Média
        const span = document.createElement("span")
        span.textContent = "0.00"
        cell.appendChild(span)
      } else {
        const input = criarInput()
        if (i === 1 || i === 2) {
          // Meta e OBJ Futuro
          input.addEventListener("input", () => {
            atualizarCoresLinha(row)
          })
        }
        cell.appendChild(input)
      }
    } else {
      cell.appendChild(criarInput())
    }
  }

  if (tableId === "indicadores-table") {
    configurarCalculoMedia(row)
  }
}

function criarCelulaPlanoAcao(colIndex) {
  if (colIndex === 2 || colIndex === 4) {
    // Data de Abertura e Prazo
    const input = document.createElement("input")
    input.type = "date"
    return input
  } else if (colIndex === 5) {
    // Status
    const select = document.createElement("select")
    select.innerHTML = `
            <option value="Não iniciado">Não iniciado</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluído">Concluído</option>
        `
    return select
  } else {
    return criarInput()
  }
}

function criarCelulaIndicadores(colIndex, numCols) {
  if (colIndex === numCols - 1) {
    // Última coluna (Média)
    const span = document.createElement("span")
    span.textContent = "0.00"
    return span
  } else {
    return criarInput()
  }
}

function criarInput() {
  const input = document.createElement("input")
  input.type = "number"
  input.step = "0.01" // Permite incrementos de 0.01
  input.min = "0" // Opcional: define um valor mínimo
  return input
}

function configurarCalculoMedia(row) {
  const inputs = Array.from(row.cells)
    .slice(3, -1)
    .map((cell) => cell.querySelector("input"))
  const mediaCell = row.cells[row.cells.length - 1].querySelector("span")

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      calcularMedia(row)
    })
  })
}

function calcularMedia(row) {
  const inputs = Array.from(row.cells)
    .slice(3, -1)
    .map((cell) => cell.querySelector("input"))
  const valores = inputs.map((inp) => Number.parseFloat(inp.value)).filter((val) => !isNaN(val))

  const media = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0

  const mediaCell = row.cells[row.cells.length - 1].querySelector("span")
  mediaCell.textContent = media.toFixed(2)

  const meta = Number.parseFloat(row.cells[1].querySelector("input").value)
  const objFuturo = Number.parseFloat(row.cells[2].querySelector("input").value)
  aplicarCorCelula(mediaCell.parentNode, media, meta, objFuturo)
}

function aplicarCorCelula(cell, valor, meta, objFuturo) {
  valor = Number.parseFloat(valor)
  meta = Number.parseFloat(meta)
  objFuturo = Number.parseFloat(objFuturo)

  if (isNaN(valor) || isNaN(meta) || isNaN(objFuturo)) {
    return // Não aplica cor se algum valor não for número
  }

  cell.classList.remove("cell-green", "cell-orange", "cell-red")

  // Usamos toFixed(2) para comparar com precisão de duas casas decimais
  if (Number.parseFloat(objFuturo.toFixed(2)) > Number.parseFloat(meta.toFixed(2))) {
    if (Number.parseFloat(valor.toFixed(2)) >= Number.parseFloat(objFuturo.toFixed(2))) {
      cell.classList.add("cell-green")
    } else if (Number.parseFloat(valor.toFixed(2)) >= Number.parseFloat(meta.toFixed(2))) {
      cell.classList.add("cell-orange")
    } else {
      cell.classList.add("cell-red")
    }
  } else {
    if (Number.parseFloat(valor.toFixed(2)) <= Number.parseFloat(objFuturo.toFixed(2))) {
      cell.classList.add("cell-green")
    } else if (Number.parseFloat(valor.toFixed(2)) <= Number.parseFloat(meta.toFixed(2))) {
      cell.classList.add("cell-orange")
    } else {
      cell.classList.add("cell-red")
    }
  }
}

function atualizarCoresLinha(row) {
  const meta = row.cells[1].querySelector("input").value
  const objFuturo = row.cells[2].querySelector("input").value
  for (let i = 3; i < row.cells.length - 1; i++) {
    const input = row.cells[i].querySelector("input")
    aplicarCorCelula(input.parentNode, input.value, meta, objFuturo)
  }
}

// Funções de Dados
function salvarDados(setor) {
  const dados = {
    requisitos: getRequisitosData(),
    situacaoAtual: getTableData("situacao-atual-table"),
    situacaoAlvo: getTableData("situacao-alvo-table"),
    planoAcao: getTableData("plano-acao-table"),
    indicadores: getTableData("indicadores-table"),
  }

  localStorage.setItem(setor, JSON.stringify(dados))
  alert("Dados salvos com sucesso!")
}

function getRequisitosData() {
  return Array.from($("requisitos-list").querySelectorAll("input")).map((input) => input.value)
}

function getTableData(tableId) {
  const tbody = $(tableId).querySelector("tbody")
  return Array.from(tbody.rows).map((row) => {
    return Array.from(row.cells).map((cell) => {
      const input = cell.querySelector("input")
      const select = cell.querySelector("select")
      const span = cell.querySelector("span")

      if (input) return input.value
      if (select) return select.value
      if (span) return span.textContent
      return cell.textContent
    })
  })
}

function carregarDados(setor) {
  const dadosSalvos = localStorage.getItem(setor)
  if (!dadosSalvos) return

  const dados = JSON.parse(dadosSalvos)

  // Carregar requisitos
  $("requisitos-list").innerHTML = ""
  dados.requisitos.forEach((requisito) => {
    const li = document.createElement("li")
    li.innerHTML = `
            <input type="text" value="${requisito}">
            <button class="btn-remover" onclick="removerRequisito(this)">Remover</button>
        `
    $("requisitos-list").appendChild(li)
  })

  // Carregar tabelas
  carregarTabela("situacao-atual-table", dados.situacaoAtual)
  carregarTabela("situacao-alvo-table", dados.situacaoAlvo)
  carregarTabela("plano-acao-table", dados.planoAcao)
  carregarTabela("indicadores-table", dados.indicadores)
}

function carregarTabela(tableId, dados) {
  const tbody = $(tableId).querySelector("tbody")
  tbody.innerHTML = ""

  dados.forEach((rowData) => {
    const row = tbody.insertRow()
    rowData.forEach((cellData, index) => {
      const cell = row.insertCell()
      if (tableId === "plano-acao-table") {
        cell.appendChild(criarCelulaPlanoAcaoComDado(index, cellData))
      } else if (tableId === "indicadores-table") {
        if (index >= 3 && index < rowData.length - 1) {
          // Células de Jan a Dez
          const input = criarInput()
          input.value = cellData
          input.addEventListener("input", function () {
            const meta = row.cells[1].querySelector("input").value
            const objFuturo = row.cells[2].querySelector("input").value
            aplicarCorCelula(this.parentNode, this.value, meta, objFuturo)
            calcularMedia(row)
          })
          cell.appendChild(input)
        } else if (index === rowData.length - 1) {
          // Célula de Média
          const span = document.createElement("span")
          span.textContent = cellData
          cell.appendChild(span)
        } else {
          const input = criarInput()
          input.value = cellData
          if (index === 1 || index === 2) {
            // Meta e OBJ Futuro
            input.addEventListener("input", () => {
              atualizarCoresLinha(row)
            })
          }
          cell.appendChild(input)
        }
      } else {
        const input = criarInput()
        input.value = cellData
        cell.appendChild(input)
      }
    })

    if (tableId === "indicadores-table") {
      configurarCalculoMedia(row)
      atualizarCoresLinha(row)
    }
  })
}

function criarCelulaPlanoAcaoComDado(colIndex, valor) {
  if (colIndex === 2 || colIndex === 4) {
    const input = document.createElement("input")
    input.type = "date"
    input.value = valor
    return input
  } else if (colIndex === 5) {
    const select = document.createElement("select")
    select.innerHTML = `
            <option value="Não iniciado">Não iniciado</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluído">Concluído</option>
        `
    select.value = valor
    return select
  } else {
    const input = criarInput()
    input.value = valor
    return input
  }
}

function limparFormulario() {
  $("requisitos-list").innerHTML = ""
  ;["situacao-atual-table", "situacao-alvo-table", "plano-acao-table", "indicadores-table"].forEach((tableId) => {
    $(tableId).querySelector("tbody").innerHTML = ""
  })
}

