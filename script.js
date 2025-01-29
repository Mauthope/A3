document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
});

function $(id) {
  return document.getElementById(id);
}

function initializeEventListeners() {
  $("login-btn").addEventListener("click", handleLogin);
  $("logout-btn").addEventListener("click", handleLogout);
  $("save-btn").addEventListener("click", handleSave);

  $("add-requisito").addEventListener("click", () => adicionarRequisito());
  $("add-situacao-atual").addEventListener("click", () => adicionarLinha("situacao-atual-table"));
  $("add-situacao-alvo").addEventListener("click", () => adicionarLinha("situacao-alvo-table"));
  $("add-plano-acao").addEventListener("click", () => adicionarLinha("plano-acao-table"));
  $("add-indicadores").addEventListener("click", () => adicionarLinha("indicadores-table"));
}

function aplicarColoracao(row) {
  const metaInput = row.cells[1].querySelector("input");
  const objFuturoInput = row.cells[2].querySelector("input");

  if (!metaInput || !objFuturoInput) return;

  const meta = parseFloat(metaInput.value.replace(",", ".")) || 0; // Converte corretamente números com vírgula
  const objFuturo = parseFloat(objFuturoInput.value.replace(",", ".")) || 0;

  if (isNaN(meta) || isNaN(objFuturo)) return;

  const cells = Array.from(row.cells).slice(3); // Pega as colunas de valores

  cells.forEach((cell) => {
    const input = cell.querySelector("input");
    if (!input) return;

    const valor = parseFloat(input.value.replace(",", ".")); // Converte corretamente números com vírgula
    if (isNaN(valor) || input.value.trim() === "") {
      cell.classList.remove("cor-verde", "cor-laranja", "cor-vermelho");
      return;
    }

    let cor;
    if (objFuturo > meta) {
      if (valor >= objFuturo) cor = "verde";
      else if (valor >= meta) cor = "laranja";
      else cor = "vermelho";
    } else {
      if (valor <= objFuturo) cor = "verde";
      else if (valor <= meta) cor = "laranja";
      else cor = "vermelho";
    }

    cell.classList.remove("cor-verde", "cor-laranja", "cor-vermelho");
    cell.classList.add(`cor-${cor}`);
  });
}

function configurarColoracaoCelulas(row) {
  const metaInput = row.cells[1].querySelector("input");
  const objFuturoInput = row.cells[2].querySelector("input");
  
  [metaInput, objFuturoInput].forEach((input) => {
    input.addEventListener("input", () => aplicarColoracao(row));
  });
}

function configurarCalculoMedia(row) {
  const inputs = Array.from(row.cells)
    .slice(3, -1)
    .map((cell) => cell.querySelector("input"));
  const mediaCell = row.cells[row.cells.length - 1];

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const valores = inputs
        .map((inp) => parseFloat(inp.value.replace(",", ".")))
        .filter((val) => !isNaN(val));

      const media = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;

      mediaCell.textContent = media.toFixed(2);
      aplicarColoracao(row);
    });
  });
}
