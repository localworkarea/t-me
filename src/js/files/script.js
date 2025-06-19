import {
  isMobile
} from "./functions.js";
// Підключення списку активних модулів
import {
  flsModules
} from "./modules.js";

import Lenis from 'lenis'
// npm i lenis

import SplitType from 'split-type'
// npm i split-type

// === ПЛАВНАЯ ПРОКРУТКА ЧЕРЕЗ LENIS =============================
const lenis = new Lenis({
  // smooth: true,          // Включает плавный скролл
  // smoothTouch: true,     // Включает плавный скролл на мобильных устройствах
  lerp: 0.06, // Определяет инерцию (чем ближе к 1, тем медленнее скролл)
  // direction: 'vertical', // Задаёт направление скролла: 'vertical' или 'horizontal'
  // mouseMultiplier: 2, // Чувствительность прокрутки мыши (увеличивайте, чтобы сделать скролл быстрее)
})

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);



// убрать lock body на главной странице
// .lock-body на <html> при загрузке задает position fixed чтобы убрать скролл страницы на время загрузки.





document.addEventListener("DOMContentLoaded", () => {
  ScrollTrigger.refresh();



  const heroSection = document.querySelector('.hero');

  function checkAndScrollToTop() {
    const heroRect = heroSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (heroRect.top <= viewportHeight / 2 && heroRect.bottom >= viewportHeight / 2) {
      setTimeout(() => {
        document.documentElement.classList.remove('lock-body');
        document.body.style.paddingRight = '';
      }, 0);

    } else {
      document.documentElement.classList.remove('lock-body');
      document.body.style.paddingRight = '';
    }
  }

  window.addEventListener("load", function () {
    setTimeout(function () {
      checkAndScrollToTop();
    }, 0);
  });





  const splitTextLines = document.querySelectorAll('.split-lines');
  const splitTextWords = document.querySelectorAll('.split-words');
  const splitTextChars = document.querySelectorAll('.split-chars');
  const splitTextBoth = document.querySelectorAll('.split-both');
  const splitSetSpan = document.querySelectorAll('.split-words.set-span');

  function initSplitType() {
    // Если существуют элементы с классом .split-lines
    if (splitTextLines.length > 0) {
      splitTextLines.forEach(element => {
        new SplitType(element, {
          types: 'lines'
        });
      });
    }

    // Если существуют элементы с классом .split-words
    if (splitTextWords.length > 0) {
      splitTextWords.forEach(element => {
        new SplitType(element, {
          types: 'words'
        });

        // Проставляем индексы для всех слов
        const words = element.querySelectorAll('.word');
        words.forEach((word, index) => {
          word.style.setProperty('--index', index);
        });
      });
    }

    // Если существуют элементы с классом .split-chars
    if (splitTextChars.length > 0) {
      splitTextChars.forEach(element => {
        new SplitType(element, {
          types: 'chars'
        });

        const chars = element.querySelectorAll('.char');
        chars.forEach((char, index) => {
          char.style.setProperty('--index', index);
        });
      });
    }

    // Если существуют элементы с классом .split-both
    if (splitTextBoth.length > 0) {
      splitTextBoth.forEach(element => {
        new SplitType(element, {
          types: 'lines, words'
        });

        // Проставляем индексы для всех слов
        const words = element.querySelectorAll('.word');
        words.forEach((word, index) => {
          word.style.setProperty('--index', index);
        });
      });
    }

    // Добавляем <span> для каждого слова внутри .split-words.set-span
    if (splitSetSpan.length > 0) {
      splitSetSpan.forEach(splitSetSpan => {
        const words = splitSetSpan.querySelectorAll('.word');

        words.forEach(word => {
          const text = word.textContent.trim();
          word.innerHTML = `<span class="word-span">${text}</span>`;
        });
      });
    }
  }

  // Инициализация SplitType при загрузке
  initSplitType();

  const heroContainer = document.querySelector('.hero__container');
  const parentTxtMainSections = document.querySelectorAll('.parent-txt-main');



  function createAnimation() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    if (heroSection) {
      gsap.to(heroContainer, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    if (parentTxtMainSections.length > 0) {
      parentTxtMainSections.forEach((section) => {
        const txt = section.querySelector('.txt-main');
        if (txt) {
          const words = txt.querySelectorAll('.word');
          if (words.length > 0) {
            gsap.to(words, {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "35% bottom",
                end: "top 10%",
                scrub: true,
                // markers: true,
              },
            });
          }
        }

        // === SERVICES-HOME АНИМАЦИЯ ===
        const servixeHomecontainer = section.querySelector('.services-home__container');
        const servixeHomeList = section.querySelector('.services-home__list');
        const servixeHomeItems = section.querySelectorAll('.services-home__item');

        if (servixeHomecontainer && servixeHomeList && servixeHomeItems.length > 0) {
          // Вычисляем максимальную высоту
          let maxHeight = 0;
          servixeHomeItems.forEach(item => {
            const itemHeight = item.offsetHeight;
            if (itemHeight > maxHeight) maxHeight = itemHeight;
          });
          // Присваиваем переменную --heightEl в px
          servixeHomecontainer.style.setProperty('--heightEl', `${maxHeight}px`);

          // Пин всей секции
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            // end: () => `+=${servixeHomeItems.length * 100}%`, // длина прокрутки — по количеству айтемов
            end: () => `${(servixeHomeItems.length - 0.8) * window.innerHeight}px`,
            pin: servixeHomecontainer,
            scrub: true,
            // anticipatePin: true,
            // markers: true,
          });

          // Наложение айтемов
          // servixeHomeItems.forEach((item, i) => {
          //   gsap.to(item, {
          //     y: 0,
          //     ease: "none",
          //     scrollTrigger: {
          //       trigger: section,
          //       start: () => `top+=${(i - 1) * window.innerHeight}px`,
          //       end: () => `top+=${(i + 0) * window.innerHeight}px`,
          //       scrub: true,
          //       // markers: true,
          //     }
          //   });
          // });
          servixeHomeItems.forEach((item, i) => {
            gsap.to(item, {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: () => `top+=${(i - 1) * window.innerHeight}px`,
                end: () => `top+=${i * window.innerHeight}px`,
                scrub: true,
                // markers: true,
              }
            });

            if (i > 0) {
              const prevItem = servixeHomeItems[i - 1];

              gsap.to(prevItem, {
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: () => `top+=${(i - 1) * window.innerHeight}px`, // когда анимация текущего айтема стартует
                  end: () => `top+=${i * window.innerHeight}px`,
                  scrub: true,
                  // markers: true,
                }
              });
            }
          });

        }
      });
    }
  }


  createAnimation();

  let lastWidth2 = window.innerWidth;
  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;

    if (currentWidth !== lastWidth2) {
      initSplitType();
      setTimeout(() => {
        createAnimation();
      }, 300);
      ScrollTrigger.refresh();
      lastWidth2 = currentWidth;
    }
  });
});


// Ticker =================================
const tickers = document.querySelectorAll("[data-ticker]");
if (tickers.length > 0) {
  tickers.forEach(ticker => {
    // Получаем скорость и направление из атрибутов data-ticker-speed и data-ticker-dir
    const speed = ticker.getAttribute("data-ticker-speed") || 80;
    const direction = ticker.getAttribute("data-ticker-dir") || "rtl";

    // Берем первый дочерний элемент тикера
    const firstChild = ticker.firstElementChild;
    if (firstChild) {
      // Клонируем первый элемент
      const clone = firstChild.cloneNode(true);

      // Предзагрузка всех изображений в клонированном элементе
      const images = clone.querySelectorAll("img");
      const promises = Array.from(images).map(img => {
        return new Promise(resolve => {
          const preloader = new Image();
          preloader.src = img.src;
          preloader.onload = resolve;
          preloader.onerror = resolve; // Разрешаем, даже если возникла ошибка загрузки
        });
      });

      // После предзагрузки изображений добавляем клонированный элемент и запускаем анимацию
      Promise.all(promises).then(() => {
        ticker.appendChild(clone);

        // Устанавливаем анимацию для всех дочерних элементов тикера
        Array.from(ticker.children).forEach(child => {
          const animationName = direction === "rtl" ? "scroll" : "scroll-rev";
          child.style.animation = `${animationName} ${speed}s linear infinite`;
        });
      });
    }
  });
}

// ====================================================