// Salvar gasto
function addExpense() {
    const valor = document.getElementById("valor").value;
    const categoria = document.getElementById("categoria").value;

    if (!valor || !categoria) {
        alert("Preencha todos os campos!");
        return;
    }

    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    gastos.push({
        valor: parseFloat(valor),
        categoria: categoria
    });

    localStorage.setItem("gastos", JSON.stringify(gastos));

    alert("Gasto salvo!");
    window.location.href = "dashboard.html";
}

// Listar gastos no dashboard
function loadDashboard() {
    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    let total = 0;

    gastos.forEach(g => total += g.valor);

    document.getElementById("totalGastos").innerText = total.toFixed(2);

    const lista = document.getElementById("listaGastos");
    lista.innerHTML = "";

    gastos.forEach(g => {
        const li = document.createElement("li");
        li.innerText = `${g.categoria}: R$ ${g.valor}`;
        lista.appendChild(li);
    });
}

// Relatório por categoria
function loadReports() {
    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    const categorias = {};

    gastos.forEach(g => {
        if (!categorias[g.categoria]) {
            categorias[g.categoria] = 0;
        }
        categorias[g.categoria] += g.valor;
    });

    const lista = document.getElementById("relatorio");
    lista.innerHTML = "";

    for (let cat in categorias) {
        const li = document.createElement("li");
        li.innerText = `${cat}: R$ ${categorias[cat].toFixed(2)}`;
        lista.appendChild(li);
    }
}
