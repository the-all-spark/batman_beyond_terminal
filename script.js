window.addEventListener("load", showAll);

function showAll() {

    let keyboardButtons = Array.from(document.querySelectorAll(".keyboard button"));
    //console.log(keyboardButtons);

    // * Выбор действия при клике на кнопку "клавиатуры", эффект нажатой кнопки
    keyboardButtons.forEach( (button) => button.addEventListener("click", function() { 
        markBtnAsPushed(this.dataset);
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

        previousMarkedBtns.forEach( (button) =>  {
            button.classList.remove("pushed-btn");
        });
    }

    // функция выбора действия в зависимости от атрибута data
    function chooseAction(dataAttr) {
        //console.log(dataAttr);

        if ("part" in dataAttr) {
            hidePrevious(dataAttr.part); // скрыть предыдущие выделения
            showCostumePart(dataAttr);
        } else {
            highlightInfoBlock(dataAttr); // выделить блок с информацией
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

    // функция скрытия предыдущих показанных рамок и изображений (кроме текущего)
    function hidePrevious(part) {

        // рамки
        let previousSelectedFrames = document.querySelectorAll(".selected-part-frame");
        previousSelectedFrames.forEach( (frame) =>  {
            if (frame.dataset.part !== part) {
                frame.classList.remove("selected-part-frame");
            }
        });

        // изображения
        let previousShownImages = document.querySelectorAll(".shown-part-photo");
        previousShownImages.forEach( (image) => {
            if (image.dataset.part !== part) {
                image.classList.remove("shown-part-photo");
            }
        });

        // выделенные блоки с информацией
        let previousShownInfoBlocks = document.querySelectorAll(".selected-param-block");
        previousShownInfoBlocks.forEach( (info) => {
            info.classList.remove("selected-param-block");
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

    costumePartsAll.forEach( (part) => part.addEventListener("click", function() { 
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
        //console.log(selectedParamBlock);

        if (selectedParamBlock.classList.contains("selected-param-block")) {
            selectedParamBlock.classList.remove("selected-param-block");
        } else {
            selectedParamBlock.classList.add("selected-param-block");
        }
        
       hidePreviousAll(value);
    }

    // функция скрытия предыдущих рамок, изображений частей костюмов и выделенных полос параметров
    // принимает значение атрибута data-param (элемент не должен быть скрыт) 
    function hidePreviousAll(value) {

        // рамки
        let previousSelectedFrames = document.querySelectorAll(".selected-part-frame");
        previousSelectedFrames.forEach( (frame) =>  frame.classList.remove("selected-part-frame") );

        // изображения
        let previousShownImages = document.querySelectorAll(".shown-part-photo");
        previousShownImages.forEach( (image) => image.classList.remove("shown-part-photo") );

        // выделенные блоки с информацией 
        let previousShownInfoBlocks = document.querySelectorAll(".selected-param-block");
        previousShownInfoBlocks.forEach( (info) => {
            if (info.dataset.param !== value) {
                info.classList.remove("selected-param-block");
            }
        });
        
    }



    // * Динамический вывод информации на страницу
    //console.log(centerScreenParams);
    //console.log(centerScreenParams.mainInfoRU)
    //console.log(centerScreenParams.intelligenceRU);
    
    showInfoBlock(centerScreenParams.mainInfoRU);
    showInfoBlock(centerScreenParams.intelligenceRU);
    showInfoBlock(centerScreenParams.strengthRU);

    // функция вывода информации по каждому блоку (элементу объекта)
    function showInfoBlock(infoBlock) {

        // ! для centerScreenParams.mainInfoRU и intelligenceRU
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
                rectanglesArray.forEach( (rectangle) => elem.append(rectangle) ); // добавляем на страницу элементы массива
            } else {
                elem.innerHTML = `${infoBlock[i].text}`;
            }

            // ! если класс more-info - создать доп иконку открытия информации
            //! отдельно ее стили (позиционирование) в css
            /* if (infoBlock[i].class == 'more-info') {

            } */

            divBlock.append(elem);
        }
        document.querySelector(".parameters").append(divBlock);
    }

    // функция сборки полосы с параметрами (принимает массив объектов из свойства text)
    function getRectanglesArr(paramObject) {
        //console.log(paramObject);
        
        let filledArray = constructRectanglesArr(paramObject, 'filled'); 
        //console.log(filledArray);

        let emptyArray = constructRectanglesArr(paramObject, 'empty'); 
        //console.log(emptyArray);

        let  resultArray = [];

        filledArray.forEach( (elem) => resultArray.push(elem) );
        emptyArray.forEach( (elem) => resultArray.push(elem) );

        //console.log(resultArray);
        return resultArray;       
    }

    // функция построения полосы характеристики:
    // принимает массив объектов и флаг ('filled' или 'empty')
    // возвращает массив элементов
    function constructRectanglesArr(params, flag) {
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

    



    // * Запрет перетаскивания изображений
    let allImg = document.querySelectorAll("img");

    allImg.forEach( (elem) => {
        elem.addEventListener("dragstart", function(event) { 
            event.preventDefault(); 
        } );
    });

}

// data-info="main-info", правый блок информации (центральный блок)
/*let mainInfoRU = [
    {dataAttr: 'info', value: 'main-info', language: "RU"},
    { tag: 'p', class: null, text: 'Имя:' },
    { tag: 'h3', class: 'name', text: 'Терренс "Терри" МакГиннис' },
    { tag: 'p', class: null, text: 'Пол: Мужской' },
    { tag: 'p', class: null, text: 'Возраст: 17 лет' },
    { tag: 'p', class: null, text: 'Рост: 1,78 м' },
    { tag: 'p', class: null, text: 'Вес: 77 кг' },
    { tag: 'p', class: null, text: 'Глаза: голубые' },
    { tag: 'p', class: null, text: 'Волосы: чёрные' },
    { tag: 'p', class: null, text: 'Статус личности: cкрыта' },
];*/

// Информация для центрального правого экрана - "Параметры"
let centerScreenParams = {
    mainInfoRU: [
        { language: "RU", blockTag: 'div', blockClass: 'param-block' }, 
        { dataAttr: 'info', value: 'main-info' },
        { tag: 'p', class: null, text: 'Имя:' },
        { tag: 'h3', class: 'name', text: 'Терренс "Терри" МакГиннис' },
        { tag: 'p', class: null, text: 'Пол: Мужской' },
        { tag: 'p', class: null, text: 'Возраст: 17 лет' },
        { tag: 'p', class: null, text: 'Рост: 1,78 м' },
        { tag: 'p', class: null, text: 'Вес: 77 кг' },
        { tag: 'p', class: null, text: 'Глаза: голубые' },
        { tag: 'p', class: null, text: 'Волосы: чёрные' },
        { tag: 'p', class: null, text: 'Статус личности: cкрыта' },
    ],
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
        { tag: 'p', class: 'more-info', text: 'Способен мыслить нестандартно, хорошо разбирается в технике, неплохо развита дедукция' },
    ],
    strengthRU: [
        { language: "RU", blockTag: 'div', blockClass: 'param-block' }, 
        { dataAttr: 'param', value: 'strength' },
        { tag: 'h3', class: null, text: 'Сила и выносливость' },
        { tag: 'div', class: 'param', text: 
            [ 
                { tag: 'div', class: 'filled-rectangle param-rectangle', param: 9 },
                { tag: 'div', class: 'empty-rectangle param-rectangle', param: null }
            ]
        },
        { tag: 'p', class: 'more-info', text: '...' },
    ],
};