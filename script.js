function $(id) {
  return document.getElementById(id)
}

// Funções para Requisitos de Negócio
function adicionarTopico() {
  const lista = document.querySelector(".requisitos-list")
  const li = document.createElement("li")
  li.innerHTML = `
        <input type="text" placeholder="Digite o requisito">
        <button class="btn-remover" onclick="removerItem(this)">Remover</button>
    `
  lista.appendChild(li)
}

function removerItem(button) {
  button.parentElement.remove()
}

// Funções para tabelas
function adicionarLinha(tableId) {
  const table = $(tableId)
  const row = table.insertRow(-1)
  const numCols = table.rows[0].cells.length

  for (let i = 0; i < numCols; i++) {
    const cell = row.insertCell(i)
    if (tableId === "plano-acao-table") {
      if (i === 2 || i === 4) {
        // Data de Abertura e Prazo
        cell.innerHTML = '<input type="date">'
      } else if (i === 5) {
        // Status
        cell.innerHTML = `
                    <select>
                        <option value="não iniciado">Não iniciado</option>
                        <option value="em andamento">Em andamento</option>
                        <option value="concluído">Concluído</option>
                    </select>
                `
      } else {
        cell.innerHTML = '<input type="text">'
      }
    } else {
      if (tableId === "indicadores-table" && i === numCols - 1) {
        cell.textContent = "0.00" // Célula de média
      } else {
        cell.innerHTML = '<input type="text">'
      }
    }
  }

  if (tableId === "indicadores-table") {
    adicionarCalculoMedia(row)
  }
}

function adicionarCalculoMedia(row) {
  const inputs = row.querySelectorAll("input")
  const mediaCell = row.cells[row.cells.length - 1]

  inputs.forEach((input, index) => {
    if (index >= 3) {
      // Começando dos meses (Jan a Dez)
      input.addEventListener("input", () => {
        calcularMedia(inputs, mediaCell)
      })
    }
  })
}

function calcularMedia(inputs, mediaCell) {
  let sum = 0
  let count = 0

  inputs.forEach((input, index) => {
    if (index >= 3 && input.value) {
      // Começando dos meses (Jan a Dez)
      const valor = Number.parseFloat(input.value)
      if (!isNaN(valor)) {
        sum += valor
        count++
      }
    }
  })

  const media = count > 0 ? sum / count : 0
  mediaCell.textContent = media.toFixed(2)
}

// Funções de salvamento e carregamento
function salvarDados() {
  const setor = $("setor-title").textContent
  const dados = {
    requisitos: getRequisitos(),
    situacaoAtual: getTableData("situacao-atual-table"),
    situacaoAlvo: getTableData("situacao-alvo-table"),
    planoAcao: getTableData("plano-acao-table"),
    indicadores: getTableData("indicadores-table"),
  }
  localStorage.setItem(setor, JSON.stringify(dados))
  alert("Dados salvos com sucesso!")
}

function getRequisitos() {
  const requisitos = []
  document.querySelectorAll(".requisitos-list input").forEach((input) => {
    requisitos.push(input.value)
  })
  return requisitos
}

function getTableData(tableId) {
  const table = $(tableId)
  const data = []
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i]
    const rowData = []
    for (let j = 0; j < row.cells.length; j++) {
      const cell = row.cells[j]
      const input = cell.querySelector("input")
      const select = cell.querySelector("select")
      if (input) {
        rowData.push(input.value)
      } else if (select) {
        rowData.push(select.value)
      } else {
        rowData.push(cell.textContent)
      }
    }
    data.push(rowData)
  }
  return data
}

function carregarDados(setor) {
  const dados = localStorage.getItem(setor)
  if (dados) {
    const parsedDados = JSON.parse(dados)

    // Carregar requisitos
    document.querySelector(".requisitos-list").innerHTML = ""
    parsedDados.requisitos.forEach((requisito) => {
      const li = document.createElement("li")
      li.innerHTML = `
                <input type="text" value="${requisito}">
                <button class="btn-remover" onclick="removerItem(this)">Remover</button>
            `
      document.querySelector(".requisitos-list").appendChild(li)
    })

    // Carregar tabelas
    carregarTabela("situacao-atual-table", parsedDados.situacaoAtual)
    carregarTabela("situacao-alvo-table", parsedDados.situacaoAlvo)
    carregarTabela("plano-acao-table", parsedDados.planoAcao)
    carregarTabela("indicadores-table", parsedDados.indicadores)
  }
}

function carregarTabela(tableId, dados) {
  const table = $(tableId)
  table.querySelector("tbody").innerHTML = ""
  dados.forEach((rowData) => {
    const row = table.insertRow(-1)
    rowData.forEach((cellData, index) => {
      const cell = row.insertCell(index)
      if (tableId === "plano-acao-table") {
        if (index === 2 || index === 4) {
          // Data de Abertura e Prazo
          cell.innerHTML = `<input type="date" value="${cellData}">`
        } else if (index === 5) {
          // Status
          cell.innerHTML = `
                        <select>
                            <option value="não iniciado" ${cellData === "não iniciado" ? "selected" : ""}>Não iniciado</option>
                            <option value="em andamento" ${cellData === "em andamento" ? "selected" : ""}>Em andamento</option>
                            <option value="concluído" ${cellData === "concluído" ? "selected" : ""}>Concluído</option>
                        </select>
                    `
        } else {
          cell.innerHTML = `<input type="text" value="${cellData}">`
        }
      } else {
        if (tableId === "indicadores-table" && index === rowData.length - 1) {
          cell.textContent = cellData
        } else {
          cell.innerHTML = `<input type="text" value="${cellData}">`
        }
      }
    })
    if (tableId === "indicadores-table") {
      adicionarCalculoMedia(row)
    }
  })
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  $("login-btn").addEventListener("click", () => {
    const setor = $("setor-select").value
    if (setor) {
      $("login-container").style.display = "none"
      $("a3-container").style.display = "block"
      $("setor-title").textContent = setor
      carregarDados(setor)
    } else {
      alert("Por favor, selecione um setor.")
    }
  })

  $("save-btn").addEventListener("click", salvarDados)

  $("logout-btn").addEventListener("click", () => {
    $("a3-container").style.display = "none"
    $("login-container").style.display = "block"
    $("setor-select").value = ""
  })
})

