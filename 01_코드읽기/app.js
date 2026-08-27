const d = [
	{
		accountId: 1,
		accountNo: "1002-345-678901",
		accountType: "입출금",
		balance: 1523000,
		status: "정상",
		ownerName: "김연지"
	},
	{
		accountId: 2,
		accountNo: "1002-345-112233",
		accountType: "적금",
		balance: 1200000,
		status: "정상",
		ownerName: "김연지"
	},
	{
		accountId: 3,
		accountNo: "1002-345-998877",
		accountType: "청약",
		balance: 397000,
		status: "휴면",
		ownerName: "김연지"
	}
];

const arr2 = [
	{
		txId: 10,
		txType: "출금",
		amount: 45000,
		category: "쇼핑",
		memo: "온라인쇼핑몰 결제",
		counterparty: "쿠팡",
		txDatetime: "2026-08-25T18:42:00"
	},
	{
		txId: 9,
		txType: "출금",
		amount: 12000,
		category: "식비",
		memo: "점심 식사",
		counterparty: "김밥천국",
		txDatetime: "2026-08-25T12:15:00"
	},
	{
		txId: 8,
		txType: "입금",
		amount: 3200000,
		category: "급여",
		memo: "8월 급여",
		counterparty: "(주)원아이티",
		txDatetime: "2026-08-25T09:00:00"
	},
	{
		txId: 7,
		txType: "출금",
		amount: 55000,
		category: "통신",
		memo: "휴대폰 요금",
		counterparty: "SK텔레콤",
		txDatetime: "2026-08-24T10:20:00"
	},
	{
		txId: 6,
		txType: "출금",
		amount: 1800,
		category: "교통",
		memo: "버스 이용",
		counterparty: "서울교통공사",
		txDatetime: "2026-08-23T08:05:00"
	},
	{
		txId: 5,
		txType: "출금",
		amount: 89000,
		category: "의료",
		memo: "치과 진료비",
		counterparty: "미소치과",
		txDatetime: "2026-08-22T15:30:00"
	},
	{
		txId: 4,
		txType: "출금",
		amount: 320000,
		category: "이체",
		memo: "월세 이체",
		counterparty: "박집주인",
		txDatetime: "2026-08-21T09:10:00"
	},
	{
		txId: 3,
		txType: "출금",
		amount: 68000,
		category: "쇼핑",
		memo: "생필품 구매",
		counterparty: "이마트",
		txDatetime: "2026-08-20T19:45:00"
	},
	{
		txId: 2,
		txType: "입금",
		amount: 150000,
		category: "이체",
		memo: "용돈 받음",
		counterparty: "김엄마",
		txDatetime: "2026-08-19T11:00:00"
	},
	{
		txId: 1,
		txType: "출금",
		amount: 4500,
		category: "식비",
		memo: "카페",
		counterparty: "스타벅스",
		txDatetime: "2026-08-18T08:30:00"
	}
];

function f1(n){return n.toLocaleString("ko-KR")+"원";}

function f2(s){const a=s.split("-");return a[0]+"-"+a[1]+"-"+a[2].slice(0,1)+"****"+a[2].slice(-1);}

// 거래내역에서 출금만 골라 카테고리별 금액 합계를 계산합니다.
function f3(arr){return arr.reduce((x,y)=>{if(y.txType==="출금"){x[y.category]=(x[y.category]||0)+y.amount;}return x;},{});}

function f4(arr,t){return t==="전체"?arr:arr.filter(x=>x.txType===t);}

const q=s=>document.querySelector(s);

q("#acc").innerHTML="<h2>계좌 목록</h2>"+d.map(x=>`<div class="row"><b>${x.ownerName}</b> · ${x.accountType} · ${f2(x.accountNo)}<br>${f1(x.balance)} <span class="${x.status==="정상"?"ok":"bad"}">${x.status}</span></div>`).join("");

const b=f3(arr2);
q("#cat").innerHTML="<h2>카테고리별 출금 합계</h2>"+Object.keys(b).map(k=>`<div class="row">${k} : ${f1(b[k])}</div>`).join("");

const tmp=f4(arr2,"전체");
q("#tx").innerHTML="<h2>전체 거래내역</h2>"+tmp.map(x=>`<div class="row">${x.txDatetime.slice(0,10)} · ${x.memo}<br><span class="${x.txType==="입금"?"ok":"bad"}">${x.txType==="입금"?"+":"-"}${f1(x.amount)}</span></div>`).join("");
