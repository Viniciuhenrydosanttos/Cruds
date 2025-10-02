// ================== PRODUTOS ==================
async function carregarProdutos() {
  try {
    const res = await fetch("http://192.168.1.4:3000/produtos");
    const produtos = await res.json();
    const tbody = document.querySelector("#tabela-produtos tbody");
    tbody.innerHTML = "";

    if (!Array.isArray(produtos)) {
      console.error("Produtos retornados não são um array:", produtos);
      return;
    }

    produtos.forEach(prod => {
      const tr = document.createElement("tr");

      // Botão Editar
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.style.background = "linear-gradient(90deg, #4b6cb7, #182848)";
      btnEditar.style.color = "white";
      btnEditar.style.border = "none";
      btnEditar.style.padding = "5px 15px";
      btnEditar.style.borderRadius = "5px";
      btnEditar.style.cursor = "pointer";
      btnEditar.onclick = () => editarProduto(prod);

      // Botão Excluir
      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.style.background = "linear-gradient(90deg, #ff416c, #ff4b2b)";
      btnExcluir.style.color = "white";
      btnExcluir.style.border = "none";
      btnExcluir.style.padding = "5px 15px";
      btnExcluir.style.borderRadius = "5px";
      btnExcluir.style.cursor = "pointer";
      btnExcluir.onclick = () => deletarProduto(prod.id_produto);

      tr.innerHTML = `
        <td>${prod.nome}</td>
        <td>${prod.descricao}</td>
        <td>R$ ${prod.preco || 0}</td>
        <td>${prod.quantidade}</td>
        <td>${prod.categoria}</td>
      `;

      const tdAcoes = document.createElement("td");
      tdAcoes.appendChild(btnEditar);
      tdAcoes.appendChild(document.createTextNode(" "));
      tdAcoes.appendChild(btnExcluir);
      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

// Preenche formulário para edição
function editarProduto(prod) {
  document.getElementById("id_produto")?.remove(); // remove se existir
  const inputId = document.createElement("input");
  inputId.type = "hidden";
  inputId.id = "id_produto";
  inputId.value = prod.id_produto;
  document.getElementById("form-produto").appendChild(inputId);

  document.getElementById("nome").value = prod.nome;
  document.getElementById("descricao").value = prod.descricao;
  document.getElementById("preco").value = prod.preco;
  document.getElementById("quantidade").value = prod.quantidade;
  document.getElementById("categoria").value = prod.categoria;

  document.getElementById("form-produto").scrollIntoView({ behavior: "smooth" });
}

// Criar ou atualizar produto
document.getElementById("form-produto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("id_produto")?.value;
  const data = {
    nome: document.getElementById("nome").value,
    descricao: document.getElementById("descricao").value,
    preco: parseFloat(document.getElementById("preco").value) || 0,
    quantidade: parseInt(document.getElementById("quantidade").value) || 0,
    categoria: document.getElementById("categoria").value
  };

  if (id) {
    await fetch(`http://192.168.1.4:3000/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } else {
    await fetch("http://192.168.1.4:3000/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  e.target.reset();
  document.getElementById("id_produto")?.remove();
  carregarProdutos();
});

// Deletar produto
async function deletarProduto(id) {
  if (!confirm("Deseja realmente deletar este produto?")) return;

  try {
    await fetch(`http://192.168.1.4:3000/produtos/${id}`, { method: "DELETE" });
    carregarProdutos();
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    alert("Não foi possível deletar o produto.");
  }
}

// ================== FORNECEDORES ==================
async function carregarFornecedores() {
  try {
    const res = await fetch("http://192.168.1.4:3000/fornecedores");
    const fornecedores = await res.json();
    const tbody = document.querySelector("#tabela-fornecedores tbody");
    const select = document.getElementById("entrada-fornecedor");

    tbody.innerHTML = "";
    select.innerHTML = `<option value="">Selecione o Fornecedor</option>`;

    fornecedores.forEach(f => {
      const tr = document.createElement("tr");

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.style.background = "linear-gradient(90deg, #ff416c, #ff4b2b)";
      btnExcluir.style.color = "white";
      btnExcluir.style.border = "none";
      btnExcluir.style.padding = "5px 15px";
      btnExcluir.style.borderRadius = "5px";
      btnExcluir.style.cursor = "pointer";
      btnExcluir.onclick = () => deletarFornecedor(f.id_fornecedor);

      tr.innerHTML = `
        <td>${f.nome}</td>
        <td>${f.cnpj}</td>
        <td>${f.telefone}</td>
      `;
      const tdAcoes = document.createElement("td");
      tdAcoes.appendChild(btnExcluir);
      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);

      const option = document.createElement("option");
      option.value = f.id_fornecedor;
      option.textContent = f.nome;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar fornecedores:", err);
  }
}

// Deletar fornecedor
async function deletarFornecedor(id) {
  if (!confirm("Deseja realmente deletar este fornecedor?")) return;

  try {
    await fetch(`http://192.168.1.4:3000/fornecedores/${id}`, { method: "DELETE" });
    carregarFornecedores();
  } catch (err) {
    console.error("Erro ao deletar fornecedor:", err);
    alert("Não foi possível deletar o fornecedor.");
  }
}

// ================== ENTRADAS ==================
async function carregarEntradas() {
  try {
    const res = await fetch("http://192.168.1.4:3000/entradas");
    const entradas = await res.json();
    const tbody = document.querySelector("#tabela-entradas tbody");
    tbody.innerHTML = "";

    entradas.forEach(ent => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ent.fornecedor}</td>
        <td>${ent.produto}</td>
        <td>${ent.quantidade}</td>
        <td>${ent.data}</td>
        <td>${ent.hora || "-"}</td>
        <td>${ent.data_saida || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar entradas:", err);
  }
}

// ================== INICIALIZAÇÃO ==================
window.onload = () => {
  carregarProdutos();
  carregarFornecedores();
  carregarEntradas();
};
  