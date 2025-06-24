async function buscar() {
  const valor = document.getElementById("search").value.trim();

  if (!valor) {
    alert("Digite um ID ou Nome.");
    return;
  }

  const url = isNaN(valor) ? `/users/name/${valor}` : `/users/${valor}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      document.getElementById("resultado").innerHTML = "Usuário não encontrado.";
      return;
    }

    const user = await res.json();

    if (!user || Object.keys(user).length === 0) {
      document.getElementById("resultado").innerHTML = "Usuário não encontrado.";
      return;
    }

    document.getElementById("resultado").innerHTML = `
      <p><strong>ID:</strong> ${user.id}</p>
      <p><strong>Nome:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <h3>Posts:</h3>
      <ul>${user.posts.map(post => `<li>${post.title}</li>`).join('')}</ul>
      <button onclick="deletar(${user.id})">Deletar usuário</button>
    `;

  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    document.getElementById("resultado").innerHTML = "Erro ao buscar usuário.";
  }
}

async function adicionar() {
  const nome = document.getElementById("novoUsuario").value.trim();
  const email = document.getElementById("novoEmail").value.trim();

  if (!email || !nome) {
    alert("Preencha nome e email!");
    return;
  }

  try {
    const res = await fetch('/users', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome, email: email })
    });

    if (res.ok) {
      alert("Usuário criado!");
      document.getElementById("novoUsuario").value = "";
      document.getElementById("novoEmail").value = "";
    } else {
      const err = await res.json();
      alert("Erro ao criar usuário: " + (err?.error || res.statusText));
    }
  } catch (error) {
    console.error("Erro ao adicionar usuário:", error);
    alert("Erro de rede ou servidor.");
  }
}

async function deletar(id) {
  if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

  try {
    const res = await fetch(`/users/${id}`, { method: "DELETE" });

    if (res.ok) {
      alert("Usuário deletado!");
      document.getElementById("resultado").innerHTML = "";
    } else {
      alert("Erro ao deletar usuário.");
    }
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert("Erro ao deletar usuário.");
  }
}
