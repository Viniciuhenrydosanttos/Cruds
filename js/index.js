async function carregarProdutos() {
  try {
    const res = await fetch("http://192.168.1.4:3000/produtos");
    const produtos = await res.json();
    const tbody = document.querySelector("#tabela-produtos tbody");
    tbody.innerHTML = "";

    if (!Array.isArray(produtos)) return;

    produtos.forEach(prod => {
      const tr = document.createElement("tr");

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.style.background = "linear-gradient(90deg, #4b6cb7, #182848)";
      btnEditar.style.color = "white";
      btnEditar.style.border = "none";
      btnEditar.style.padding = "5px 15px";
      btnEditar.style.borderRadius = "5px";
      btnEditar.style.cursor = "pointer";
      btnEditar.onclick = () => editarProduto(prod);

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

function editarProduto(prod) {
  document.getElementById("id_produto")?.remove();
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

  try {
    const url = id ? `http://192.168.1.4:3000/produtos/${id}` : "http://192.168.1.4:3000/produtos";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.error || "Erro ao cadastrar/atualizar produto");
    }

    e.target.reset();
    document.getElementById("id_produto")?.remove();
    carregarProdutos();
    carregarProdutosParaEntrada(); // Atualiza select de entradas
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

async function deletarProduto(id) {
  if (!confirm("Deseja realmente deletar este produto?")) return;

  try {
    const res = await fetch(`http://192.168.1.4:3000/produtos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.error || "Erro ao deletar produto");
    }
    carregarProdutos();
    carregarProdutosParaEntrada();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

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
        <td>${f.telefone || "-"}</td>
        <td>${f.endereco || "-"}</td>
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

document.getElementById("form-fornecedor").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nome: document.getElementById("fornecedor-nome").value,
    cnpj: document.getElementById("fornecedor-cnpj").value,
    telefone: document.getElementById("fornecedor-numero").value,
    endereco: document.getElementById("fornecedor-endereco")?.value || ""
  };

  try {
    const res = await fetch("http://192.168.1.4:3000/fornecedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.error || "Erro ao cadastrar fornecedor");
    }

    e.target.reset();
    carregarFornecedores();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

async function deletarFornecedor(id) {
  if (!confirm("Deseja realmente deletar este fornecedor?")) return;

  try {
    const res = await fetch(`http://192.168.1.4:3000/fornecedores/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.error || "Erro ao deletar fornecedor");
    }
    carregarFornecedores();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function carregarProdutosParaEntrada() {
  try {
    const res = await fetch("http://192.168.1.4:3000/produtos");
    const produtos = await res.json();
    const select = document.getElementById("entrada-produto");
    select.innerHTML = `<option value="">Selecione o produto</option>`;
    produtos.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id_produto;
      option.textContent = p.nome;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar produtos para entrada:", err);
  }
}

async function carregarEntradas() {
  try {
    const res = await fetch("http://192.168.1.4:3000/entradas");
    const entradas = await res.json();
    const tbody = document.querySelector("#tabela-entradas tbody");
    tbody.innerHTML = "";

    if (!Array.isArray(entradas)) return;

    entradas.forEach(ent => {
      const dataFormatada = ent.data ? new Date(ent.data).toLocaleDateString('pt-BR') : "-";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ent.fornecedor}</td>
        <td>${ent.produto}</td>
        <td>${ent.quantidade}</td>
        <td>${dataFormatada}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar entradas:", err);
  }
}

document.getElementById("form-entrada").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id_fornecedor = parseInt(document.getElementById("entrada-fornecedor").value);
  const id_produto = parseInt(document.getElementById("entrada-produto").value);
  const quantidade = parseInt(document.getElementById("entrada-quantidade").value);
  const data = document.getElementById("entrada-data").value;

  if (!id_fornecedor || !id_produto || !quantidade || !data) {
    alert("Preencha todos os campos da entrada!");
    return;
  }

  const entradaData = { id_fornecedor, id_produto, quantidade, data };

  try {
    const res = await fetch("http://192.168.1.4:3000/entradas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entradaData)
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.error || "Erro ao cadastrar entrada");
    }

    e.target.reset();
    carregarEntradas();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

window.onload = () => {
  carregarProdutos();
  carregarFornecedores();
  carregarProdutosParaEntrada();
  carregarEntradas();
};
