// Funções de utilidade
function $(id) {
  return document.getElementById(id)
}

function createCell(type, text) {
  const cell = document.createElement(type)
  cell.textContent = text
  return cell
}

function createInput(type = "text") {
  const input = document.createElement("input")
  input.type = type
  return input
}

// Gerenciamento de dados
function saveData(setor, data) {
  localStorage.setItem(setor, JSON.stringify(data))
}

function loadData(setor) {
  const data = localStorage.getItem(setor)
  return data ? JSON.parse(data) : null
}

// Manipulação de tabelas
function addTableRow(tableId) {
  const table = $(tableId)
  const row = table.insertRow(-1)
  const columns = table.rows[0].cells.length

  for (let i = 0; i < columns; i++) {
    const cell = row.insertCell(i)
    cell.appendChild(createInput())
  }

  if (tableId === "indicadores-table") {
    updateIndicadoresMedia(row)
  }
}

function updateIndicadoresMedia(row) {
  const inputs = row.querySelectorAll("input")
  const mediaCell = row.cells[row.cells.length - 1]

  for (let i = 3; i < inputs.length; i++) {
    inputs[i].addEventListener("input", () => {
      let sum = 0
      let count = 0
      for (let j = 3; j < inputs.length; j++) {
        const value = Number.parseFloat(inputs[j].value)
        if (!isNaN(value)) {
          sum += value
          count++
        }
      }
      const media = count > 0 ? sum / count : 0
      mediaCell.textContent = media.toFixed(2)
    })
  }
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = $("login-btn")
  const saveBtn = $("save-btn")
  const logoutBtn = $("logout-btn")
  const addRowBtns = document.querySelectorAll(".add-row-btn")

  loginBtn.addEventListener("click", () => {
    const setor = $("setor-select").value
    if (setor) {
      $("login-container").style.display = "none"
      $("a3-container").style.display = "block"
      $("setor-title").textContent = setor

      const data = loadData(setor)
      if (data) {
        $("requisitos-text").value = data.requisitos
        populateTable("situacao-atual-table", data.situacaoAtual)
        populateTable("situacao-alvo-table", data.situacaoAlvo)
        populateTable("plano-acao-table", data.planoAcao)
        populateTable("indicadores-table", data.indicadores)
      }
    } else {
      alert("Por favor, selecione um setor.")
    }
  })

  saveBtn.addEventListener("click", () => {
    const setor = $("setor-title").textContent
    const data = {
      requisitos: $("requisitos-text").value,
      situacaoAtual: getTableData("situacao-atual-table"),
      situacaoAlvo: getTableData("situacao-alvo-table"),
      planoAcao: getTableData("plano-acao-table"),
      indicadores: getTableData("indicadores-table"),
    }
    saveData(setor, data)
    alert("Dados salvos com sucesso!")
  })

  logoutBtn.addEventListener("click", () => {
    $("a3-container").style.display = "none"
    $("login-container").style.display = "block"
    $("setor-select").value = ""
  })

  addRowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      addTableRow(btn.dataset.table)
    })
  })
})

function populateTable(tableId, data) {
  const table = $(tableId)
  data.forEach((rowData) => {
    const row = table.insertRow(-1)
    rowData.forEach((cellData) => {
      const cell = row.insertCell(-1)
      const input = createInput()
      input.value = cellData
      cell.appendChild(input)
    })
    if (tableId === "indicadores-table") {
      updateIndicadoresMedia(row)
    }
  })
}

function getTableData(tableId) {
  const table = $(tableId)
  const data = []
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i]
    const rowData = []
    for (let j = 0; j < row.cells.length; j++) {
      const input = row.cells[j].querySelector("input")
      rowData.push(input ? input.value : row.cells[j].textContent)
    }
    data.push(rowData)
  }
  return data
}

