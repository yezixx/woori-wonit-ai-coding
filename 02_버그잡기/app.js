const ACCOUNTS = [
  { accountId: 1, accountNo: "1002-345-678901", accountType: "입출금", balance: 1523000, status: "정상", ownerName: "김연지" },
  { accountId: 2, accountNo: "1002-345-112233", accountType: "적금", balance: 1200000, status: "정상", ownerName: "김연지" },
  { accountId: 3, accountNo: "1002-345-998877", accountType: "청약", balance: 397000, status: "휴면", ownerName: "김연지" },
];

const TRANSACTIONS = [
  { txId: 10, txType: "출금", amount: 45000, category: "쇼핑", memo: "온라인쇼핑몰 결제", counterparty: "쿠팡", txDatetime: "2026-08-25T18:42:00" },
  { txId: 9, txType: "출금", amount: 12000, category: "식비", memo: "점심 식사", counterparty: "김밥천국", txDatetime: "2026-08-25T12:15:00" },
  { txId: 8, txType: "입금", amount: 3200000, category: "급여", memo: "8월 급여", counterparty: "(주)원아이티", txDatetime: "2026-08-25T09:00:00" },
  { txId: 7, txType: "출금", amount: 55000, category: "통신", memo: "휴대폰 요금", counterparty: "SK텔레콤", txDatetime: "2026-08-24T10:20:00" },
  { txId: 6, txType: "출금", amount: 1800, category: "교통", memo: "버스 이용", counterparty: "서울교통공사", txDatetime: "2026-08-23T08:05:00" },
  { txId: 5, txType: "출금", amount: 89000, category: "의료", memo: "치과 진료비", counterparty: "미소치과", txDatetime: "2026-08-22T15:30:00" },
  { txId: 4, txType: "출금", amount: 320000, category: "이체", memo: "월세 이체", counterparty: "박집주인", txDatetime: "2026-08-21T09:10:00" },
  { txId: 3, txType: "출금", amount: 68000, category: "쇼핑", memo: "생필품 구매", counterparty: "이마트", txDatetime: "2026-08-20T19:45:00" },
  { txId: 2, txType: "입금", amount: 150000, category: "이체", memo: "용돈 받음", counterparty: "김엄마", txDatetime: "2026-08-19T11:00:00" },
  { txId: 1, txType: "출금", amount: 4500, category: "식비", memo: "카페", counterparty: "스타벅스", txDatetime: "2026-08-18T08:30:00" },
];

// ---------- 유틸 함수 ----------

function formatCurrency(amount) {
  return amount.toLocaleString("ko-KR") + "원";
}

function maskAccountNo(accountNo) {
  const parts = accountNo.split("-");
  const last = parts[2];
  return parts[0] + "-" + parts[1] + "-" + last.slice(0, 1) + "****" + last.slice(-1);
}

function sumWithdrawalsByCategory(transactions) {
  return transactions.reduce((sums, tx) => {
    if (tx.txType === "출금") {
      sums[tx.category] = (sums[tx.category] || 0) + tx.amount;
    }
    return sums;
  }, {});
}

function filterByType(transactions, type) {
  return type === "전체" ? transactions : transactions.filter((tx) => tx.txType === type);
}

// ---------- 화면 렌더링 ----------

function renderAccountList() {
  const html = "<h2>전체 계좌</h2>" + ACCOUNTS.map((acc) => `
    <div class="row">
      <b>${acc.ownerName}</b> · ${acc.accountType} · ${maskAccountNo(acc.accountNo)}<br>
      ${formatCurrency(acc.balance)}
      <span class="${acc.status === "정상" ? "ok" : "bad"}">${acc.status}</span>
    </div>
  `).join("");
  document.querySelector("#accountList").innerHTML = html;
}

function renderCategorySummary() {
  const sums = sumWithdrawalsByCategory(TRANSACTIONS);
  const html = "<h2>카테고리별 출금 합계</h2>" + Object.keys(sums).map((category) => `
    <div class="row">${category} : ${formatCurrency(sums[category])}</div>
  `).join("");
  document.querySelector("#categorySummary").innerHTML = html;
}

function renderTransactionList() {
  const transactions = filterByType(TRANSACTIONS, "전체");
  const html = "<h2>전체 거래내역</h2>" + transactions.map((tx) => `
    <div class="row">
      ${tx.txDatetime.slice(0, 10)} · ${tx.memo}<br>
      <span class="${tx.txType === "입금" ? "ok" : "bad"}">${tx.txType === "입금" ? "+" : "-"}${formatCurrency(tx.amount)}</span>
    </div>
  `).join("");
  document.querySelector("#transactionList").innerHTML = html;
}

function renderBalance() {
  // 문제: HTML의 balance를 JavaScript에서 blance로 잘못 찾아 잔액이 표시되지 않음.
  // 수정: HTML의 id와 같은 balance를 사용하고, 잔액 변경 후 이 함수를 다시 호출함.
  const balanceEl = document.getElementById("balance");
  balanceEl.textContent = formatCurrency(ACCOUNTS[0].balance);
}

// ---------- 입금 ----------

function handleDeposit() {
  // 문제: 입금 후 데이터만 바뀌고 화면 잔액은 다시 그리지 않음.
  // 수정: 잔액을 변경한 직후 renderBalance()를 호출해 화면을 갱신함.
  ACCOUNTS[0].balance += 10000;
  renderBalance();
  alert("10,000원이 입금되었습니다.");
}

// ---------- 이자 계산 ----------

function calcInterest(balance, rate) {
  return balance * rate;
}

const interestBtn = document.querySelector("#interestBtn");
interestBtn.addEventListener("click", () => {
  // 문제: 부동소수점 계산 결과가 긴 소수로 표시됨.
  // 수정: 이자를 Math.round()로 반올림해 금액을 정수로 표시하고 잔액에도 반영함.
  const rate = 0.0175; // 우대금리 연 1.75%
  const interest = Math.round(calcInterest(ACCOUNTS[0].balance, rate));
  ACCOUNTS[0].balance += interest;
  document.querySelector("#interestResult").textContent =
    "이자 " + formatCurrency(interest) + " 적용 → 잔액 " + formatCurrency(ACCOUNTS[0].balance);
});

// ---------- 환율 ----------

async function fetchExchangeRate() {
  return new Promise((resolve) => setTimeout(() => resolve(1384), 500));
}

// ---------- 환율 렌더링 ----------
async function renderExchangeRate() {
  // 문제: Promise 자체를 화면에 출력해 환율 대신 객체 텍스트가 표시됨.
  // 수정: await로 실제 환율 값을 받은 뒤 화면에 출력함.
  const rate = await fetchExchangeRate();
  document.querySelector("#exchangeRate").textContent = rate + "원";
}

renderExchangeRate();

// ---------- 이체 확인 모달 ----------

const transferBtn = document.querySelector("#transferBtn");
const modalOverlay = document.querySelector("#modalOverlay");
const closeModalBtn = document.querySelector("#closeModalBtn");
const confirmTransferBtn = document.querySelector("#confirmTransferBtn");

transferBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

confirmTransferBtn.addEventListener("click", () => {
  // 문제: 기존 이체 확인은 모달을 닫고 알림만 보여 잔액과 거래내역이 바뀌지 않음.
  // 수정: 잔액 차감과 거래 추가 후 관련 화면을 모두 다시 렌더링함.
  const transferAmount = 320000;

  ACCOUNTS[0].balance -= transferAmount;

  TRANSACTIONS.unshift({
    txId: TRANSACTIONS.length + 1,
    txType: "출금",
    amount: transferAmount,
    category: "이체",
    memo: "월세 이체",
    counterparty: "박집주인",
    txDatetime: new Date().toISOString(),
  });

  renderBalance();
  renderAccountList();
  renderTransactionList();
  renderCategorySummary();

  modalOverlay.classList.add("hidden");
  alert("이체가 완료되었습니다.");
});

// ---------- 초기 렌더링 ----------

renderAccountList();
renderCategorySummary();
renderTransactionList();

const depositBtn = document.querySelector("#depositBtn");
// 함수 실행이 아닌 함수 자체 전달: handleDeposit -> handleDeposit()
depositBtn.addEventListener("click", handleDeposit);

renderBalance();
