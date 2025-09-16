let employees = JSON.parse(localStorage.getItem("employees") || "[]");
let away = JSON.parse(localStorage.getItem("away") || "[]");
let editId = null;
let awayEmpId = null;

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// --------- Funcionários ----------
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
  const name = document.getElementById("name").value;
  const cpf = document.getElementById("cpf").value;
  const role = document.getElementById("role").value;
  const dept = document.getElementById("dept").value;
  const salary = document.getElementById("salary").value;
  const adm = document.getElementById("adm").value;

  if (!name || !cpf || !role || !dept) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  if (editId) {
    employees = employees.map(e => e.id === editId ? {id: editId, name, cpf, role, dept, salary, adm} : e);
  } else {
    employees.push({ id: Date.now(), name, cpf, role, dept, salary, adm });
  }

  localStorage.setItem("employees", JSON.stringify(employees));
  closeModal();
  updateUI();
}

function removeEmployee(id) {
  if (confirm("Deseja remover este funcionário?")) {
    employees = employees.filter(e => e.id !== id);
    localStorage.setItem("employees", JSON.stringify(employees));
    updateUI();
  }
}

// --------- Afastamentos ----------
function openAwayModal(empId) {
  awayEmpId = empId;
  document.getElementById("awayModal").classList.remove("hidden");
  document.getElementById("awayReason").value = "";
  document.getElementById("awayFrom").value = new Date().toISOString().slice(0,10);
  document.getElementById("awayTo").value = "";
}

function closeAwayModal() {
  document.getElementById("awayModal").classList.add("hidden");
}

function saveAway() {
  const reason = document.getElementById("awayReason").value;
  const from = document.getElementById("awayFrom").value;
  const to = document.getElementById("awayTo").value;

  if (!reason || !from) {
    alert("Motivo e data de início são obrigatórios!");
    return;
  }

  away.push({ id: Date.now(), empId: awayEmpId, reason, from, to });
  localStorage.setItem("away", JSON.stringify(away));
  closeAwayModal();
  updateUI();
}

function removeAway(id) {
  away = away.filter(a => a.id !== id);
  localStorage.setItem("away", JSON.stringify(away));
  updateUI();
}

// --------- Atualizar Tela ----------
function updateUI() {
  document.getElementById("totalColab").innerText = employees.length;
  document.getElementById("totalAway").innerText = away.length;
  document.getElementById("ultimoAcesso").innerText = new Date().toLocaleDateString("pt-BR");

  const search = document.getElementById("search").value.toLowerCase();
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
          <button onclick='openModal(${JSON.stringify(e).replace(/"/g, "&quot;")})'>Editar</button>
          <button onclick="removeEmployee(${e.id})">Remover</button>
          <button onclick="openAwayModal(${e.id})">Afastar</button>
        </td>`;
      tbody.appendChild(tr);
    });

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
