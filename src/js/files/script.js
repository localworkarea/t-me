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
const heroSection = document.querySelector('.hero');

function checkAndScrollToTop() {
  const heroRect = heroSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  if (heroRect.top <= viewportHeight / 2 && heroRect.bottom >= viewportHeight / 2) {
    setTimeout(() => {
      document.documentElement.classList.remove('lock-body');
    }, 0);

  } else {
    document.documentElement.classList.remove('lock-body');
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

let lastWidth = window.innerWidth;
const resizeObserver = new ResizeObserver(entries => {
  requestAnimationFrame(() => {
    entries.forEach(entry => {
      const currentWidth = entry.contentRect.width;
      // Запускаем initSplitType() только если изменилась ширина
      if (currentWidth !== lastWidth) {
        initSplitType();
        lastWidth = currentWidth; // Обновляем lastWidth
      }
    });
  });
});
// Наблюдаем за изменениями в элементе body
resizeObserver.observe(document.body);

// =======================================================================




document.addEventListener("DOMContentLoaded", () => {
  ScrollTrigger.refresh();

  const heroSection = document.querySelector('.hero');
  const heroContainer = document.querySelector('.hero__container');

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
  }

  createAnimation();

  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;

    if (currentWidth !== lastWidth) {
      setTimeout(() => {
        createAnimation();
      }, 300);
      ScrollTrigger.refresh();
      lastWidth = currentWidth;
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