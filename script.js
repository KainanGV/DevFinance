let nt = document.getElementById('novat');
let cancel = document.getElementById('cancelar');
let m = document.getElementById('modal')

nt.addEventListener('click', () =>{
    m.classList.add('active');
})
cancel.addEventListener('click', () => {
    m.classList.remove('active')
})

// array de objetos das minhas transações
let Modal = {
    toggle() {
        m.classList.remove('active')
    }
}
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances: transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances: transactions",JSON.stringify(transactions))
    }
}
const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction);
        app.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);
        app.reload();
    },
    incomes() {
        let income = 0;
        //Somar as entradas
        Transaction.all.forEach(transaction => {
            if(Number(transaction.amount) > 0) {
                income += transaction.amount
            }
        })
        return income;
    },
    expenses() {
        // Somar as saidas
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if(Number(transaction.amount) < 0) {
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
        tr.dataset.index = index
        DOM.transactionContainer.appendChild(tr); // Depois dos nos criados adiciono no meu Tbody
    },
    innerHtmlTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}"> ${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt=""></td>

        `
        return html;
    },
    updateBalance() {
        document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
    },
    clearTransactions() {
        DOM.transactionContainer.innerHTML = ""
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
    },

    formatAmount(value) {
        value = Number(value) * 100;
        return value;
        
    },

    formatDate(value) {
        const splittedDate = value.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),
    validateFileds() {
        const {description, amount, date} = Form.getValues();
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor preencha os campos");
        }
    },
    getValues() {
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },

    save(transaction){
        Transaction.add(transaction);
    },
    clearFields() {
        this.description.value = ""
        this.amount.value = ""
        this.date.value = ""
    },

    formatData() {
        let {description, amount, date} = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }
    },

    submit(event) {
        try {
            this.validateFileds();

            const transaction = this.formatData();

            this.save(transaction);

            this.clearFields();

            Modal.toggle();

        } catch (error) {
            alert(error.message);
        }
        event.preventDefault();
    }
}




//DOM.addTransaction(transactions[0]);
//DOM.addTransaction(transactions[1]);
//DOM.addTransaction(transactions[2]);

const app = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance();

        Storage.set(Transaction.all)

        
    },
    reload() {
        DOM.clearTransactions();
        app.init();
    }
}
app.init();
