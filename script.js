<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard A3</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="login-container">
        <h1>Login do Sistema A3</h1>
        <select id="setor-select">
            <option value="">Selecione o setor</option>
            <option value="Laminação">Laminação</option>
            <option value="Impressão">Impressão</option>
            <option value="Acabamento">Acabamento</option>
            <option value="Soldada">Soldada</option>
            <option value="Corte BB">Corte BB</option>
            <option value="Corte e Solda">Corte e Solda</option>
            <option value="Carimbadeira">Carimbadeira</option>
            <option value="Logística">Logística</option>
            <option value="Apontamento">Apontamento</option>
            <option value="Expedição">Expedição</option>
            <option value="Manutenção">Manutenção</option>
        </select>
        <button id="login-btn" class="btn-adicionar">Entrar</button>
    </div>

    <div id="a3-container" style="display: none;">
        <h1>Dashboard A3 - <span id="setor-title"></span></h1>
        
        <section id="requisitos-negocio">
            <h2>Requisitos de Negócio</h2>
            <div class="requisitos-wrapper">
                <ul id="requisitos-list" class="requisitos-list">
                    <!-- Requisitos serão adicionados dinamicamente -->
                </ul>
            </div>
            <button id="add-requisito" class="btn-adicionar">Adicionar Tópico</button>
        </section>

        <div class="situacao-container">
            <div class="situacao-atual">
                <h2>Situação Atual</h2>
                <div class="table-wrapper">
                    <table id="situacao-atual-table">
                        <thead>
                            <tr>
                                <th>Indicadores</th>
                                <th>Meta</th>
                                <th>OBJ. Futuro</th>
                                <th>Realizado ano anterior</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Linhas serão adicionadas dinamicamente -->
                        </tbody>
                    </table>
                </div>
                <button class="btn-adicionar" id="add-situacao-atual">Adicionar Linha</button>
            </div>

            <div class="situacao-alvo">
                <h2>Situação Alvo</h2>
                <div class="table-wrapper">
                    <table id="situacao-alvo-table">
                        <thead>
                            <tr>
                                <th>Indicadores</th>
                                <th>Meta</th>
                                <th>OBJ. Futuro</th>
                                <th>Realizado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Linhas serão adicionadas dinamicamente -->
                        </tbody>
                    </table>
                </div>
                <button class="btn-adicionar" id="add-situacao-alvo">Adicionar Linha</button>
            </div>
        </div>

        <section class="plano-acao">
            <h2>Plano de Ação</h2>
            <div class="table-wrapper">
                <table id="plano-acao-table">
                    <thead>
                        <tr>
                            <th class="col-acao">Ação</th>
                            <th>Indicadores Alvo</th>
                            <th>Data de Abertura</th>
                            <th>Responsável</th>
                            <th>Prazo</th>
                            <th>Status</th>
                            <th>Evidência</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Linhas serão adicionadas dinamicamente -->
                    </tbody>
                </table>
            </div>
            <button class="btn-adicionar" id="add-plano-acao">Adicionar Linha</button>
        </section>

        <section class="indicadores">
            <h2>Indicadores</h2>
            <div class="table-wrapper">
                <table id="indicadores-table">
                    <thead>
                        <tr>
                            <th>Indicadores</th>
                            <th>Meta</th>
                            <th>OBJ Futuro</th>
                            <th>Jan</th>
                            <th>Fev</th>
                            <th>Mar</th>
                            <th>Abr</th>
                            <th>Mai</th>
                            <th>Jun</th>
                            <th>Jul</th>
                            <th>Ago</th>
                            <th>Set</th>
                            <th>Out</th>
                            <th>Nov</th>
                            <th>Dez</th>
                            <th>Média</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Linhas serão adicionadas dinamicamente -->
                    </tbody>
                </table>
            </div>
            <button class="btn-adicionar" id="add-indicadores">Adicionar Linha</button>
        </section>

        <div class="actions">
            <button id="save-btn">Salvar A3</button>
            <button id="logout-btn">Sair</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>

