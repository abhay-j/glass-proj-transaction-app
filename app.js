"use strict";
// Data
const account1 = {
  owner: "John Doe",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Mark Doyl",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Miller",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Conners",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
//////////////////////////////////////////////////////////
//selecting elements
//constainors
const mainApp = document.querySelector(".main");
const containerMovements = document.querySelector(".movements");
//buttons
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");

//inputs
const userId = document.querySelector(".login__input--user");
const userPin = document.querySelector(".login__input--pin");
const transferTo = document.querySelector(".form__input--to");
const transferAmount = document.querySelector(".form__input--amount");
const loanAmount = document.querySelector(".form__input--loan-amount");
const closeAccUser = document.querySelector(".form__input--user");
const closeAccPin = document.querySelector(".form__input--pin");
//lables
const welcomeMsg = document.querySelector(".welcome");
const summaryIn = document.querySelector(".summary__value--in");
const summaryOut = document.querySelector(".summary__value--out");
const SummaryInetrest = document.querySelector(".summary__value--interest");
const labelBalance = document.querySelector(".balance__value");
/////////////////////////////////////////////////////////
let currentAccount;

const displayMovements = function (acc) {
  userPin.blur();
  containerMovements.innerHTML = "";
  acc.movements.forEach(function (mov, i) {
    console.log(i + 1, mov);
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} deposit
      </div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplaySummary = function (acc) {
  //calculate and display summary
  const incoming = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  summaryIn.textContent = `${incoming}€`;

  const outgoing = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  summaryOut.textContent = `${Math.abs(outgoing)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  SummaryInetrest.textContent = `${interest}€`;
};
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${Math.abs(acc.balance)}€`;
};

const updateUI = function (acc) {
  // display movements
  displayMovements(acc);
  //calculate and display summary
  calcDisplaySummary(acc);

  //calculate and display balance
  calcDisplayBalance(acc);
};
//lets get this party on the road
//first loop through accounts array and create a new property on each account called username
//this username should be something like this 'John Doe' => 'jd';
accounts.forEach(function (acc) {
  let fullname = acc.owner.toLowerCase().split(" ");
  acc.username = fullname[0].slice(0, 1) + fullname[1].slice(0, 1);
  //   console.log(acc);
});

//login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  //check if the credentials are correct
  console.log("event triggered");

  currentAccount = accounts.find((acc) => acc.username === userId.value);
  console.log(currentAccount);

  if (
    currentAccount &&
    currentAccount?.username === userId.value &&
    currentAccount?.pin === Number(userPin.value)
  ) {
    console.log("LOGGED IN");
    //display ui
    mainApp.style.opacity = 100;
    welcomeMsg.textContent = `Welcome back , ${
      currentAccount.owner.split(" ")[0]
    }`;
    userId.value = userPin.value = "";

    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(transferAmount.value);
  const receiverAcc = accounts.find((acc) => acc.username === transferTo.value);
  console.log(receiverAcc, amount);

  transferTo.value = transferAmount.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log(currentAccount.movements, receiverAcc.movements);
    updateUI(currentAccount);
  }
});
//loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(loanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * amount)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    loanAmount.value = "";
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === closeAccUser.value &&
    currentAccount.pin === Number(closeAccPin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);
    //hide ui
    mainApp.style.opacity = 0;

    closeAccUser.value = closeAccPin.value = "";
  }
});
