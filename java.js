import { useState, useEffect } from "react";

// Sidebar
function Sidebar({ view, setView, search, setSearch, onAdd }) {
  return (
    <aside className="w-64 p-4 border-r border-slate-800 flex flex-col">
      <h1 className="text-2xl font-bold text-cyan-400 mb-6">RH • Sistema</h1>
      <input
        type="text"
        placeholder="Pesquisar funcionário..."
        className="w-full mb-4 px-3 py-2 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <nav className="flex flex-col gap-2 mb-6">
        {["dashboard", "funcionarios", "ferias"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`text-left px-3 py-2 rounded-lg transition ${
              view === v
                ? "bg-cyan-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {v === "dashboard" && "Dashboard"}
            {v === "funcionarios" && "Funcionários"}
            {v === "ferias" && "Férias / Atestados"}
          </button>
        ))}
      </nav>
      <button
        className="mt-auto w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2 rounded-xl hover:scale-105 transition"
        onClick={onAdd}
      >
        + Novo funcionário
      </button>
      <div className="mt-6 text-sm text-slate-400">
        <p>👩‍💼 PO: Franciele</p>
        <p>🧑‍💻 SM: Diego</p>
        <p>👨‍🔧 Dev: Matheus</p>
      </div>
    </aside>
  );
}

// Dashboard
function Dashboard({ employees, currentAway }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
        <p className="text-slate-400">Colaboradores</p>
        <p className="text-3xl font-bold">{employees.length}</p>
      </div>
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
        <p className="text-slate-400">Em férias/afastados</p>
        <p className="text-3xl font-bold">{currentAway.length}</p>
      </div>
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
        <p className="text-slate-400">Último acesso</p>
        <p className="text-lg">{new Date().toLocaleDateString("pt-BR")}</p>
      </div>
    </div>
  );
}

// Employees Table
function Employees({ employees, filteredEmployees, onEdit, onDelete, onAway }) {
  return filteredEmployees.length === 0 ? (
    <p className="text-slate-400">Nenhum funcionário cadastrado.</p>
  ) : (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-700">
          <th className="p-2">Nome</th>
          <th className="p-2">CPF</th>
          <th className="p-2">Cargo</th>
          <th className="p-2">Departamento</th>
          <th className="p-2">Ações</th>
        </tr>
      </thead>
      <tbody>
        {filteredEmployees.map((e) => (
          <tr key={e.id} className="border-b border-slate-800 hover:bg-slate-700 transition">
            <td className="p-2">{e.name}</td>
            <td className="p-2">{e.cpf}</td>
            <td className="p-2">{e.role}</td>
            <td className="p-2">{e.dept}</td>
            <td className="p-2 flex gap-2">
              <button
                className="px-3 py-1 bg-slate-700 rounded hover:bg-cyan-600 transition"
                onClick={() => onEdit(e)}
              >
                Editar
              </button>
              <button
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition"
                onClick={() => onDelete(e.id)}
              >
                Remover
              </button>
              <button
                className="px-3 py-1 bg-cyan-600 rounded hover:bg-cyan-500 transition"
                onClick={() => onAway(e.id)}
              >
                Afastar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Away List
function AwayList({ away, employees, onRemove }) {
  return away.length === 0 ? (
    <p className="text-slate-400">Nenhum afastamento registrado.</p>
  ) : (
    <ul className="space-y-2">
      {away.map((a) => {
        const emp = employees.find((e) => e.id === a.empId);
        return (
          <li
            key={a.id}
            className="bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow-md"
          >
            <div>
              <p className="font-semibold">{emp?.name || "[Ex-funcionário]"}</p>
              <p className="text-slate-400 text-sm">
                {a.reason} — {a.from} {a.to ? até ${a.to} : ""}
              </p>
            </div>
            <button
              className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition"
              onClick={() => onRemove(a.id)}
            >
              Remover
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Modal Form
function EmployeeModal({ show, onClose, formData, setFormData, onSave }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={onSave}
        className="bg-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-4 shadow-lg"
      >
        <h3 className="text-xl font-bold">
          {formData.id ? "Editar Funcionário" : "Novo Funcionário"}
        </h3>
        <input
          className="w-full p-2 rounded bg-slate-700"
          placeholder="Nome"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-slate-700"
          placeholder="CPF"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-slate-700"
          placeholder="Cargo"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-slate-700"
          placeholder="Departamento"
          value={formData.dept}
          onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-slate-700"
          placeholder="Salário"
          type="number"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-slate-700"
          placeholder="Data de admissão"
          type="date"
          value={formData.adm}
          onChange={(e) => setFormData({ ...formData, adm: e.target.value })}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1 bg-slate-600 rounded hover:bg-slate-500 transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-cyan-600 rounded hover:bg-cyan-500 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

// Main App
export default function App() {
  const [view, setView] = useState("dashboard");
  const [employees, setEmployees] = useState(() => JSON.parse(localStorage.getItem("employees") || "[]"));
  const [away, setAway] = useState(() => JSON.parse(localStorage.getItem("away") || "[]"));
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", cpf: "", role: "", dept: "", salary: "", adm: "" });

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("away", JSON.stringify(away));
  }, [employees, away]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    const newList = formData.id
      ? employees.map((f) => (f.id === formData.id ? formData : f))
      : [{ ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...employees];
    setEmployees(newList);
    setFormData({ id: "", name: "", cpf: "", role: "", dept: "", salary: "", adm: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Remover funcionário?")) {
      setEmployees(employees.filter((f) => f.id !== id));
      setAway(away.filter((a) => a.empId !== id));
    }
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setShowModal(true);
  };

  const registerAway = (empId) => {
    const from = prompt("Data início (YYYY-MM-DD):", new Date().toISOString().slice(0, 10));
    if (!from) return;
    const to = prompt("Data fim (opcional):", "");
    const reason = prompt("Motivo/CID:", "Atestado");
    setAway([...away, { id: Date.now().toString(), empId, from, to, reason }]);
  };

  const filteredEmployees = employees.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));

  const currentAway = away.filter((a) => {
    const now = new Date();
    const f = new Date(a.from);
    const t = a.to ? new Date(a.to) : f;
    return f <= now && now <= t;
  });

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <Sidebar view={view} setView={setView} search={search} setSearch={setSearch} onAdd={() => setShowModal(true)} />
      <main className="flex-1 p-6 overflow-y-auto">
        {view === "dashboard" && <Dashboard employees={employees} currentAway={currentAway} />}
        {view === "funcionarios" && (
          <Employees
            employees={employees}
            filteredEmployees={filteredEmployees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAway={registerAway}
          />
        )}
        {view === "ferias" && <AwayList away={away} employees={employees} onRemove={(id) => setAway(away.filter((a) => a.id !== id))} />}
      </main>
      <EmployeeModal show={showModal} onClose={() => setShowModal(false)} formData={formData} setFormData={setFormData} onSave={handleSave} />
    </div>
  );
}