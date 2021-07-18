//preloader
let preloader = document.querySelector('.preloader');
setTimeout(()=>{
	preloader.classList.add('preloader--close');
	setTimeout(()=>{
		preloader.style.display = 'none';
	}, 500)
}, 2000)


window.addEventListener(
  "scroll",
  () => {
    let header = document.querySelector(".header");
    header.classList.toggle("header--sticky", window.scrollY > 0);
  },
  { passive: true }
);

let burgerBtn = document.querySelector(".burger"),
  menu = document.querySelector(".menu"),
  menuItems = document.querySelectorAll(".menu__item");

burgerBtn.addEventListener("click", () => {
  if (!burgerBtn.classList.contains("burger--active")) {
    openMenu();
  } else {
    closeMenu();
  }
});

function openMenu() {
  burgerBtn.classList.add("burger--active");
  menu.classList.add("menu--active");
}
function closeMenu() {
  burgerBtn.classList.remove("burger--active");
  menu.classList.remove("menu--active");
}

menuItems.forEach((el) => {
  el.addEventListener("click", closeMenu);
});

//license
let licenseBtn = document.querySelector(".license__show-more-btn"),
  licenseBtnTxt = licenseBtn.querySelector("span"),
  licenseImgBox = document.querySelector(".license__show-more-box");

licenseBtn.addEventListener("click", () => {
  if (!licenseBtn.classList.contains("license__show-more-btn--active")) {
    openLicense();
  } else {
    closeLicense();
  }
});

function openLicense() {
  licenseImgBox.classList.add("license__show-more-box--active");
  licenseBtn.classList.add("license__show-more-btn--active");
  licenseBtnTxt.textContent = "Свернуть";
  licenseImgBox.style = "max-height: " + licenseImgBox.scrollHeight + "px";
}

function closeLicense() {
  licenseImgBox.classList.remove("license__show-more-box--active");
  licenseBtn.classList.remove("license__show-more-btn--active");
  licenseBtnTxt.textContent = "Развернуть";
  licenseImgBox.style = "";
}

//video
let playBtn = document.querySelector(".main-screen__video-button"),
  video = document.querySelector(".main-screen__video");

playBtn.addEventListener("click", () => {
  playBtn.style.display = "none";
  video.play();
  video.disablePictureInPicture = true;
  video.setAttribute("controls", "controls");
});

//exchange rate
// +$0.textContent.trim().replace(',', '.')
let exchangeForm = document.querySelector(".exchange-form"),
  inputSell = exchangeForm.inputsell,
  selectSell = exchangeForm.selectsell,
  optionsSell = selectSell.querySelectorAll("option"),
  inputBuy = exchangeForm.inputbuy,
  selectBuy = exchangeForm.selectbuy,
  usdSellPrice = +document.querySelector(".exchange-rate-usd-sell").textContent.trim().replace(",", "."),
  usdBuyPrice = +document.querySelector(".exchange-rate-usd-buy").textContent.trim().replace(",", "."),
  eurSellPrice = +document.querySelector(".exchange-rate-eur-sell").textContent.trim().replace(",", "."),
  eurBuyPrice = +document.querySelector(".exchange-rate-eur-buy").textContent.trim().replace(",", ".");

function renderExchangeBuyOptions() {
  selectBuy.innerHTML = "";
  for (let i = 0; i < optionsSell.length; ++i) {
    if (selectSell.value !== optionsSell[i].value) {
      let tempOption = document.createElement("option");
      tempOption.value = optionsSell[i].value;
      tempOption.textContent = optionsSell[i].value.toUpperCase();
      selectBuy.appendChild(tempOption);
    }
  }
}
renderExchangeBuyOptions();

let exchangeData = {
  eur: {
    sell: eurSellPrice,
    buy: eurBuyPrice,
  },
  usd: {
    sell: usdSellPrice,
    buy: usdBuyPrice,
  },
};

function calculateExchangeSell() {
  let currentSellValue = selectSell.value;
  let currentSellInputValue = inputSell.value;
  let currentBuyValue = selectBuy.value;
  let currentBuyInputValue = inputBuy.value;

  if (currentSellInputValue === "") {
    inputBuy.value = "";
    return;
  }
  if (currentSellValue === "rub") {
    let currentBuyPrice = exchangeData[currentBuyValue].buy;
    inputBuy.value = (+currentSellInputValue / currentBuyPrice).toFixed(2);
  } else if (currentBuyValue === 'rub'){
		 let currentSellPrice = exchangeData[currentSellValue].sell;
		 inputBuy.value = (+currentSellInputValue * currentSellPrice).toFixed(2);
	} else {
		let toRub = +currentSellInputValue * exchangeData[currentSellValue].sell;
		let toAnother = toRub / exchangeData[currentBuyValue].buy;
		inputBuy.value = toAnother.toFixed(2);
	}
}
function calculateExchangeBuy() {
  let currentSellValue = selectSell.value;
  let currentSellInputValue = inputSell.value;
  let currentBuyValue = selectBuy.value;
  let currentBuyInputValue = inputBuy.value;

  if (currentBuyInputValue === "") {
    inputSell.value = "";
    return;
  }

  if (currentSellValue === "rub") {
    let currentBuyPrice = exchangeData[currentBuyValue].buy;
    inputSell.value = (+currentBuyInputValue * currentBuyPrice).toFixed(2);
  } else if (currentBuyValue === "rub") {
    let currentBuyPrice = exchangeData[currentSellValue].sell;
    inputSell.value = (+currentBuyInputValue / currentBuyPrice).toFixed(2);
  } else {
		let toRub = +currentBuyInputValue * exchangeData[currentBuyValue].buy;
    let toAnother = toRub / exchangeData[currentSellValue].sell;
    inputSell.value = toAnother.toFixed(2);
	}
}
function exchangeHandler() {
  renderExchangeBuyOptions();
  calculateExchangeSell();
}

selectSell.addEventListener("change", exchangeHandler);
selectBuy.addEventListener("change", calculateExchangeSell);
inputSell.addEventListener("input", calculateExchangeSell);
inputBuy.addEventListener("input", calculateExchangeBuy);

//custom range
let ranges = document.querySelectorAll('.custom-range');

function rangeHandler(inputRange){
	let input = inputRange.querySelector(".custom-range__input");
  let btn = inputRange.querySelector(".custom-range__btn");
  let progress = inputRange.querySelector(".custom-range__progress-bar");
  let min = input.getAttribute("min");
  let max = input.getAttribute("max");
  let step = input.getAttribute("step");
  let vars = Number(max) - Number(min);
  let stepPerc = 100 / (vars / Number(step));

	const value = (Number(input.value) - min) / step;
  const valuePerc = value * stepPerc;
  btn.style.left = valuePerc + "%";
  progress.style.maxWidth = valuePerc + "%";

  input.addEventListener("input", () => {
    const value = (Number(input.value) - min) / step;
    const valuePerc = value * stepPerc;
    btn.style.left = valuePerc + "%";
    progress.style.maxWidth = valuePerc + "%";
  });
}


for (let i = 0; i < ranges.length; ++i){
	rangeHandler(ranges[i]);
}

//Калькулятор

//Формула расчета суммы инвестирования
function invFormula(money, months, coefficient){
	return Math.round((money / months) * coefficient);
}

//Функция для превращения чисел в читаемый формат. Пример 4000 -> 4 000
function formatNum(number){
	number = Number(number);
	return number.toLocaleString("ru");
}

//Функция для превращения месяцев в формат год месяц
function formatMonths(months){

	const years = Math.floor(months / 12);
	months -= (years * 12);

	const yearsLetters = {
		'1': 'год', 
		'2': 'года', 
		'3': 'года', 
		'4': 'года', 
		'5': 'лет', 
		'6': 'лет', 
		'7': 'лет', 
		'8': 'лет', 
		'9': 'лет', 
		'0': 'лет', 
	}
	if (years !== 0 && months !== 0) return String(years) + " " + yearsLetters[years] + " " + String(months) + " " + "мес";
	if (years === 0) return String(months) + " " + "мес";
	if (months === 0) return String(years) + " " + yearsLetters[years];

	return 0
}

//Продукты
let products = {

	//Спотовый счет
  spot: {
    from: 4000,

    //Коефициент умножения в формуле
    perc: 3.75,
  },

	//Фьючерсы
  fu: {
    from: 7000,

    //Коефициент умножения в формуле
    perc: 2.15,
  },
};

let calcForm = document.querySelector(".calc-form");
let chooseProduct = calcForm.chooseproduct;
let investmentRange = calcForm.inv;
let investmentValueBlock = calcForm.querySelector(".calc-form__investment-value");
let investmentFromBlock = calcForm.querySelector(".calc-form__inv-from");
let periodRange = calcForm.yrs;
let periodValueBlock = calcForm.querySelector(".calc-form__period-value");
let resultBlock = calcForm.querySelector(".calc-form__result-value");


//Обработчик калькулятора
function calcFormHandler(){

	const investmentValue = investmentRange.value;
	const periodValue = periodRange.value;
	const coef = products[chooseProduct.value].perc;

	investmentValueBlock.textContent = formatNum(investmentValue);
	periodValueBlock.textContent = formatMonths(periodValue);

	resultBlock.textContent = formatNum(invFormula(investmentValue, periodValue, coef)) + ' $';
}
calcFormHandler();

function chooseProductHandler(){

	investmentFromBlock.textContent = 'от ' + formatNum(products[chooseProduct.value].from) + ' $';
	investmentRange.min = products[chooseProduct.value].from;
	investmentRange.value = products[chooseProduct.value].from;

	rangeHandler(investmentRange.parentElement);
	calcFormHandler();
}


investmentRange.addEventListener("input", calcFormHandler);
periodRange.addEventListener("input", calcFormHandler);

chooseProduct.forEach(el => {
	el.addEventListener("change", chooseProductHandler);
})
