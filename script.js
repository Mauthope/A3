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
    // Adiciona evento para aplicar a coloração e atualizar o status
    select.addEventListener("change", () => aplicarColoracaoStatus(select))
    return select
  } else if (colIndex === 6) { // Supondo que o índice 6 seja a célula de "Evidência"
    // Cria um campo de texto normal, em branco
    const input = document.createElement("input")
    input.type = "text"
    input.placeholder = "Cole a URL aqui"
    
    // Quando o valor for alterado, verificar se é uma URL e converter em hyperlink
    input.addEventListener("input", () => {
      const url = input.value
      // Verifica se o texto colado é uma URL válida
      const isValidUrl = url.match(/^https?:\/\/[^\s$.?#].[^\s]*$/i) 
      if (isValidUrl) {
        // Cria o hyperlink
        const link = document.createElement("a")
        link.href = url
        link.textContent = "Clique aqui"
        link.target = "_blank" // Abre o link em uma nova aba
        // Substitui o campo de texto pelo link
        input.replaceWith(link)
      }
    })
    
    return input
  } else {
    return criarInput()
  }
}

// Função para aplicar a coloração e ajustar o status
function aplicarColoracaoStatus(select) {
  const status = select.value
  const prazoInput = select.closest('tr').querySelector('td input[type="date"]:nth-of-type(2)') // Encontrando a célula de prazo
  const statusCell = select.closest('td')
  
  const prazo = new Date(prazoInput.value)
  const hoje = new Date()

  if (status === "Em andamento") {
    statusCell.style.backgroundColor = "blue"
    statusCell.style.color = "white"
  } else if (status === "Concluído") {
    statusCell.style.backgroundColor = "green"
    statusCell.style.color = "white"
  } else {
    // Se o prazo passou e o status não é "Concluído", marca como "Atrasado"
    if (hoje > prazo && status !== "Concluído") {
      statusCell.style.backgroundColor = "red"
      statusCell.style.color = "white"
      select.value = "Atrasado" // Altera o texto para "Atrasado"
    }
  }
}
