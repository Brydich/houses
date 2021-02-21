"use strict";
$(document).ready(function() {
	$('.slider').slick({
		arrows: false,/*Показ стрелок*/
		dots: true,/*Показ точек*/
		adaptiveHeight: true,/*Автоматическая адаптивная высота слайда(false) Чтобы работал .slick-track{align-items:flex-start;}*/
		slidesToShow: 1,/*Кол-во слайдов за один показ*/
		slidesToScroll: 1,/*Кол-во слайдов, которые будут пролистываться за 1 раз*/
		speed: 1000,/*Скорость пролистывания слайдов(300ms)*/
		easing:'linear',/*Тип анимации при смена слайда (look at atanimation)*/
		infinite: true,/*Будет ли слайдер бесконечным (true) Появляется slick-disabled*/
		initialSlide: 0,/*Стартовый слайд (0)*/
		autoplay: true,/*Будет ли проигрываться слайдер автоматически (false)*/
		autoplaySpeed: 5000,/*Время автопроигрывания слада (3000)*/
		pauseOnFocus: true,/*Пауза при фокусе (true)*/
		pauseOnHover: true,/*Пауза при наведении (true)*/
		pauseOnDotsHover: true,/*Пауза при наведении на кнопки*/
		draggable: true,/*Будет ли работать свайп на ПК (true)*/
		swipe: true,/*Будет ли работать свайп на телефонах (true)*/
		touchThreshold: 30,/*Часть которя нужна для свайпа (5)*/
		touchMove: true,/*Будет ли тянуться слайдер (true)*/
		waitForAnimate: true,/*Будет ли слайдер блокировать множество свайпов (true)*/
		centerMode: true,/*Будет ли главный слайд по центру (false) Рекомендуется {text-align: center;}*/
		variableWidth: false,/*Контент сам задает ширину (false)*/
		rows: 1,/*Сколько рядов будет показываться за раз (1)*/
		slidesPerRow: 1,/*Количество слайдов в ряду (1)*/
		vertical: false,/* (false) //Для true-> Если flex, то .slick-track{display: block} | Рекомендуется задать высоту в html*/
		varticalSwiping: false,/*Будет ли слайдер свайпать вверх или вниз (false)*/
		fade: true,/* !Показывает только 1 картинку и слады не листаются а затемняются*/
		/*asNavFor: ".slider-big",*/    /*Связывает несколько слайдеров (При нажатии кнопки картинки меняются на этих слайдерах)*/
		responsive:[{
			breakpoint: 768,/*Брейкпоинт, на котором можно изменить каие-либо значения*/
			settings: {
				slidesToShow: 1,
			}
		},{
			// breakpoint: ;
			settings: {}
		}],

		// mobileFirst: false;
		// <img data-lazy="../img/" alt="">   Ленивая загрузка (html)
		/*appendArrows:$('.content'),*/       /*Выводит стрелки в блок с заданным классом*/
		// appendDots:$('.slider__block_dots')        /*Выводит точки в блок с заданным классом*/
	});
}); 
// ========================================================================
// data-da="Куда, какой, когда"
// data-da=".content,0,992"

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle




class DynamicAdapt {
  constructor(type) {
    this.type = type;
  }

  init() {
    // массив объектов
    this.оbjects = [];
    this.daClassname = '_dynamic_adapt_';
    // массив DOM-элементов
    this.nodes = [...document.querySelectorAll('[data-da]')];

    // наполнение оbjects объктами
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const dataArray = data.split(',');
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
      оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    });

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = this.оbjects
      .map(({
        breakpoint
      }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
      .filter((item, index, self) => self.indexOf(item) === index);

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = this.оbjects.filter(
        ({
          breakpoint
        }) => breakpoint === mediaBreakpoint
      );
      matchMedia.addEventListener('change', () => {
        this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    });
  }

  // Основная функция
  mediaHandler(matchMedia, оbjects) {
    if (matchMedia.matches) {
      оbjects.forEach((оbject) => {
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      });
    } else {
      оbjects.forEach(
        ({ parent, element, index }) => {
          if (element.classList.contains(this.daClassname)) {
            this.moveBack(parent, element, index);
          }
        }
      );
    }
  }

  // Функция перемещения
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
      destination.append(element);
      return;
    }
    if (place === 'first') {
      destination.prepend(element);
      return;
    }
    destination.children[place].before(element);
  }

  // Функция возврата
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }

  // Функция получения индекса внутри родителя
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }

  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  arraySort(arr) {
    if (this.type === 'min') {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return -1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return 1;
          }
          return a.place - b.place;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return 1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return -1;
          }
          return b.place - a.place;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
const da = new DynamicAdapt("min");  

da.init();


// ========================================================================================================================
// Header function
let iconMenu = document.querySelector(".icon-menu");
let body = document.querySelector("body");
let menuBody = document.querySelector(".menu"); /*(".menu__body")*/
if (iconMenu) {
	iconMenu.addEventListener("click", function () {
		iconMenu.classList.toggle("active");
		body.classList.toggle("lock");
		menuBody.classList.toggle("active");
	});
}

let menuIcon = document.querySelector(".menu__icon");
let menuClose = document.querySelector(".menu");
  menuIcon.addEventListener("click", function(){
	menuClose.classList.remove("active");
	body.classList.toggle("lock");
})
// ========================================================================================================================
// Header-drop
let isMobile = {
  Android: function() {return navigator.userAgent.match(/Android/i);},
  BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
  iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
  Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
  Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
  any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};
    let bodyPage=document.querySelector('body');
if(isMobile.any()){
    bodyPage.classList.add('touch');
    let arrow=document.querySelectorAll('.arrow');
  for(let i=0; i<arrow.length; i++){
      let thisLink=arrow[i].previousElementSibling; /*Ссылка*/
      let subMenu=arrow[i].nextElementSibling; /*Выпадающее меню*/
      let thisArrow=arrow[i]; /*Стрелка*/

      thisLink.classList.add('parent');
      arrow[i].addEventListener('click', function(){
      subMenu.classList.toggle('open');
      thisArrow.classList.toggle('active');
    });
  }
}else{
  bodyPage.classList.add('mouse');
}
/*Для ПК закомментировать 
if, else
*/

// ========================================================================================================================
// Slider-main

// let gold = document.querySelector(".slider-main__li_gold");
// let car = document.querySelector(".slider-main__li_car");
// let technic = document.querySelector(".slider-main__li_technic");
// let furs = document.querySelector(".slider-main__li_furs");
let goldText = document.querySelector(".slider-main__info_gold");
let carText = document.querySelector(".slider-main__info_car");
let technicText = document.querySelector(".slider-main__info_technic");
let fursText = document.querySelector(".slider-main__info_furs");

let dotGold = document.querySelector(".slider-main__li_gold");
let dotCar = document.querySelector(".slider-main__li_car");
let dotTechnic = document.querySelector(".slider-main__li_technic");
let dotFurs = document.querySelector(".slider-main__li_furs");

let goldImage = document.querySelector(".slider-main__item_gold");
let carImage = document.querySelector(".slider-main__item_car");
let technicImage = document.querySelector(".slider-main__item_technic");
let fursImage = document.querySelector(".slider-main__item_furs");

dotGold.addEventListener("click", function(){
  dotCar.classList.remove("active");
  dotTechnic.classList.remove("active");
  dotFurs.classList.remove("active");
  dotGold.classList.add("active");
  goldText.classList.add("active");
  carText.classList.remove("active");
  goldImage.classList.add("active");
  carImage.classList.remove("active");
});
dotCar.addEventListener("click", function(){
  dotGold.classList.remove("active");
  dotTechnic.classList.remove("active");
  dotFurs.classList.remove("active");
  dotCar.classList.add("active");
  carText.classList.add("active");
  goldText.classList.remove("active");
  goldImage.classList.remove("active");
  carImage.classList.add("active");
});
dotTechnic.addEventListener("click", function(){
  dotGold.classList.remove("active");
  dotCar.classList.remove("active");
  dotFurs.classList.remove("active");
  dotTechnic.classList.add("active");
});
dotFurs.addEventListener("click", function(){
  dotGold.classList.remove("active");
  dotCar.classList.remove("active");
  dotTechnic.classList.remove("active");
  dotFurs.classList.add("active");
});