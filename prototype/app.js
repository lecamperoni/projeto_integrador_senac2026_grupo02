// ===================== STORAGE =====================
function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses")) || [];
}

function saveExpenses(data) {
    localStorage.setItem("expenses", JSON.stringify(data));
}

function getIncomes() {
    return JSON.parse(localStorage.getItem("incomes")) || [];
}

function saveIncomes(data) {
    localStorage.setItem("incomes", JSON.stringify(data));
}

// ===================== CREATE =====================
function addExpense() {
    const valor = document.getElementById("valor").value;
    const categoria = document.getElementById("categoria").value;

    const expenses = getExpenses();

    expenses.push({
        id: Date.now(),
        valor: parseFloat(valor),
        categoria
    });

    saveExpenses(expenses);
    window.location.href = "dashboard.html";
}

function addIncome() {
    const valor = document.getElementById("valor").value;
    const fonte = document.getElementById("fonte").value;

    const incomes = getIncomes();

    incomes.push({
        id: Date.now(),
        valor: parseFloat(valor),
        fonte
    });

    saveIncomes(incomes);
    window.location.href = "dashboard.html";
}

// ===================== READ =====================
function loadDashboard() {
    const expenses = getExpenses();
    const incomes = getIncomes();

    let totalGastos = 0;
    let totalReceitas = 0;

    expenses.forEach(e => totalGastos += e.valor);
    incomes.forEach(i => totalReceitas += i.valor);

    document.getElementById("gastos").innerText = totalGastos.toFixed(2);
    document.getElementById("receitas").innerText = totalReceitas.toFixed(2);
    document.getElementById("saldo").innerText = (totalReceitas - totalGastos).toFixed(2);

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    expenses.forEach(e => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${e.categoria} - R$ ${e.valor}
            <button onclick="deleteExpense(${e.id})">X</button>
            <button onclick="goToEdit(${e.id})">Editar</button>
        `;
        lista.appendChild(li);
    });
}

// ===================== DELETE =====================
function deleteExpense(id) {
    let expenses = getExpenses();
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses(expenses);
    loadDashboard();
}

// ===================== EDIT =====================
function goToEdit(id) {
    localStorage.setItem("editId", id);
    window.location.href = "edit-expense.html";
}

function loadEdit() {
    const id = Number(localStorage.getItem("editId"));
    const expenses = getExpenses();

    const exp = expenses.find(e => e.id === id);

    document.getElementById("valor").value = exp.valor;
    document.getElementById("categoria").value = exp.categoria;
}

function updateExpense() {
    const id = Number(localStorage.getItem("editId"));
    let expenses = getExpenses();

    expenses = expenses.map(e => {
        if (e.id === id) {
            return {
                ...e,
                valor: parseFloat(document.getElementById("valor").value),
                categoria: document.getElementById("categoria").value
            };
        }
        return e;
    });

    saveExpenses(expenses);
    window.location.href = "dashboard.html";
}

// ===================== REPORT =====================
function loadReports() {
    const expenses = getExpenses();

    const categorias = {};

    expenses.forEach(e => {
        categorias[e.categoria] = (categorias[e.categoria] || 0) + e.valor;
    });

    const lista = document.getElementById("relatorio");
    lista.innerHTML = "";

    for (let cat in categorias) {
        const li = document.createElement("li");
        li.innerText = `${cat}: R$ ${categorias[cat].toFixed(2)}`;
        lista.appendChild(li);
    }

    drawChart(categorias);
}

// ===================== CHART =====================
function drawChart(data) {
    const canvas = document.getElementById("chart");
    const ctx = canvas.getContext("2d");

    let total = Object.values(data).reduce((a, b) => a + b, 0);

    let start = 0;

    for (let cat in data) {
        let slice = (data[cat] / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 100, start, start + slice);
        ctx.fillStyle = getRandomColor();
        ctx.fill();

        start += slice;
    }
}

function getRandomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}
