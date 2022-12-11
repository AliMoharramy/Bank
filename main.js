"use strict";

const account1 = {
  owner: "ali moharrami",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-10-29T17:01:17.194Z",
    "2022-11-01T23:36:17.929Z",
    "2022-11-03T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "amirhosain hasanpour",
  movements: [5000, 3400, -150, -790, 3210, -1000, 8500, -30],
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

// Events
const userInput = document.querySelector(".login__input--user");
const pinInput = document.querySelector(".login__input--PIN");
const loginBtn = document.querySelector(".login__btn");
const mainBody = document.querySelector(".app");
const welcome = document.querySelector(".welcome");
const balanceNm = document.querySelector(".balance__number");
const movmentsContainer = document.querySelector(".movment");
const summaryIn = document.querySelector(".summary_value--in");
const summaryOut = document.querySelector(".summary_value--out");
const transferUserTo = document.querySelector(".transfer_user");
const transferAmount = document.querySelector(".transfer_amount");
const transferBtn = document.querySelector(".form--btn-transfer");
const loanAmount = document.querySelector(".loan_amount");
const loanBtn = document.querySelector(".form--btn-loan");
const closeUser = document.querySelector(".close_user");
const closePin = document.querySelector(".close_PIN");
const closeBtn = document.querySelector(".form--btn-close");
const summryValue = document.querySelector(".summary_value--interest");
const logoutTimer = document.querySelector(".logout-timer");
const dateShow = document.querySelector(".date");

// Create UserName
accounts.forEach(function (acc) {
  acc.username = acc.owner
    .split(" ")
    .map((mov) => mov[0])
    .join("")
    .toUpperCase();
});
// Update UI
const updateUI = () => {
  // Display balance
  displayBalance(currentAccount);

  //display movments
  displayMovments(currentAccount);

  // Display summary
  displaySummary(currentAccount);
};
// Display balance
const displayBalance = function (acc) {
  balanceNm.innerText = `${acc.movements
    .reduce((item, acc) => item + acc)
    .toFixed(2)}€`;
};

// Display movments
const displayMovments = function (acc) {
  const movmentsInOne = acc.movements.map((mov, index) => {
    // withdrawl or deposit
    const withDep = function () {
      if (mov > 0) return "deposit";
      else return "withdrawl";
    };
    // add movment
    return `<div class="movment__row">
        <div class="movment_dateData">
          <div class="movment--type movment--type--${withDep()}">${
      index + 1
    } ${withDep()}</div>
          <div class="movment--date">${timeExchange(
            account2.movementsDates[index]
          )}</div>
        </div>
        <div class="movment--value">${mov}€</div>
      </div>`;
  });
  movmentsContainer.innerHTML = movmentsInOne.reverse().join("");
};

// Display summary
const displaySummary = function (acc) {
  let depositSummary = 0;
  let whitdrawlSummary = 0;
  acc.movements.forEach((mov) => {
    if (mov > 0) depositSummary += mov;
    else whitdrawlSummary += mov;
  });
  summaryOut.innerText = `${Math.abs(whitdrawlSummary).toFixed(2)}€`;
  summaryIn.innerText = `${depositSummary}€`;
};

//login  check
let currentAccount;
loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    accounts.find((acc) => acc.username === userInput.value.toUpperCase())
      .pin === +pinInput.value
  ) {
    // Dispaly UI and welcome message
    mainBody.style.opacity = 100;
    currentAccount = accounts.find(
      (acc) => acc.username === userInput.value.toUpperCase()
    );
    welcome.innerText = `Welcome back, ${currentAccount.owner}`;
    timerEnd();

    // Clear inputs
    userInput.value = "";
    pinInput.value = "";

    updateUI();
  }
});

// Transfer money
transferBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const findedAcount = accounts.find(
    (acc) => acc.username === transferUserTo.value.toUpperCase()
  );
  if (
    findedAcount &&
    transferUserTo.value.toUpperCase() != currentAccount.username &&
    transferAmount.value <= +balanceNm.innerHTML.slice(0, -1)
  ) {
    currentAccount.movements.push(-transferAmount.value);
    findedAcount.movements.push(+transferAmount.value);
    transferAmount.value = "";
    transferUserTo.value = "";
  }
  updateUI();
});

// Loan request
loanBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (loanAmount.value / 10 <= Math.max(...currentAccount.movements)) {
    currentAccount.movements.push(+loanAmount.value);
    loanAmount.value = "";
  }
  updateUI();
});
// Close account

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    closeUser.value.toUpperCase() === currentAccount.username &&
    +closePin.value === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex((mov) => mov === currentAccount),
      1
    );
    closeUser.value = "";
    closePin.value = "";
    mainBody.style.opacity = 0;
  }
});

let baseTimerTime = 300;

const timerEnd = function () {
  baseTimerTime = 300;
  const intervalId = setInterval(function () {
    if (baseTimerTime === 0) {
      clearInterval(intervalId);
      mainBody.style.opacity = 0;
    }
    let secPart = String(baseTimerTime % 60).padStart(2, 0);
    let min = String(Math.trunc(baseTimerTime / 60)).padStart(2, 0);
    if (min < 1) min.padStart(3, 0);
    baseTimerTime--;
    logoutTimer.innerHTML = `You will be logged out in ${min}:${secPart}`;
  }, 1000);
};
//date
const date = {
  sec: String(new Date().getSeconds()).padStart(2, 0),
  min: String(new Date().getMinutes()).padStart(2, 0),
  hour: String(new Date().getHours()).padStart(2, 0),
  year: new Date().getFullYear(),
  month: String(new Date().getMonth() + 1).padStart(2, 0),
  day: String(new Date().getDate()).padStart(2, 0),
};
dateShow.innerText = `${date.month}/${date.day}/${date.year}`;
// time exchange
const timeExchange = function (time) {
  const year = new Date(time).getFullYear();
  const month = String(new Date(time).getMonth() + 1).padStart(2, 0);
  const day = String(new Date(time).getDate()).padStart(2, 0);
  return `${month}/${day}/${year}`;
};
timeExchange(account2.movementsDates[0]);
