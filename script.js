let nt = document.getElementById('novat');
let cancel = document.getElementById('cancelar');
let m = document.getElementById('modal')

nt.addEventListener('click', () =>{
    m.classList.add('active');
})
cancel.addEventListener('click', () => {
    m.classList.remove('active')
})

const transactions = [{ // array de objetos das minhas transações
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021'
}, {
    id: 2,
    description: 'website',
    amount: 500000,
    date: '23/01/2021'
}, {
    id: 3,
    description: 'internet',
    amount: 500,
    date: '23/01/2021'
}
]

const Transaction = {
    incomes() {
        let income = 0;
        //Somar as entradas
        transactions.forEach(transaction => {
            if(Number(transaction.amount) > 0) {
                income += transaction.amount
            }
        })
        return income;
    },
    expenses() {
        // Somar as saidas
        let expense = 0;
        transactions.forEach(transaction => {
            if(Number(transaction.amount) > 0) {
                expense += transaction.amount
            }
        })
        return expense;
    },
    total() {
        // saida - entrada
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionContainer : document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHtmlTransaction(transaction); // Coloca o corpo thml da minha linha da table
        DOM.transactionContainer.appendChild(tr); // Depois dos nos criados adiciono no meu Tbody
    },
    innerHtmlTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}"> ${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="./assets/minus.svg" alt=""></td>

        `
        return html;
    },
    updateBalance() {
        document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "");
        value = Number(value / 100)
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        //console.log(signal);
        return signal + value;
    }
}


//DOM.addTransaction(transactions[0]);
//DOM.addTransaction(transactions[1]);
//DOM.addTransaction(transactions[2]);

transactions.forEach(transaction => {
    DOM.addTransaction(transaction);
});

DOM.updateBalance();

