const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');


// Buttons
const submit = document.getElementById('submit') ;
const add = document.getElementById('add')
const edit = document.getElementById('edit')
let itemToUpdate = ''

// const edit = document.getElementById('edit');


// const dummyTransaction = [
//     {id: 1, text: 'Flower', amount: -20},
//     {id: 2, text: 'Salary', amount: 300},
//     {id: 3, text: 'Book', amount: -10},
//     {id: 4, text: 'Camera', amount: 150}

// ];
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions:[]
// let transactions = dummyTransaction;

// Add Transaction
function addTransaction(e) { 

  if(text.value.trim() === '' || amount.value.trim() === '') {
        // alert('Please add a text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value   
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();  

        updateLocalStorage();

        text.value = '';
        text.amount = '';
    }    
}

// Generate IDs
function generateID() {
    return Math.floor(Math.random() * 100000000)
} 


// Add Transaction to the DOM li
function addTransactionDOM(transaction) {
   // Get sign 
   const sign = transaction.amount < 0 ? '-' : '+'

   const item = document.createElement('li');

   // Add class based on value
   item.classList.add(transaction.amount < 0 ? 'minus' : 'plus')

   item.innerHTML = `
     ${transaction.text}  
     <span>${sign}${Math.abs(transaction.amount)}</span>
     <i class="fas fa-pen" id="pen"></i>
     <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
   `; 

   list.appendChild(item);  
}

// Update the balance,income and expense
function updateValues() {
    // Get balance 
    const amounts = transactions.map(transaction => transaction.amount)

    const total = amounts.reduce((acc,item) => (acc += item), 0).toFixed(2)
  
 
    const income = amounts
     .filter(item => item > 0)
     .reduce((acc, item) => (acc += item), 0).toFixed(2)

    const expense = (amounts
     .filter(item => item < 0)
     .reduce((acc,item) => (acc += item), 0) * -1).toFixed(2) 

    balance.innerText = `$${total}`
    money_plus.innerText = `$${income}`
    money_minus.innerText = `$${(expense)}`
}

function getUpdateItemIndex(e) {
    if(e.target.classList.contains('fa-pen')){
     const itemValue = e.target.parentElement.firstElementChild.innerText;
     // extract all the text in the li, returned array looks like ['steak','+7','x']
     const itemText = e.target.parentElement.innerText.split('\n')[0] // extract the first element
     amount.value = +itemValue;
     text.value = itemText
   
     // Item to update
     itemToUpdate = itemText;
    //  console.log(item);
     add.style.display = "none";
     edit.style.opacity = "1";

    }
}

function editExp () {
    const newItemText = text.value.trim()
    const newItemAmount = amount.value.trim()
    console.log(newItemText)
    // fetch the item from the transactions array using the name(itemToUpdate)
    const newItemOriginalInfo = transactions.find(item => item.text === itemToUpdate)
    // get the index of the data from the transactions array
    const index = transactions.indexOf(newItemOriginalInfo);
    console.log(index)
    // get the full info about the item to update from transactions array
    if(newItemText && newItemOriginalInfo) {
        // object the item object info with the new details
        newItemOriginalInfo.text = newItemText
        newItemOriginalInfo.amount = newItemAmount
        // update the transaction array
        transactions.splice(index, 1, newItemOriginalInfo)
        // update the local storage 
        updateLocalStorage()
        // re render the ui
        init()
      
   
    //   addTransactionDOM()
    
    }
}



function removeTransaction (id) {
    transactions = transactions.filter(transaction => transaction.id !== id)

    updateLocalStorage();

    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions',JSON.stringify(transactions))
}

// Init app
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM)
        updateValues();
        addTransaction();
       
}

init();

form.addEventListener('submit',addTransaction);
list.addEventListener('click',getUpdateItemIndex);
edit.addEventListener('click',editExp);

