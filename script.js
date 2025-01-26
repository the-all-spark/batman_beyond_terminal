window.addEventListener("load", showAll);

function showAll() {
    
    // Получение ширины экрана при открытии страницы и при увеличении/уменьшении экрана
    let windowWidth = window.innerWidth;
    console.log(windowWidth);

    window.addEventListener("resize", function() {
        windowWidth = window.innerWidth;
    });

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
        //console.log(this.dataset);
        markBtnAsPushed(this.dataset);

        hideShowRightPhoto(this.dataset);
        hideShowHelpBlock(); // скрыть инфо-блок
        hidePrevious(this.dataset); // скрыть предыдущие выделения

        chooseAction(this.dataset);
    }));

    // * функция выделения кнопки как нажатой
    function markBtnAsPushed(dataAttr) {
        let attr = Object.keys(dataAttr)[0];
        let value = Object.values(dataAttr)[0];
        //console.log(dataAttr);
        //console.log(attr);
        //console.log(value);

        let pushedButton;
        if (attr == 'button') {
            pushedButton = document.querySelector(`.part-info-button[data-${attr}="${value}"]`);
            addClassToBtn("pushed-part-btn");
            pushedButton.setAttribute("disabled", "");
        } else {
            // если 'part' или 'costume'
            pushedButton = document.querySelector(`.keyboard button[data-${attr}="${value}"]`); 
            addClassToBtn("pushed-btn");
        }

        // функция добавления класса кнопке клавиатуры или меню по частям костюма
        function addClassToBtn(btnClass) {
            if (pushedButton !== null) {
                if (pushedButton.classList.contains(`${btnClass}`)) {
                    pushedButton.classList.remove(`${btnClass}`); // отжатая кнопка 
                } else {
                    unmarkBtns(btnClass);
                    pushedButton.classList.add(`${btnClass}`);
                }
            }
        }
    }

    // функция удаления выделения всех ранее "нажатых" кнопок
    function unmarkBtns(btnClass) {
        let previousMarkedBtns = document.querySelectorAll(`.${btnClass}`);

        previousMarkedBtns.forEach((button) => {
            button.classList.remove(`${btnClass}`);
            button.removeAttribute("disabled");
        });
    }

    // функция скрывает или возвращает фотографию справа в зависимости от значения атрибута и ширины экрана
    function hideShowRightPhoto(dataAttr) {
        let photo = document.querySelector(".terry-photo");

        if (Object.keys(dataAttr)[0] === 'part' && windowWidth <= 1260) {
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
            showCostumeInfo(dataAttr); // отображение информации
        } 

        if ("part" in dataAttr) {
            showCostumePart(dataAttr); // отображение рамки и увеличенного фрагмента
            showCostumeInfo(dataAttr); // отображение информации
        } 
        
        if ("param" in dataAttr || "info" in dataAttr) {
            highlightInfoBlock(dataAttr); // выделить блок с информацией
        } 

    }

    // функция скрытия и показа информационного блока в центре экрана
    function hideShowHelpBlock() {
        let helpBlock = document.querySelector(".help-block");

        let btnsForCenterBlock = getBtnsForCenterBlock();
        //console.log(btnsForCenterBlock);
        let markedBtnFlag = isMarked(btnsForCenterBlock);
        //console.log(markedBtnFlag);

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

    // * функция отображения блока с информацией и частями костюма при клике на кнопку клавиатуры
    function showCostumeInfo(dataAttr) {
        //console.log(dataAttr);
        let attr = Object.keys(dataAttr)[0];
        let value = Object.values(dataAttr)[0];

        let pushedButton = document.querySelector(`button[data-${attr}="${value}"]`);
        //let shownCostumeInfo = document.querySelector(`.shown-info-block[data-${attr}="${value}"]`);
        //let shownPartInfo = document.querySelector(`.shown-part[data-${attr}="${value}"]`);
        //console.log(pushedButton);
        //console.log(shownCostumeInfo); // ! м.б. null
        //console.log(shownPartInfo); // ! м.б. null

        //if (pushedButton.classList.contains("pushed-btn") && ( shownCostumeInfo == null || shownPartInfo == null)) {
        if (pushedButton.classList.contains("pushed-btn")) {
            let costumeInfoArr = constructCostumeInfo(value);
            console.log(costumeInfoArr);

            // ! пока еще есть части костюма без инфы в массиве
            if (costumeInfoArr !== undefined) {

                costumeInfoArr.forEach( (part) => {
                    if (attr == 'part') {

                        // если в массиве costumeInfoArr > 1 элемента - построить кнопки-меню для частей костюма
                        if (costumeInfoArr.length > 1) {
                            let divButtonBlock = document.querySelector(".part-buttons-block");
                            divButtonBlock.setAttribute("data-buttons", Object.values(part.dataset)[0]);

                            let btnBlock = document.createElement("button");
                            btnBlock.className = "part-info-button";
                            btnBlock.setAttribute("data-button", Object.values(part.dataset)[1]);

                            let btnText = part.childNodes[0].innerText; // заголовок кнопки
                            btnBlock.innerHTML = btnText;

                            divButtonBlock.append(btnBlock);
                        } else {
                            // если в массиве costumeInfoArr 1 элемент - отобразить его на экране
                            part.classList.add("shown-part");
                        }
                        document.querySelector(".part-info-block").append(part);

                    } else {
                        part.classList.add("shown-info-block");
                        document.querySelector(".info").before(part);
                    }
                });

                // * Отображение нужного блока информации по части костюма при клике на кнопку-меню
                let partButtons = Array.from(document.querySelectorAll(".part-info-button"));
                console.log(partButtons);
                
                if (partButtons.length > 0) {

                    partButtons.forEach((button) => button.addEventListener("click", function () {
                        markBtnAsPushed(this.dataset);
                        //console.log(this.dataset);

                        // скрываем показанные ранее блоки с информацией 
                        let shownInfoBlocks = document.querySelectorAll(".shown-part");
                        if (shownInfoBlocks.length > 0) {
                            shownInfoBlocks.forEach((button) => button.classList.remove("shown-part"));
                        }
                       
                        let  dataAttrValue = Object.values(this.dataset)[0];
                        let selectedInfo = document.querySelector(`.part-info[data-button="${dataAttrValue}"]`);
                        //console.log(selectedInfo);
                        selectedInfo.classList.add("shown-part");
                    }));
                }
            } 

        } else {
            let previousCostumeInfo = document.querySelectorAll(".shown-info-block"); 
            previousCostumeInfo.forEach( (info) => info.remove() ); 

            let previousPartInfo = document.querySelectorAll(".shown-part"); 
            previousPartInfo.forEach( (info) => info.remove() ); 
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

    // * Функция построения блока с общей информацией о костюме и частям костюма
    // включает наличие нескольких блоков с одинаковым dataAttr=value
    function constructCostumeInfo(dataAttrValue) {
        console.log(dataAttrValue);
        console.log(centerScreenInfo);

        let selectedSet = []; // массив (набор) блоков информации для вывода
        for (let key in centerScreenInfo) {
            if (centerScreenInfo[key][1].value == dataAttrValue) {
                let selectedElem = centerScreenInfo[key];
                selectedSet.push(selectedElem);
            }
        }
        //console.log(selectedSet);

        // ! пока есть части костюма без заполненной информации (объектов в массиве)
        if (selectedSet.length > 0) {
            let blocksToShow = []; // массив блоков для вывода на страницу

            selectedSet.forEach((part) => {
                let divBlock = document.createElement(`${part[0].blockTag}`);
                divBlock.className = `${part[0].blockClass}`;

                divBlock.setAttribute(`data-${part[1].dataAttr}`, `${part[1].value}`);
                if ('dataAttrAdd' in part[1]) {
                    divBlock.setAttribute(`data-${part[1].dataAttrAdd}`, `${part[1].valueAdd}`);
                } 

                for (let i = 2; i < part.length; i++) {
                    let elem = document.createElement(`${part[i].tag}`);

                    if (part[i].class !== null) {
                        elem.className = `${part[i].class}`;
                    }

                    if (part[i].tag === 'ul') {
                        let itemListArray = constructItemListArr(part[i].text);
                        itemListArray.forEach( (item) => elem.append(item) ); 
                    } else {
                        elem.innerHTML = `${part[i].text}`;
                    }

                    divBlock.append(elem);
                }
                blocksToShow.push(divBlock);
            });

            //console.log(blocksToShow);
            return blocksToShow;
        }
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

        // информация о частях костюма
        let previousPartInfo = document.querySelectorAll(".shown-part");
        previousPartInfo.forEach( (info) => {
            if (info.dataset.part !== dataAttrValue) {
                info.remove();
            }
        });

        // кнопки для частей костюма (если более 1)
        let buttonsBlock = document.querySelector(".part-buttons-block");
        buttonsBlock.innerHTML = null;

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
        let selectedCostumePart = document.querySelector(`.part-photo-block img[data-part="${part}"]`);

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
        markBtnAsPushed(this.dataset);
        
        hideShowRightPhoto(this.dataset);
        hideShowHelpBlock(); // скрыть инфо-блок
        hidePrevious(this.dataset);

        showCostumePart(this.dataset);
        showCostumeInfo(this.dataset);
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

    // ** Динамический вывод информации на страницу

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
            
            } else if (Array.isArray(infoBlock[i].text)) {
                // если текст - массив со вложенными тегами для выделения текста

                let decorTag = document.createElement(`${infoBlock[i].text[0].decorTag}`);
                decorTag.prepend(infoBlock[i].text[1].decorText);
                elem.append(decorTag, ': ');

                if (infoBlock[i].text[2].text !== '') {
                    elem.append(infoBlock[i].text[2].text);
                }
        
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

    // *  Отображение дополнительной информации в блоках параметров и информации при клике на "i"
    let infoIcons = document.querySelectorAll(".info-icon-block");
    //console.log(infoIcons);

    infoIcons.forEach( (icon) => icon.addEventListener("click", function() {
        let dataAttr = icon.parentElement.dataset;
        showMoreInfo(dataAttr);
    }));

    function showMoreInfo(dataAttr) {
        //console.log(dataAttr);
        let attr = Object.keys(dataAttr)[0];
        let value = Object.values(dataAttr)[0];

        let moreInfoBlock = document.querySelector(`.param-block[data-${attr}="${value}"] .more-info`);
        //console.log(moreInfoBlock);

        if (moreInfoBlock.classList.contains("shown-more-info")) {
            moreInfoBlock.classList.remove("shown-more-info");
        } else {
            moreInfoBlock.classList.add("shown-more-info");
        }
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
        { tag: 'p', class: 'more-info', text: '...' }, // !
    ],
};

// Выноски и информация о костюме
let centerScreenInfo = {
    'costume-info': [
        { language: "RU", blockTag: 'div', blockClass: 'costume-info-block info-block' }, 
        { dataAttr: 'costume', value: 'costume-info' },
        { tag: 'p', class: null, text: '<b>Высокотехнологичный костюм</b>' },
        { tag: 'ul', class: null, text: 
            [ 
                { item: 1, text: `состоит из очень лёгкого и гибкого материала, что позволяет носить его в рюкзаке в
                    сложенном виде;` },
                { item: 2, text: `автоматически меняет размер в зависимости от физических параметров человека, который
                    его носит;` },
                { item: 3, text: `обладает высокой прочностью и усиленной баллистической защитой (защищает от падений
                    с большой высоты, пробития стен, мощных взрывов, метательных ножей);` },
                { item: 4, text: `защищает от экстремально высоких и низких температур, разрядов тока, воздействия
                    воды и низких уровней радиации;` },
                { item: 5, text: `имеет встроенный жучок, позволяющий в любой момент определить его местонахождение;` },
                { item: 6, text: `позволяет увеличить температуру отдельных частей до четырёх тысяч градусов;` },
                { item: 7, text: `обладает «противоугонной» системой, управляемой из бэт-пещеры (при активации все
                    функции костюма, кроме радиопередатчика, полностью отключаются, а сам он застывает в
                    одном положении вместе с тем, кто его носит, до отключения режима).` },
            ]
        },
    ],

    'chest': [
        { language: "RU", blockTag: 'div', blockClass: 'part-info' }, 
        { dataAttr: 'part', value: 'chest' },
        { tag: 'p', class: null, text: '<b>Торс</b>' },
        { tag: 'ul', class: null, text: 
            [ 
                { item: 1, text: `Включает приспособление, способное временно ослепить противников магниевой вспышкой;` },
            ]
        },
    ],

    'mask-eyes': [
        { language: "RU", blockTag: 'div', blockClass: 'part-info' }, 
        //{ dataAttr: 'part', value: 'mask' },
        { dataAttr: 'part', value: 'mask', dataAttrAdd: 'button', valueAdd: 'mask-eyes'},
        { tag: 'p', class: null, text: '<b>Линзы в маске</b>' },
        { tag: 'ul', class: null, text: 
            [ 
                { item: 1, text: `передают изображение с костюма на монитор бэт-компьютера в пещере;` },
                { item: 2, text: `выводят всю необходимую информацию на внутренний дисплей маски 
                    (в том числе полученную с бэт-компьютера);` },
                { item: 3, text: `позволяют переключаться между режимами (ночным, инфракрасным и ультрафиолетовым);` },
                { item: 4, text: `телескопическое зрение: увеличение кратности изображения
                    (на большие расстояния / мелкие объекты вблизи); 
                    интерфейс и система наведения показывают расстояние до выбранной цели и её скорость передвижения);` },
                { item: 5, text: `содержат анализатор ДНК.` },
            ]
        },
    ],

    'mask-ears': [
        { language: "RU", blockTag: 'div', blockClass: 'part-info' }, 
        //{ dataAttr: 'part', value: 'mask' },
        { dataAttr: 'part', value: 'mask', dataAttrAdd: 'button', valueAdd: 'mask-ears'},
        { tag: 'p', class: null, text: '<b>Острые уши</b>' },
        { tag: 'p', class: null, text: 'Встроенная система связи (передатчик):' },
        { tag: 'ul', class: null, text: 
            [ 
                { item: 1, text: `позволяет держать постоянную связь с бэт-пещерой;` },
                { item: 2, text: `перенаправляет все телефонные звонки на гарнитуру костюма, 
                    позволяя не отвлекаться во время выполнения заданий.` },
            ]
        },
    ],

    'mask-mouth-nose': [
        { language: "RU", blockTag: 'div', blockClass: 'part-info' }, 
        //{ dataAttr: 'part', value: 'mask' },
        { dataAttr: 'part', value: 'mask', dataAttrAdd: 'button', valueAdd: 'mask-mouth-nose'},
        { tag: 'p', class: null, text: '<b>Нос и рот</b>' },
        { tag: 'p', class: null, text: 'Дыхательный аппарат - своеобразная маска, делающая костюм полностью герметичным:' },
        { tag: 'ul', class: null, text: 
            [ 
                { item: 1, text: `позволяет долгое время дышать под водой;` },
                { item: 2, text: `защищает от ядовитых газов.` },
            ]
        },
    ],


    

};

// Информация для правого экрана - "Основное"
let rightScreenInfo = {
    mainInfoRU: [
        { language: "RU", blockTag: 'div', blockClass: 'param-block' },
        { dataAttr: 'info', value: 'main-info' },
        { tag: 'p', class: null, text: [ {decorTag: 'ins'}, {decorText: 'Имя'}, {text: ''} ] },
        { tag: 'h3', class: 'name', text: 'Терренс "Терри" МакГиннис' },
        { tag: 'p', class: null, text: [ {decorTag: 'ins'}, {decorText: 'Пол'}, {text: 'мужской'} ] },
        { tag: 'p', class: null, text: [ {decorTag: 'ins'}, {decorText: 'Возраст'}, {text: '17 лет'} ] },
        { tag: 'p', class: null, text: [ {decorTag: 'ins'}, {decorText: 'Рост'}, {text: '1,78 м'} ] },
        { tag: 'p', class: null, text: [ {decorTag: 'ins'}, {decorText: 'Вес'}, {text: '77 кг'} ] },
        { tag: 'p', class: null, text: [ {decorTag: 'ins'}, {decorText: 'Глаза'}, {text: 'голубые'} ] },
        { tag: 'p', class: null, text: [ {decorTag: 'ins'}, {decorText: 'Волосы'}, {text: 'чёрные'} ] },
        { tag: 'p', class: null, text: [ {decorTag: 'ins'}, {decorText: 'Статус личности'}, {text: 'cкрыта'} ] },
    ],
};