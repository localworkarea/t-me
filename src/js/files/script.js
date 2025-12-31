import {
  isMobile, menuInit, lenis, getHash
} from "./functions.js";
// Підключення списку активних модулів
import {
  flsModules
} from "./modules.js";
import { gotoBlock } from "../files/scroll/gotoblock.js";
import { pageNavigation } from "../files/scroll/scroll.js";


import SplitType from 'split-type'


gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);



// убрать lock body на главной странице
// .lock-body на <html> при загрузке задает position fixed чтобы убрать скролл страницы на время загрузки.
const heroSection = document.querySelector('.hero');
if (heroSection) {
  function checkAndScrollToTop() {
    const heroRect = heroSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (heroRect.top <= viewportHeight / 2 && heroRect.bottom >= viewportHeight / 2) {
      setTimeout(() => {
        document.documentElement.classList.remove('lock-body');
        document.body.style.paddingRight = '';
        document.querySelector('.hero').style.paddingRight = '';
      }, 0);
      
    } else {
      document.documentElement.classList.remove('lock-body');
      document.body.style.paddingRight = '';
      document.querySelector('.hero').style.paddingRight = '';
    }
  }
  
  window.addEventListener("load", function () {
    setTimeout(function () {
      checkAndScrollToTop();
    }, 0);
  });
}



let splitInstances = [];

function destroySplitType() {
  splitInstances.forEach(instance => instance.revert());
  splitInstances = [];
}

function initSplitType() {
  destroySplitType();

  document.querySelectorAll('.split-lines').forEach(el => {
    splitInstances.push(
      new SplitType(el, { types: 'lines' })
    );
  });

  document.querySelectorAll('.split-words').forEach(el => {
    const instance = new SplitType(el, { types: 'words' });
    splitInstances.push(instance);

    el.querySelectorAll('.word').forEach((word, i) => {
      word.style.setProperty('--index', i);
    });
  });

  document.querySelectorAll('.split-chars').forEach(el => {
    const instance = new SplitType(el, { types: 'chars' });
    splitInstances.push(instance);

    el.querySelectorAll('.char').forEach((char, i) => {
      char.style.setProperty('--index', i);
    });
  });

  document.querySelectorAll('.split-both').forEach(el => {
    const instance = new SplitType(el, { types: 'lines, words' });
    splitInstances.push(instance);

    el.querySelectorAll('.word').forEach((word, i) => {
      word.style.setProperty('--index', i);
    });
  });

  document.querySelectorAll('.split-words.set-span').forEach(el => {
    el.querySelectorAll('.word').forEach(word => {
      const text = word.textContent.trim();
      word.innerHTML = `<span class="word-span">${text}</span>`;
    });
  });
}



let mm = gsap.matchMedia();

const heroContainer = document.querySelector('.hero__container');
const parentTxtMainSections = document.querySelectorAll('.parent-txt-main');
const parentTxtMainSections2 = document.querySelectorAll('.parent-txt-main-2');
const parentTxtMainSections3 = document.querySelector('.team__text');

const roadmapSection = document.querySelector('.roadmap__container');
const roadmapItems = document.querySelectorAll('.roadmap__item');

function createAnimation() {

   mm.revert();

  if (heroSection) {
    gsap.to(heroContainer, {
      yPercent: -30,
      opacity: 0,
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

    });

  }

  // if (roadmapSection) {
  //   roadmapItems.forEach((item1) => {
  //     gsap.to(item1, {
  //       y: 0,
  //       opacity: 1,
  //       // ease: "none",
  //       scrollTrigger: {
  //         trigger: roadmapSection,
  //         start: "top center",
  //         end: "top bottom",
  //         scrub: true,
  //         markers: true,
  //       }
  //     });
  //   });
  // }




  if (parentTxtMainSections2.length > 0) {
    parentTxtMainSections2.forEach((section) => {
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
              start: "top 80%",
              end: "top 10%",
              scrub: true,
              // markers: true,
            },
          });
        }
      }

    });

  }

  if (parentTxtMainSections3) {
    const words = parentTxtMainSections3.querySelectorAll('.word-span');
    if (words.length > 0) {
      gsap.to(words, {
        y: "-8%",
        // opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: parentTxtMainSections3,
          start: "top 80%",
          end: "top 10%",
          scrub: true,
          // markers: true,
        },
      });
    }
  }


   mm.add({
    desktop: "(min-width: 37.5em)",
    mobile: "(max-width: 37.5em)"
  }, context => {

    if (context.conditions.desktop) {
      initDesktopAnimations();
    }

    if (context.conditions.mobile) {
      // mobile logic
    }

  });

    // roadmap — САМЫЙ ПОСЛЕДНИЙ
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initRoadmapAnimation();
      ScrollTrigger.refresh(true);
    });
  });

}


// function initRoadmapAnimation() {
//   if (!roadmapSection) return;

//   roadmapItems.forEach(item => {
//     gsap.to(item, {
//       y: 0,
//       opacity: 1,
//       scrollTrigger: {
//         trigger: roadmapSection,
//         start: "top center",
//         end: "top top",
//         scrub: true,
//         // markers: true,
//       }
//     });
//   });
// }
function initRoadmapAnimation() {
  if (!roadmapSection) return;

  gsap.set(roadmapItems, {
    opacity: 0,
    yPercent: (i) => 20 + i * 25,
  });

  roadmapItems.forEach(item => {
    gsap.to(item, {
      yPercent: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: roadmapSection,
        start: "top center",
        end: "top top",
        scrub: true,
      }
    });
  });
}



function initDesktopAnimations() {

    const servixeHome = document.querySelector('.services-home');
    const servixeHomecontainer = document.querySelector('.services-home__container');
    const servixeHomeItems = document.querySelectorAll('.services-home__item');

   if (servixeHome) {
        let maxHeight = 0;
        servixeHomeItems.forEach(item => {
          const itemHeight = item.offsetHeight;
          if (itemHeight > maxHeight) maxHeight = itemHeight;
        });
        servixeHomecontainer.style.setProperty('--heightEl', `${maxHeight}px`);

        const lastIndex = servixeHomeItems.length - 1;
        const speedFactor = 1.5;

        const pinEnd = () => `${(lastIndex - 0.9 + 1) * (window.innerHeight / speedFactor)}px`;

        ScrollTrigger.create({
          trigger: servixeHome,
          start: "top top",
          end: pinEnd,
          pin: servixeHomecontainer,
          scrub: true,
        });

        servixeHomeItems.forEach((item, i) => {
          gsap.to(item, {
            y: 0,
            scrollTrigger: {
              trigger: servixeHome,
              start: () => `top+=${(i - 0.9) * (window.innerHeight / speedFactor)}px`,
              end: () => `top+=${(i - 0) * (window.innerHeight / speedFactor)}px`,
              scrub: true,
              // markers: true,
            }
          });

          if (i > 0) {
            const prevItem = servixeHomeItems[i - 1];

            gsap.to(prevItem, {
              opacity: 0,
              scrollTrigger: {
                trigger: servixeHome,
                start: () => `top+=${(i - 1) * (window.innerHeight / speedFactor)}px`,
                end: () => `top+=${i * (window.innerHeight / speedFactor)}px`,
                scrub: true,
                // markers: true,
              }
            });
          }
        });
      }


      const casesSection = document.querySelector('.cases-home');
      const casesWrapper = casesSection ?.querySelector('.cases-home__content');
      const scrollWrapper = casesWrapper ?.querySelector('.cases-home__scroll');
      const list = scrollWrapper ?.querySelector('.cases-home__list');
      const items = list ?.querySelectorAll('.cases-home__item');

      if (casesSection && scrollWrapper && list && items.length > 0) {
        const style = window.getComputedStyle(scrollWrapper);
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        const paddingRight = parseFloat(style.paddingRight) || 0;
        const totalPadding = paddingLeft + paddingRight;

        const scrollTween = gsap.to(list, {
          x: () => -(list.scrollWidth - scrollWrapper.clientWidth + totalPadding),
          ease: "none",
          scrollTrigger: {
            trigger: casesSection,
            start: "top 50px",
            end: () => `+=${(list.scrollWidth - scrollWrapper.clientWidth + totalPadding)/1.5}`,
            scrub: true,
            pin: casesWrapper,
            // anticipatePin: true,
            // markers: true,
          }
        });
      }

      const blogSection = document.querySelector('.blog-home');
      const blogWrapper = blogSection ?.querySelector('.blog-home__content');
      const scrollWrapper2 = blogWrapper ?.querySelector('.blog-home__scroll');
      const list2 = scrollWrapper2 ?.querySelector('.blog-home__list');
      const items2 = list2 ?.querySelectorAll('.blog-home__item');

      if (blogSection && blogWrapper && scrollWrapper2 && list2 && items2.length > 0) {
        const style2 = window.getComputedStyle(scrollWrapper2);
        const paddingLeft2 = parseFloat(style2.paddingLeft) || 0;
        const paddingRight2 = parseFloat(style2.paddingRight) || 0;
        const totalPadding2 = paddingLeft2 + paddingRight2;

        const scrollDistance = list2.scrollWidth - scrollWrapper2.clientWidth + totalPadding2;

        gsap.to(list2, {
          x: () => `-${scrollDistance}px`,
          ease: "none",
          scrollTrigger: {
            trigger: blogSection,
            start: "top 30px",
            end: () => `+=${scrollDistance/1.5}`,
            scrub: true,
            pin: blogWrapper,
            // markers: true,
          }
        });
      }
}


let resizeTimeout;
let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const currentWidth = window.innerWidth;
    if (currentWidth === lastWidth) return;

    lastWidth = currentWidth;

    initSplitType();
    createAnimation();
    ScrollTrigger.refresh(true);

  }, 250);
});


initSplitType();
window.addEventListener('load', () => {
  createAnimation();
  ScrollTrigger.refresh(true);

  setTimeout(() => {
    const hash = getHash();
    if (!hash) return;

    let selector = null;
    if (document.querySelector(`#${hash}`)) selector = `#${hash}`;
    else if (document.querySelector(`.${hash}`)) selector = `.${hash}`;

    if (!selector) return;

    ScrollTrigger.refresh(true);

    setTimeout(() => {
      gotoBlock(selector, false, 1000, 20);
    }, 100);

  }, 0);
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

document.addEventListener('DOMContentLoaded', () => {
  const flyForm = document.querySelector('.fly-form');
  const toggleBtn = flyForm?.querySelector('.fly-form__btn');
  const SCROLL_THRESHOLD = 200; // порог скролла

  if (!flyForm || !toggleBtn) return;

  // === Открытие/закрытие по кнопке ===
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    flyForm.classList.toggle('_active-fly-form');
  });

  // === Клик вне формы — закрыть ===
  document.addEventListener('click', (e) => {
    if (
      flyForm.classList.contains('_active-fly-form') &&
      !e.target.closest('.fly-form__content') &&
      !e.target.closest('.fly-form__btn')
    ) {
      flyForm.classList.remove('_active-fly-form');
    }
  });

  // === Закрытие по ESC ===
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && flyForm.classList.contains('_active-fly-form')) {
      flyForm.classList.remove('_active-fly-form');
    }
  });

  // === Отслеживание прокрутки ===
  function checkScrollPosition() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      flyForm.classList.add('_scroll-dwn');
    } else {
      flyForm.classList.remove('_scroll-dwn');
    }
  }

  // Проверяем при загрузке и при скролле
  checkScrollPosition();
  window.addEventListener('scroll', checkScrollPosition);
});
