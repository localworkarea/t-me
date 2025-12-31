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
window.addEventListener('resize', () => {
  const currentWidth = window.innerWidth;

  if (currentWidth !== lastWidth) {
    initSplitType();
    ScrollTrigger.refresh();
    lastWidth = currentWidth;
  }
});


ScrollTrigger.refresh();



const heroContainer = document.querySelector('.hero__container');
const parentTxtMainSections = document.querySelectorAll('.parent-txt-main');
const parentTxtMainSections2 = document.querySelectorAll('.parent-txt-main-2');
const parentTxtMainSections3 = document.querySelector('.team__text');

const roadmapSection = document.querySelector('.roadmap__container');
const roadmapItems = document.querySelectorAll('.roadmap__item');



function createAnimation() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

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


  let mm = gsap.matchMedia();
  mm.add({
    min600: "(min-width:37.5em)",
    max600: "(max-width:37.5em)",
  }, (context) => {

    let {
      min600,
      max600
    } = context.conditions;

    const servixeHome = document.querySelector('.services-home');
    const servixeHomecontainer = document.querySelector('.services-home__container');
    const servixeHomeItems = document.querySelectorAll('.services-home__item');

    if (min600) {
      // === SERVICES-HOME АНИМАЦИЯ ===

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

        // items.forEach((item) => {
        //   gsap.to(item, {
        //     // opacity: 1,
        //     scale: 1,
        //     // y: 0,
        //     scrollTrigger: {
        //       trigger: item,
        //       containerAnimation: scrollTween,
        //       start: "left center",
        //       end: "center top",
        //       scrub: true,
        //       markers: true,
        //     }
        //   });
        // });
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

    if (max600) {


    }

  }); // end match media ----------------------------------------



  if (roadmapSection) {
    roadmapItems.forEach((item1) => {
      gsap.to(item1, {
        y: 0,
        opacity: 1,
        // ease: "none",
        scrollTrigger: {
          trigger: roadmapSection,
          start: "top center",
          end: "top top",
          scrub: true,
          // markers: true,
        }
      });
    });
  }



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

  setTimeout(() => {
  const hash = getHash();
  if (hash) {
    let selector;
    if (document.querySelector(`#${hash}`)) {
      selector = `#${hash}`;
    } else if (document.querySelector(`.${hash}`)) {
      selector = `.${hash}`;
    }

    if (selector) {
      ScrollTrigger.refresh(); 

      // И после refresh — запускаем goto
      setTimeout(() => {
        gotoBlock(selector, false, 1000, 20);
      }, 100); // можно 0-200 мс
    }
  }
}, 0);

