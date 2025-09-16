let employees = JSON.parse(localStorage.getItem("employees") || "[]");
let away = JSON.parse(localStorage.getItem("away") || "[]");
let editId = null;

function showView(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  document.getElementById(view).classList.remove("hidden");
  updateUI();
}

function openModal(emp = null) {
  document.getElementById("employeeModal").classList.remove("hidden");
  if (emp) {
    editId = emp.id;
    document.getElementById("modalTitle").innerText = "Editar Funcionário";
    document.getElementById("name").value = emp.name;
    document.getElementById("cpf").value = emp.cpf;
    document.getElementById("role").value = emp.role;
    document.getElementById("dept").value = emp.dept;
    document.getElementById("salary").value = emp.salary;
    document.getElementById("adm").value = emp.adm;
  } else {
    editId = null;
    document.getElementById("modalTitle").innerText = "Novo Funcionário";
    document.querySelectorAll("#employeeModal input").forEach(i => i.value = "");
  }
}

function closeModal() {
  document.getElementById("employeeModal").classList.add("hidden");
}

function saveEmployee() {
  const emp = {
    id: editId || Date.now(),
    name: document.getElementById("name").value,
    cpf: document.getElementById("cpf").value,
    role: document.getElementById("role").value,
    dept: document.getElementById("dept").value,
    salary: document.getElementById("salary").value,
    adm: document.getElementById("adm").value
  };

  if (!emp.name || !emp.cpf) {
    alert("Nome e CPF são obrigatórios!");
    return;
  }

  if (editId) {
    employees = employees.map(e => e.id === editId ? emp : e);
  } else {
    employees.push(emp);
  }

  localStorage.setItem("employees", JSON.stringify(employees));
  updateUI();
  closeModal();
}

function removeEmployee(id) {
  if (confirm("Deseja remover este funcionário?")) {
    employees = employees.filter(e => e.id !== id);
    localStorage.setItem("employees", JSON.stringify(employees));
    updateUI();
  }
}

function registerAway(id) {
  const reason = prompt("Motivo do afastamento:", "Férias");
  if (!reason) return;
  const from = prompt("Data início (AAAA-MM-DD):", new Date().toISOString().slice(0,10));
  const to = prompt("Data fim (AAAA-MM-DD):", "");
  away.push({ id: Date.now(), empId: id, reason, from, to });
  localStorage.setItem("away", JSON.stringify(away));
  updateUI();
}

function removeAway(id) {
  away = away.filter(a => a.id !== id);
  localStorage.setItem("away", JSON.stringify(away));
  updateUI();
}

function updateUI() {
  // Dashboard
  document.getElementById("totalColab").innerText = employees.length;
  document.getElementById("totalAway").innerText = away.length;
  document.getElementById("ultimoAcesso").innerText = new Date().toLocaleDateString("pt-BR");

  // Pesquisa
  const search = document.getElementById("search").value.toLowerCase();

  // Funcionários
  const tbody = document.getElementById("employeeTable");
  tbody.innerHTML = "";
  employees
    .filter(e => e.name.toLowerCase().includes(search))
    .forEach(e => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.name}</td>
        <td>${e.cpf}</td>
        <td>${e.role}</td>
        <td>${e.dept}</td>
        <td>
          <button onclick="openModal(${JSON.stringify(e).replace(/"/g, '&quot;')})">Editar</button>
          <button onclick="removeEmployee(${e.id})">Remover</button>
          <button onclick="registerAway(${e.id})">Afastar</button>
        </td>`;
      tbody.appendChild(tr);
    });

  // Lista de afastamentos
  const ul = document.getElementById("awayList");
  ul.innerHTML = "";
  away.forEach(a => {
    const emp = employees.find(e => e.id === a.empId);
    const li = document.createElement("li");
    li.innerHTML = `
      ${emp ? emp.name : "[Ex-funcionário]"} - ${a.reason} (${a.from} até ${a.to || "indefinido"})
      <button onclick="removeAway(${a.id})">Remover</button>`;
    ul.appendChild(li);
  });
}

updateUI();
