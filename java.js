let employees = [];
let away = [];

function showView(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  document.getElementById(view).classList.remove("hidden");
}

function openModal() {
  document.getElementById("employeeModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("employeeModal").classList.add("hidden");
}

function saveEmployee() {
  const emp = {
    id: Date.now(),
    name: document.getElementById("name").value,
    cpf: document.getElementById("cpf").value,
    role: document.getElementById("role").value,
    dept: document.getElementById("dept").value,
    salary: document.getElementById("salary").value,
    adm: document.getElementById("adm").value
  };
  employees.push(emp);
  updateUI();
  closeModal();
}

function updateUI() {
  // Dashboard
  document.getElementById("totalColab").innerText = employees.length;
  document.getElementById("totalAway").innerText = away.length;
  document.getElementById("ultimoAcesso").innerText = new Date().toLocaleDateString("pt-BR");

  // Tabela funcionários
  const tbody = document.getElementById("employeeTable");
  tbody.innerHTML = "";
  employees.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.name}</td>
      <td>${e.cpf}</td>
      <td>${e.role}</td>
      <td>${e.dept}</td>
      <td>
        <button onclick="removeEmployee(${e.id})">Remover</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function removeEmployee(id) {
  employees = employees.filter(e => e.id !== id);
  updateUI();
}

updateUI();
