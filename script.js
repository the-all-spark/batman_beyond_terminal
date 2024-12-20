window.addEventListener("load", showAll);

function showAll() {

    let keyboardButtons = Array.from(document.querySelectorAll(".keyboard button"));
    console.log(keyboardButtons);

    // * Выделение части костюма рамкой и отображение увеличенного фрагмента при клике на кнопку
    keyboardButtons.forEach( (button) => button.addEventListener("click", function() { 
        showCostumePart(this.dataset.part); 
    }));

    function showCostumePart(part) {
        //console.log(part);

        if (part !== undefined) {
            showFrame(part); // показать рамку
            showZoomedImage(part); // показать увеличенное изображение
        }
    }
    
    // функция отображения рамки при клике на часть костюма
    function showFrame(part) {
        let selectedCostumePart = document.querySelector(`.batman-photo-block div[data-part="${part}"]`);
        selectedCostumePart.classList.toggle("shown");
    }

    // функция отображения увеличенного изображения части костюма
    function showZoomedImage(part) {
        let selectedCostumePart = document.querySelector(`.info img[data-part="${part}"]`);
        selectedCostumePart.classList.toggle("shown");
    }


    


    // Запрет перетаскивания изображений
    let allImg = document.querySelectorAll("img");

    allImg.forEach( (elem) => {
        elem.addEventListener("dragstart", function(event) { 
            event.preventDefault(); 
        } );
    });

}