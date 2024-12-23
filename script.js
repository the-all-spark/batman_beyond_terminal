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
            hidePrevious(dataAttr.part); // скрыть предыдущие // ? для других кроме частей костюма
            showCostumePart(dataAttr);
        } else {
            console.log("Выбрано что-то другое");
            // TODO вставить другую функцию
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
    //console.log(costumePartsAll);

    costumePartsAll.forEach( (part) => part.addEventListener("click", function() { 
        hidePrevious(this.dataset.part);
        markBtnAsPushed(this.dataset);
        showCostumePart(this.dataset);
    }));






    // * Запрет перетаскивания изображений
    let allImg = document.querySelectorAll("img");

    allImg.forEach( (elem) => {
        elem.addEventListener("dragstart", function(event) { 
            event.preventDefault(); 
        } );
    });

}