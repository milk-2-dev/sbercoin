(function () {
  var self = window.mainController || {};
  window.mainController = self;

  //  variables
  let $preloader
  let header
  let burgerBtn,
    menu,
    menuItems

  //  initialization
  function onDocumentReady() {
    $preloader = document.querySelector('.preloader');
    self.preloaderHide()

    header = document.querySelector(".header");

    window.addEventListener("scroll", () => {
      toggleHeaderState()
    }, {passive: true});

    burgerBtn = document.querySelector(".burger")
    menu = document.querySelector(".menu")
    menuItems = document.querySelectorAll(".menu__item")

    burgerBtn.addEventListener("click", () => {
      onBurgerBtnClick()
    });

    menuItems.forEach((el) => {
      el.addEventListener("click", burgerMenuHide);
    });

    initPhoneInputs()

    initFormSubmit()

    document.querySelector('.scrollToFormBtn').addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('data-href')).scrollIntoView({
        behavior: 'smooth'
      });

      document.querySelector('#form1 input[name="firstName"]').focus()
    })

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
      } else if (currentBuyValue === 'rub') {
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

    function rangeHandler(inputRange) {
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


    for (let i = 0; i < ranges.length; ++i) {
      rangeHandler(ranges[i]);
    }

    //Калькулятор

    //Формула расчета суммы инвестирования
    function invFormula(money, months, coefficient) {
      return Math.round((money / months) * coefficient);
    }

    //Функция для превращения чисел в читаемый формат. Пример 4000 -> 4 000
    function formatNum(number) {
      number = Number(number);
      return number.toLocaleString("ru");
    }

    //Функция для превращения месяцев в формат год месяц
    function formatMonths(months) {

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
    function calcFormHandler() {

      const investmentValue = investmentRange.value;
      const periodValue = periodRange.value;
      const coef = products[chooseProduct.value].perc;

      investmentValueBlock.textContent = formatNum(investmentValue);
      periodValueBlock.textContent = formatMonths(periodValue);

      resultBlock.textContent = formatNum(invFormula(investmentValue, periodValue, coef)) + ' $';
    }

    calcFormHandler();

    function chooseProductHandler() {

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
  }

  if (document.readyState !== 'loading') {
    onDocumentReady();
  } else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
  }

  //  events


  const onBurgerBtnClick = () => {
    if (!burgerBtn.classList.contains("burger--active")) {
      burgerMenuShow();
    } else {
      burgerMenuHide();
    }
  }

  //  methods
  const initFormSubmit = () => {
    $('.submitBtn').on('click', (event) => {
      event.preventDefault()

      const $formValidateInstance = $(event.target).closest('form').validate({
        rules: {
          firstName: {
            required: true
          },
          email: {
            required: true,
            email: true
          },
          phone: {
            required: true,
            validNumber: {
              object: $(event.target).closest('form').find('input[name="phone"]')[0]
            }
          }
        },
        messages: {
          firstName: {
            required: "Необходимо обязательно заполнить поле ФИО",
            digits: "ФИО не может содержать цифры",
          },
          email: {
            required: "Необходимо обязательно заполнить поле Email",
            email: "Пожалуйста введите валидный Email, например example@domain.com",
          },
          phone: {
            required: "Необходимо обязательно заполнить поле Телефон",
          }
        }
      })

      $formValidateInstance.form()

      if ($formValidateInstance.valid()) {
        mainController.preloaderShow()
      }
    })

    $.validator.addMethod("validNumber", function (value, element, params) {
      var obj = params.object;
      const itiInstance = $(obj).data("itiInputInstance")

      return itiInstance.isValidNumber();
    }, 'Введите правильный номер!');
  }

  const initPhoneInputs = () => {
    const $allTelInputs = $('.form__input[type="tel"]').get();

    $allTelInputs.forEach((item) => {
      const itiInst = window.intlTelInput(item, {
        autoHideDialCode: false,
        autoPlaceholder: "aggressive",
        placeholderNumberType: "MOBILE",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.min.js",
        initialCountry: "auto",
        geoIpLookup: function (success, failure) {
          $.get("https://ipinfo.io/", function () {
          }, "jsonp")
            .always(function (resp) {
              var countryCode = (resp && resp.country) ? resp.country : "ua";
              success(countryCode);
            });

        },
        customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
          if (item.style.display !== "none") {
            createInputClone(item)
          }

          initNewMask(item, selectedCountryPlaceholder)

          return selectedCountryPlaceholder
        }
      })

      $(item).data("itiInputInstance", itiInst)
    })
  }

  const createInputClone = (item) => {
    const $newInput = $(item).clone()

    $(item).after($newInput)

    $newInput.on('keyup', (event) => {
      $(item).val($(event.target).val())
    })

    $(item).attr('id', null)

    $(item).css('visibility', 'hidden')
    $(item).css('display', 'none')

    refreshphoneInput(item)
  }

  const initNewMask = (item, placeholder) => {
    const $nextInput = $(item).next()
    $nextInput.val('');
    $nextInput.attr('placeholder', placeholder)
    $nextInput.mask(placeholder.replace(/[1-9]/g, 0));
  }

  const refreshphoneInput = (item) => {
    const padding = $(item).css('padding-left')
    $(item).next().css('padding-left', padding)
  }

  function burgerMenuShow() {
    burgerBtn.classList.add("burger--active");
    menu.classList.add("menu--active");
  }

  function burgerMenuHide() {
    burgerBtn.classList.remove("burger--active");
    menu.classList.remove("menu--active");
  }

  const toggleHeaderState = () => {
    header.classList.toggle("header--sticky", window.scrollY > 0);
  }

  self.preloaderShow = () => {
    $preloader.classList.remove('preloader--close');
    $preloader.style.display = 'flex';
  }

  self.preloaderHide = () => {
    $preloader.classList.add('preloader--close');
    $preloader.style.display = 'none';
  }
})()


