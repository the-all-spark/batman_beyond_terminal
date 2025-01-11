window.addEventListener("load", showAll);

function showAll() {
    //console.log(window.innerWidth);

    // Скрытие информационного блока при клике на кнопку "ОК"
    let helpBlockBtn = document.querySelector(".help-block button");
    helpBlockBtn.addEventListener("click", function () {
        let helpBlock = document.querySelector(".help-block");
        helpBlock.classList.add("hidden-help-block");
        helpBlock.classList.add("closed-flag");
    });

    let keyboardButtons = Array.from(document.querySelectorAll(".keyboard button"));
    //console.log(keyboardButtons);

    // * Выбор действия при клике на кнопку "клавиатуры", эффект нажатой кнопки
    keyboardButtons.forEach((button) => button.addEventListener("click", function () {
        markBtnAsPushed(this.dataset);
        showHideRightPhoto(this.dataset);
        chooseAction(this.dataset);
    }));

    // * функция выделения кнопки как нажатой
    function markBtnAsPushed(dataAttr) {
        let attr = Object.keys(dataAttr)[0];
        let value = Object.values(dataAttr)[0];
        //console.log(attr);
        //console.log(value);

        let pushedButton = document.querySelector(`.keyboard button[data-${attr}="${value}"]`);

        if (pushedButton !== null) {
            if (pushedButton.classList.contains("pushed-btn")) {
                pushedButton.classList.remove("pushed-btn"); // отжатая кнопка
            } else {
                unmarkBtns();
                pushedButton.classList.add("pushed-btn");
            }
        }
    }

    // функция удаления выделения всех ранее "нажатых" кнопок
    function unmarkBtns() {
        let previousMarkedBtns = document.querySelectorAll(".pushed-btn");

        previousMarkedBtns.forEach((button) => {
            button.classList.remove("pushed-btn");
        });
    }

    // функция скрывает или возвращает фотографию справа в зависимости от значения атрибута и ширины экрана
    function showHideRightPhoto(dataAttr) {
        let photo = document.querySelector(".terry-photo");

        if (Object.keys(dataAttr)[0] === 'part' && window.innerWidth <= 1260) {
            photo.style.display = "none";
        } else {
            photo.style.display = "block";
        }

        // если не нажата ни одна из кнопок на клавиатуре
        let pushedBtns = document.querySelectorAll(".pushed-btn");
        if (pushedBtns.length == 0 )  {
            photo.style.display = "block";
        }
    }

    // функция выбора действия в зависимости от атрибута data
    function chooseAction(dataAttr) {
        //console.log(dataAttr);

        if ("costume" in dataAttr) {
            hideShowHelpBlock();
            showCostumeInfo(dataAttr.costume);
            hidePrevious(dataAttr); // скрыть предыдущие выделения
        } 

        if ("part" in dataAttr) {
            hideShowHelpBlock();
            showCostumePart(dataAttr);
            hidePrevious(dataAttr); // скрыть предыдущие выделения
        } 
        
        if ("param" in dataAttr || "info" in dataAttr) {
            hidePrevious(dataAttr);
            highlightInfoBlock(dataAttr); // выделить блок с информацией
        } 

    }

    // функция скрытия и показа информационного блока в центре экрана
    function hideShowHelpBlock() {
        let helpBlock = document.querySelector(".help-block");

        let btnsForCenterBlock = getBtnsForCenterBlock();
        //console.log(btnsForCenterBlock);
        let markedBtnFlag = isMarked(btnsForCenterBlock);

        // блок скрывается, если кнопка выделена (markedBtnFlag == true); отображается, если нет
        // и если информационный блок не скрыт вообще
        if (markedBtnFlag) {
            helpBlock.classList.add("hidden-help-block");
        } else if (!helpBlock.classList.contains("closed-flag")) {
            helpBlock.classList.remove("hidden-help-block");
        }
    }

    // функция получения массива всех кнопок для отображения информации в центральном блоке (data-costume, data-part)
    function getBtnsForCenterBlock() {
        let costumeBtn = document.querySelectorAll("button[data-costume]");
        let partBtns = document.querySelectorAll("button[data-part]");

        let btnsForCenterBlock = [];

        costumeBtn.forEach( (btn) => btnsForCenterBlock.push(btn) );
        partBtns.forEach( (btn) => btnsForCenterBlock.push(btn) ); 

        return btnsForCenterBlock;
    }

    // функция определения нажата ли какая-то кнопка из центрального блока
    function isMarked(buttons) {
        let markedBtns = buttons.filter( (btn) => btn.classList.contains("pushed-btn") );
        //console.log(markedBtns);

        if (markedBtns.length >= 1) {
            return true;
        } else {
            return false;
        } 
    }

    // * Выделение части костюма рамкой и отображение увеличенного фрагмента при клике на кнопку
    function showCostumePart(dataAttr) {
        let costumePart = dataAttr.part;

        if (costumePart !== undefined) {
            showFrame(costumePart); // показать рамку
            showZoomedImage(costumePart); // показать увеличенное изображение
        }
    }

    // * функция отображения блока с информацией при клике на кнопку клавиатуры
    function showCostumeInfo(costume) {
        let pushedButton = document.querySelector(`button[data-costume="${costume}"]`);
        let shownCostumeInfo = document.querySelector(`.shown-info-block[data-costume="${costume}"]`);
        //console.log(pushedButton);
        //console.log(shownCostumeInfo);

        if (pushedButton.classList.contains("pushed-btn") && shownCostumeInfo == null) {
            let costumeInfo = constructCostumeInfo(costume);
            document.querySelector(".info").before(costumeInfo);
        } else {
            let previousCostumeInfo = document.querySelectorAll(".shown-info-block");
            previousCostumeInfo.forEach( (info) => info.remove() );
        }
    }

    // * Функция построения блока с общей информацией о костюме 
    // ! пока только для общей инф-ции по всему костюму
    function constructCostumeInfo(costume) {
        console.log(costume);
        console.log(centerScreenInfo.costumeInfo);

        let divBlock = document.createElement(`${centerScreenInfo.costumeInfo[0].blockTag}`);
        divBlock.className = `${centerScreenInfo.costumeInfo[0].blockClass}`;
        divBlock.setAttribute(`data-${centerScreenInfo.costumeInfo[1].dataAttr}`, `${centerScreenInfo.costumeInfo[1].value}`);

        for (let i = 2; i < centerScreenInfo.costumeInfo.length; i++) {
            let elem = document.createElement(`${centerScreenInfo.costumeInfo[i].tag}`);

            if (centerScreenInfo.costumeInfo[i].class !== null) {
                elem.className = `${centerScreenInfo.costumeInfo[i].class}`;
            }

            if (centerScreenInfo.costumeInfo[i].tag === 'ul') {
                let itemListArray = constructItemListArr(centerScreenInfo.costumeInfo[i].text);
                itemListArray.forEach( (item) => elem.append(item) ); 
                
            } else {
                elem.innerHTML = `${centerScreenInfo.costumeInfo[i].text}`;
            }

            divBlock.append(elem);
        }

        divBlock.classList.add("shown-info-block");
        return divBlock;
    }

    // функция построения списка 
    function constructItemListArr(listArray) {
        let resultItemArray = [];

        for (let i = 0; i < listArray.length; i++) {
            let liBlock = document.createElement("li");
            liBlock.prepend(listArray[i].text);
            resultItemArray.push(liBlock);
        }

        return resultItemArray; 
    }

    // * функция скрытия предыдущих показанных рамок, изображений, блоков параметров (кроме текущего dataAttr)
    function hidePrevious(dataAttr) {
        let dataAttrValue = Object.values(dataAttr)[0]; // значение текущего элемента
    
        // рамки
        let previousSelectedFrames = document.querySelectorAll(".selected-part-frame");
        previousSelectedFrames.forEach( (frame) => {
            if (frame.dataset.part !== dataAttrValue) {
                frame.classList.remove("selected-part-frame");
            }
        });

        // изображения
        let previousShownImages = document.querySelectorAll(".shown-part-photo");
        previousShownImages.forEach( (image) => {
            if (image.dataset.part !== dataAttrValue) {
                image.classList.remove("shown-part-photo");
            }
        });

        // выделенные блоки с информацией
        let previousShownInfoBlocks = document.querySelectorAll(".selected-param-block");
        previousShownInfoBlocks.forEach((info) => {
            let parameter = Object.values(info.dataset)[0];
            if (parameter != dataAttrValue) {
                info.classList.remove("selected-param-block");
            }
        });

        // информация о костюме
        let previousCostumeInfo = document.querySelectorAll(".shown-info-block");
        previousCostumeInfo.forEach( (info) => {
            if (info.dataset.costume !== dataAttrValue) {
                info.remove();
            }
        });

    }

    // функция отображения рамки при клике на часть костюма
    function showFrame(part) {
        let selectedCostumePart = document.querySelector(`.batman-photo-block div[data-part="${part}"]`);

        //selectedCostumePart.classList.toggle("selected-part-frame");
        if (selectedCostumePart.classList.contains("selected-part-frame")) {
            selectedCostumePart.classList.remove("selected-part-frame");
        } else {
            selectedCostumePart.classList.add("selected-part-frame");
        }
    }

    // функция отображения увеличенного изображения части костюма
    function showZoomedImage(part) {
        let selectedCostumePart = document.querySelector(`.info img[data-part="${part}"]`);

        //selectedCostumePart.classList.toggle("shown-part-photo");
        if (selectedCostumePart.classList.contains("shown-part-photo")) {
            selectedCostumePart.classList.remove("shown-part-photo");
        } else {
            selectedCostumePart.classList.add("shown-part-photo");
        }
    }

    // * Открытие увеличенного изображения при клике на рамку фрагмента костюма на фото
    let costumePartsAll = document.querySelectorAll(".part-frame");

    costumePartsAll.forEach((part) => part.addEventListener("click", function () {
        hidePrevious(this.dataset.part);
        markBtnAsPushed(this.dataset);
        showCostumePart(this.dataset);
    }));

    // * функция выделение блока информации при клике на кнопку
    function highlightInfoBlock(dataAttr) {
        //console.log(dataAttr);
        let attr = Object.keys(dataAttr)[0];
        let value = Object.values(dataAttr)[0];

        let selectedParamBlock = document.querySelector(`.param-block[data-${attr}="${value}"]`);

        if (selectedParamBlock.classList.contains("selected-param-block")) {
            selectedParamBlock.classList.remove("selected-param-block");
        } else {
            selectedParamBlock.classList.add("selected-param-block");
        }
    }

    

    // * Динамический вывод информации на страницу

    let mainInfo = constructInfoBlock(rightScreenInfo.mainInfoRU);
    let intelligenceParam = constructInfoBlock(centerScreenParams.intelligenceRU);
    let strengthParam = constructInfoBlock(centerScreenParams.strengthRU);

    document.querySelector(".parameters").append(intelligenceParam);
    document.querySelector(".parameters").append(strengthParam);
    document.querySelector(".bb-symbol").append(mainInfo);

    // * функция вывода информации по каждому блоку (элементу объекта)
    function constructInfoBlock(infoBlock) {

        let divBlock = document.createElement(`${infoBlock[0].blockTag}`);
        divBlock.className = `${infoBlock[0].blockClass}`;
        divBlock.setAttribute(`data-${infoBlock[1].dataAttr}`, `${infoBlock[1].value}`);

        for (let i = 2; i < infoBlock.length; i++) {
            let elem = document.createElement(`${infoBlock[i].tag}`);

            if (infoBlock[i].class !== null) {
                elem.className = `${infoBlock[i].class}`;
            }

            if (infoBlock[i].class == 'param') {
                // * Построение полосы характеристики
                let rectanglesArray = getRectanglesArr(infoBlock[i].text); // получаем в виде массива
                rectanglesArray.forEach((rectangle) => elem.append(rectangle)); // добавляем на страницу элементы массива
            } else {
                elem.innerHTML = `${infoBlock[i].text}`;
            }

            // * Если есть элемент с классом more-info - создать доп. иконку открытия информации
            if (infoBlock[i].class == 'more-info' && infoBlock[i].text !== '') {
                let infoIcon = constructInfoIcon();
                divBlock.prepend(infoIcon);
            }

            divBlock.append(elem);
        }

        return divBlock;
    }

    // функция сборки полосы с параметрами (принимает массив объектов из свойства text)
    function getRectanglesArr(paramObject) {
        //console.log(paramObject);

        let filledArray = constructRectanglesArr(paramObject, 'filled');
        //console.log(filledArray);

        let emptyArray = constructRectanglesArr(paramObject);
        //console.log(emptyArray);

        let resultArray = [];

        filledArray.forEach((elem) => resultArray.push(elem));
        emptyArray.forEach((elem) => resultArray.push(elem));

        //console.log(resultArray);
        return resultArray;
    }

    // функция построения полосы характеристики:
    // принимает массив объектов и флаг ('filled' или 'empty')
    // возвращает массив элементов
    function constructRectanglesArr(params, flag = 'empty') {
        //console.log(flag);

        let amount;
        if (flag === 'filled') {
            amount = params[0].param;
        } else {
            amount = 10 - params[0].param;
        }
        //console.log(amount);

        let elementsArray = [];
        for (let i = 0; i < amount; i++) {
            let element = document.createElement(`${params[0].tag}`);

            if (flag === 'filled') {
                element.className = `${params[0].class}`;
            } else {
                element.className = `${params[1].class}`;
            }
            elementsArray.push(element);
        }

        return elementsArray;
    }

    // функция построение иконки информации
    function constructInfoIcon() {
        let iconBlock = document.createElement("div");
        iconBlock.className = "info-icon-block";

        let svgImage = `
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="14" fill="none" stroke="aqua" stroke-width="2" />
                <path
                    d="M14.9961 8.41016C14.8086 8.41016 14.6172 8.39453 14.4219 8.36328C14.2266 8.32422 14.0117 8.25781 13.7773 8.16406C13.5508 8.07031 13.3633 7.92187 13.2148 7.71875C13.0742 7.51563 13.0039 7.27344 13.0039 6.99219C13.0039 6.03125 13.6523 5.55078 14.9492 5.55078C15.3164 5.55078 15.625 5.59766 15.875 5.69141C16.1328 5.78516 16.3203 5.91016 16.4375 6.06641C16.5625 6.22266 16.6484 6.375 16.6953 6.52344C16.7422 6.67188 16.7656 6.83203 16.7656 7.00391C16.7656 7.35547 16.6562 7.64453 16.4375 7.87109C16.2188 8.09766 15.9844 8.24609 15.7344 8.31641C15.4922 8.37891 15.2461 8.41016 14.9961 8.41016ZM16.9297 11.5156V20.0586C16.9297 20.1758 16.9336 20.2695 16.9414 20.3398C16.957 20.4023 16.9844 20.4766 17.0234 20.5625C17.0703 20.6484 17.1484 20.7148 17.2578 20.7617C17.3672 20.8008 17.5078 20.8203 17.6797 20.8203C17.9766 20.8203 18.2305 20.8672 18.4414 20.9609C18.6523 21.0547 18.7578 21.1953 18.7578 21.3828C18.7578 22.2969 18.6289 22.8672 18.3711 23.0938C17.668 23.0312 16.8086 23 15.793 23C14.7383 23 13.7539 23.0312 12.8398 23.0938C12.582 22.8594 12.4531 22.2891 12.4531 21.3828C12.4531 21.1953 12.5586 21.0547 12.7695 20.9609C12.9805 20.8672 13.2344 20.8203 13.5312 20.8203C13.8359 20.8203 14.0352 20.7578 14.1289 20.6328C14.2227 20.5 14.2695 20.3164 14.2695 20.082V13.7891C14.2695 13.375 14.1484 13.082 13.9062 12.9102C13.6719 12.7383 13.2148 12.6367 12.5352 12.6055C12.4336 12.582 12.3672 12.5312 12.3359 12.4531C12.3125 12.375 12.3008 12.207 12.3008 11.9492C12.3008 11.5508 12.3438 11.1992 12.4297 10.8945C12.5156 10.5898 12.6016 10.4141 12.6875 10.3672C13.2891 10.4531 13.8711 10.4961 14.4336 10.4961C14.8086 10.4961 15.2031 10.4766 15.6172 10.4375C16.0312 10.3906 16.25 10.3672 16.2734 10.3672C16.5469 10.3672 16.7227 10.4375 16.8008 10.5781C16.8867 10.7109 16.9297 11.0234 16.9297 11.5156Z"
                    fill="aqua" />
            </svg>`;

        iconBlock.insertAdjacentHTML("afterBegin", svgImage);

        return iconBlock;
    }





    // * Запрет перетаскивания изображений
    let allImg = document.querySelectorAll("img");

    allImg.forEach((elem) => {
        elem.addEventListener("dragstart", function (event) {
            event.preventDefault();
        });
    });

}

// Информация для центрального правого экрана - "Параметры"
let centerScreenParams = {
    intelligenceRU: [
        { language: "RU", blockTag: 'div', blockClass: 'param-block' },
        { dataAttr: 'param', value: 'intelligence' },
        { tag: 'h3', class: null, text: 'Интеллект' },
        { tag: 'div', class: 'param', text:
                [
                    { tag: 'div', class: 'filled-rectangle param-rectangle', param: 7 },
                    { tag: 'div', class: 'empty-rectangle param-rectangle', param: null }
                ]
        },
        {
            tag: 'p', class: 'more-info', text: `Способен мыслить нестандартно, хорошо разбирается в технике, 
        неплохо развита дедукция` },
    ],
    strengthRU: [
        { language: "RU", blockTag: 'div', blockClass: 'param-block' },
        { dataAttr: 'param', value: 'strength' },
        { tag: 'h3', class: null, text: 'Сила|Выносливость' },
        { tag: 'div', class: 'param', text:
                [
                    { tag: 'div', class: 'filled-rectangle param-rectangle', param: 9 },
                    { tag: 'div', class: 'empty-rectangle param-rectangle', param: null }
                ]
        },
        { tag: 'p', class: 'more-info', text: '' },
    ],
};

// Выноски и информация о костюме
let centerScreenInfo = {
    costumeInfo: [
        { language: "RU", blockTag: 'div', blockClass: 'costume-info-block info-block' }, 
        { dataAttr: 'costume', value: 'costume-info' },
        { tag: 'p', class: null, text: '<b>Высокотехнологичный костюм</b>' },
        { tag: 'ul', class: null, text: 
            [ 
                { number: 1, text: `состоит из очень лёгкого и гибкого материала, что позволяет носить его в рюкзаке в
                    сложенном виде;` },
                { number: 2, text: `автоматически меняет размер в зависимости от физических параметров человека, который
                    его носит;` },
                { number: 3, text: `обладает высокой прочностью и усиленной баллистической защитой (защищает от падений
                    с большой высоты, пробития стен, мощных взрывов, метательных ножей);` },
                { number: 4, text: `защищает от экстремально высоких и низких температур, разрядов тока, воздействия
                    воды и низких уровней радиации;` },
                { number: 5, text: `имеет встроенный жучок, позволяющий в любой момент определить его местонахождение;` },
                { number: 6, text: `позволяет увеличить температуру отдельных частей до четырёх тысяч градусов;` },
                { number: 7, text: `обладает «противоугонной» системой, управляемой из бэт-пещеры (при активации все
                    функции костюма, кроме радиопередатчика, полностью отключаются, а сам он застывает в
                    одном положении вместе с тем, кто его носит, до отключения режима).` },
            ]
        },
    ],

    // ! остальные выноски

};

// Информация для правого экрана - "Основное"
let rightScreenInfo = {
    mainInfoRU: [
        { language: "RU", blockTag: 'div', blockClass: 'param-block' },
        { dataAttr: 'info', value: 'main-info' },
        { tag: 'p', class: null, text: '<ins>Имя</ins>:' },
        { tag: 'h3', class: 'name', text: 'Терренс "Терри" МакГиннис' },
        { tag: 'p', class: null, text: '<ins>Пол</ins>: Мужской' },
        { tag: 'p', class: null, text: '<ins>Возраст</ins>: 17 лет' },
        { tag: 'p', class: null, text: '<ins>Рост</ins>: 1,78 м' },
        { tag: 'p', class: null, text: '<ins>Вес</ins>: 77 кг' },
        { tag: 'p', class: null, text: '<ins>Глаза</ins>: голубые' },
        { tag: 'p', class: null, text: '<ins>Волосы</ins>: чёрные' },
        { tag: 'p', class: null, text: '<ins>Статус личности</ins>: cкрыта' },
    ],
};