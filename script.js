"use strict";

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Vasyl Kazmenko",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//logic

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  //need slice not to mutate original array and use slice for extra chaining
  const movs =
    sort === 1
      ? movements.slice().sort((a, b) => a - b)
      : sort === 2
      ? movements.slice().sort((a, b) => b - a)
      : movements;

  movs.forEach(function (movement, index) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    index++;
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index}  </div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${movement}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const dispayBalance = function (account) {
  //mutating the account object here and adding additional parameter
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `$${account.balance} USD`;
};

const displaySummary = function (account) {
  const deposits = account.movements
    .filter((e) => e > 0)
    .reduce((acc, curr) => acc + curr, 0);
  const withdrawal = account.movements
    .filter((e) => e < 0)
    .reduce((acc, curr) => acc + curr, 0);

  const interest = account.movements
    .map((e) => (e / 100) * account.interestRate)
    .filter((e) => e > 0)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumIn.textContent = `${deposits}$`;
  labelSumOut.textContent = `${withdrawal}$`;
  labelSumInterest.textContent = `${interest}$`;
};

const updateUI = function (currectAccount) {
  displayMovements(currectAccount.movements);
  dispayBalance(currectAccount);
  displaySummary(currectAccount);
};

// Login functionality
let currectAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currectAccount = accounts.find(
    (acc) => acc.owner === inputLoginUsername.value
  );

  if (currectAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back ${
      currectAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    updateUI(currectAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const transferToAccount = accounts.find(
    (acc) => acc.owner === inputTransferTo.value
  );
  inputTransferAmount.value = "";
  inputTransferTo.value = "";

  //transfer logic
  if (
    amount > 0 &&
    currectAccount.balance >= amount &&
    transferToAccount &&
    transferToAccount?.owner !== currectAccount.owner
  ) {
    currectAccount.balance = currectAccount.balance - amount;
    currectAccount.movements.push(-amount);
    transferToAccount.balance = transferToAccount.balance + amount;
    transferToAccount?.movements.push(amount);
    updateUI(currectAccount);
  } else {
    console.log("invalid");
  }
});

//loan request logic
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    amount >
      currectAccount.movements.some(
        (deposit) => deposit >= (amount / 100) * 10
      ) &&
    currectAccount.movements.every((e) => e !== amount)
  ) {
    currectAccount.movements.push(amount);
    updateUI(currectAccount);
    inputLoanAmount.value = "";
  }
});

//closing/deleting account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currectAccount.owner === inputCloseUsername.value &&
    currectAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.owner === currectAccount.owner
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;

    inputCloseUsername.value = "";
    inputClosePin.value = "";
  }
});

const Sorted = {
  Original: 0,
  Asc: 1,
  Dsc: 2,
};
let currentSorted = Sorted.Original;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  if (currentSorted === Sorted.Original) {
    currentSorted = Sorted.Asc;
    btnSort.innerHTML = "&uparrow; SORT";
  } else if (currentSorted === Sorted.Asc) {
    currentSorted = Sorted.Dsc;
    btnSort.innerHTML = "&downarrow; SORT";
  } else if (currentSorted === Sorted.Dsc) {
    currentSorted = Sorted.Original;
    btnSort.innerHTML = "&harr; SORT";
  }
  displayMovements(currectAccount.movements, currentSorted);
});

const frags = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John", "Leo"] },
  { weight: 18, curFood: 244, owners: ["Joe"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  if (currentSorted === Sorted.Original) {
    currentSorted = Sorted.Asc;
    btnSort.innerHTML = "&uparrow; SORT";
  } else if (currentSorted === Sorted.Asc) {
    currentSorted = Sorted.Dsc;
    btnSort.innerHTML = "&downarrow; SORT";
  } else if (currentSorted === Sorted.Dsc) {
    currentSorted = Sorted.Original;
    btnSort.innerHTML = "&harr; SORT";
  }
  displayMovements(currectAccount.movements, currentSorted);
});

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John", "Leo"] },
  { weight: 18, curFood: 244, owners: ["Joe"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];
