// Підключення списку активних модулів
import { flsModules } from "../modules.js";
// Допоміжні функції
import { isMobile, _slideUp, _slideDown, _slideToggle, FLS } from "../functions.js";
// Модуль прокручування до блоку
import { gotoBlock } from "../scroll/gotoblock.js";
//================================================================================================================================================================================================================================================================================================================================

/*
*/

// Робота із полями форми.
export function formFieldsInit(options = { viewPass: false, autoHeight: false }) {
document.body.addEventListener("focusin", function (e) {
		const targetElement = e.target;
		if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') {
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.add('_form-focus');
				targetElement.parentElement.classList.add('_form-focus');
			}
			// 👉 Добавляем _full, если уже есть значение
			if (targetElement.value.trim() !== '') {
				targetElement.classList.add('_full');
				targetElement.parentElement.classList.add('_full');
			}
			formValidate.removeError(targetElement);
			if (targetElement.hasAttribute('data-validate')) {
				formValidate.removeError(targetElement);
			}
		}
	});

	document.body.addEventListener("focusout", function (e) {
		const targetElement = e.target;
		if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') {
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.remove('_form-focus');
				targetElement.parentElement.classList.remove('_form-focus');
			}
			// 👉 Проверяем значение — добавляем/удаляем _full
			if (targetElement.value.trim() !== '') {
				targetElement.classList.add('_full');
				targetElement.parentElement.classList.add('_full');
			} else {
				targetElement.classList.remove('_full');
				targetElement.parentElement.classList.remove('_full');
			}
			if (targetElement.hasAttribute('data-validate')) {
				formValidate.validateInput(targetElement);
			}
		}
	});

	// // Якщо увімкнено, додаємо функціонал "Показати пароль"
	// if (options.viewPass) {
	// 	document.addEventListener("click", function (e) {
	// 		let targetElement = e.target;
	// 		if (targetElement.closest('[class*="__viewpass"]')) {
	// 			let inputType = targetElement.classList.contains('_viewpass-active') ? "password" : "text";
	// 			targetElement.parentElement.querySelector('input').setAttribute("type", inputType);
	// 			targetElement.classList.toggle('_viewpass-active');
	// 		}
	// 	});
	// }
	// // Якщо увімкнено, додаємо функціонал "Автовисота"
	// if (options.autoHeight) {
	// 	const textareas = document.querySelectorAll('textarea[data-autoheight]');
	// 	if (textareas.length) {
	// 		textareas.forEach(textarea => {
	// 			const startHeight = textarea.hasAttribute('data-autoheight-min') ?
	// 				Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
	// 			const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
	// 				Number(textarea.dataset.autoheightMax) : Infinity;
	// 			setHeight(textarea, Math.min(startHeight, maxHeight))
	// 			textarea.addEventListener('input', () => {
	// 				if (textarea.scrollHeight > startHeight) {
	// 					textarea.style.height = `auto`;
	// 					setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
	// 				}
	// 			});
	// 		});
	// 		function setHeight(textarea, height) {
	// 			textarea.style.height = `${height}px`;
	// 		}
	// 	}
	// }
}
// Валідація форм
export let formValidate = {
	// getErrors(form) {
	// 	let error = 0;
	// 	let formRequiredItems = form.querySelectorAll('*[data-required]');
	// 	if (formRequiredItems.length) {
	// 		formRequiredItems.forEach(formRequiredItem => {
	// 			if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
	// 				error += this.validateInput(formRequiredItem);
	// 			}
	// 		});
	// 	}
	// 	return error;
	// },
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.dataset.required === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			this.removeSuccess(formRequiredItem);
			error++;
		} else {
			if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add('_form-error');
		formRequiredItem.parentElement.classList.add('_form-error');
		let inputError = formRequiredItem.parentElement.querySelector('.form__error');
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.error) {
			formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
		}
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove('_form-error');
		formRequiredItem.parentElement.classList.remove('_form-error');
		if (formRequiredItem.parentElement.querySelector('.form__error')) {
			formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
		}
	},
	addSuccess(formRequiredItem) {
		formRequiredItem.classList.add('_form-success');
		formRequiredItem.parentElement.classList.add('_form-success');
	},
	removeSuccess(formRequiredItem) {
		formRequiredItem.classList.remove('_form-success');
		formRequiredItem.parentElement.classList.remove('_form-success');
	},
formClean(form) {
	form.reset();
	setTimeout(() => {
		let inputs = form.querySelectorAll('input,textarea');
		for (let index = 0; index < inputs.length; index++) {
			const el = inputs[index];
			el.parentElement.classList.remove('_form-focus');
			el.classList.remove('_form-focus');

			// ❗ Удаляем _full
			el.classList.remove('_full');
			el.parentElement.classList.remove('_full');

			formValidate.removeError(el);
		}

		let checkboxes = form.querySelectorAll('.checkbox__input');
		if (checkboxes.length > 0) {
			for (let index = 0; index < checkboxes.length; index++) {
				const checkbox = checkboxes[index];
				checkbox.checked = false;
			}
		}

		if (flsModules.select) {
			let selects = form.querySelectorAll('div.select');
			if (selects.length) {
				for (let index = 0; index < selects.length; index++) {
					const select = selects[index].querySelector('select');
					flsModules.select.selectBuild(select);
				}
			}
		}
	}, 0);
},

	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	}
}
/* Відправлення форм */
export function formSubmit() {
	const forms = document.forms;
	if (forms.length) {
		for (const form of forms) {
			form.addEventListener('submit', function (e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener('reset', function (e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
	}
	async function formSubmitAction(form, e) {
		// const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
		// if (error === 0) {
			const ajax = form.hasAttribute('data-ajax');
			if (ajax) { // Якщо режим ajax
				e.preventDefault();
				const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
				const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
				const formData = new FormData(form);

				form.classList.add('_sending');
				const response = await fetch(formAction, {
					method: formMethod,
					body: formData
				});
				if (response.ok) {
					let responseResult = await response.json();
					form.classList.remove('_sending');
					formSent(form, responseResult);
				} else {
					alert("Помилка");
					form.classList.remove('_sending');
				}
			} else if (form.hasAttribute('data-dev')) {	// Якщо режим розробки
				e.preventDefault();
				formSent(form);
			}
		// } else {
		// 	e.preventDefault();
		// 	// if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
		// 	// 	const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
		// 	// 	gotoBlock(formGoToErrorClass, true, 1000);
		// 	// }
		// }
	}
	// Дії після надсилання форми
	function formSent(form, responseResult = ``) {
		// Створюємо подію відправлення форми
		document.dispatchEvent(new CustomEvent("formSent", {
			detail: {
				form: form
			}
		}));
		// Показуємо попап, якщо підключено модуль попапів 
		// та для форми вказано налаштування
		// setTimeout(() => {
		// 	if (flsModules.popup) {
		// 		const popup = form.dataset.popupMessage;
		// 		popup ? flsModules.popup.open(popup) : null;
		// 	}
		// }, 0);

		document.scrollingElement.classList.add('form-sent');
		setTimeout(() => {
			document.scrollingElement.classList.remove('form-sent');
		}, 8000);
		
		// Очищуємо форму
		formValidate.formClean(form);
		// Повідомляємо до консолі
	}
	
}
/* Модуль форми "кількість" */
export function formQuantity() {
	document.addEventListener("click", function (e) {
		let targetElement = e.target;
		if (targetElement.closest('[data-quantity-plus]') || targetElement.closest('[data-quantity-minus]')) {
			const valueElement = targetElement.closest('[data-quantity]').querySelector('[data-quantity-value]');
			let value = parseInt(valueElement.value);
			if (targetElement.hasAttribute('data-quantity-plus')) {
				value++;
				if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) {
					value = valueElement.dataset.quantityMax;
				}
			} else {
				--value;
				if (+valueElement.dataset.quantityMin) {
					if (+valueElement.dataset.quantityMin > value) {
						value = valueElement.dataset.quantityMin;
					}
				} else if (value < 1) {
					value = 1;
				}
			}
			targetElement.closest('[data-quantity]').querySelector('[data-quantity-value]').value = value;
		}
	});
}

/*
export function formRating() {
	const ratings = document.querySelectorAll('.rating');
	if (ratings.length > 0) {
		initRatings();
	}
	// Основна функція
	function initRatings() {
		let ratingActive, ratingValue;
		// "Бігаємо" по всіх рейтингах на сторінці
		for (let index = 0; index < ratings.length; index++) {
			const rating = ratings[index];
			initRating(rating);
		}
		// Ініціалізуємо конкретний рейтинг
		function initRating(rating) {
			initRatingVars(rating);

			setRatingActiveWidth();

			if (rating.classList.contains('rating_set')) {
				setRating(rating);
			}
		}
		// Ініціалізація змінних
		function initRatingVars(rating) {
			ratingActive = rating.querySelector('.rating__active');
			ratingValue = rating.querySelector('.rating__value');
		}
		// Змінюємо ширину активних зірок
		function setRatingActiveWidth(index = ratingValue.innerHTML) {
			const ratingActiveWidth = index / 0.05;
			ratingActive.style.width = `${ratingActiveWidth}%`;
		}
		// Можливість вказати оцінку
		function setRating(rating) {
			const ratingItems = rating.querySelectorAll('.rating__item');
			for (let index = 0; index < ratingItems.length; index++) {
				const ratingItem = ratingItems[index];
				ratingItem.addEventListener("mouseenter", function (e) {
					// Оновлення змінних
					initRatingVars(rating);
					// Оновлення активних зірок
					setRatingActiveWidth(ratingItem.value);
				});
				ratingItem.addEventListener("mouseleave", function (e) {
					// Оновлення активних зірок
					setRatingActiveWidth();
				});
				ratingItem.addEventListener("click", function (e) {
					// Оновлення змінних
					initRatingVars(rating);

					if (rating.dataset.ajax) {
						// "Надіслати" на сервер
						setRatingValue(ratingItem.value, rating);
					} else {
						// Відобразити вказану оцінку
						ratingValue.innerHTML = index + 1;
						setRatingActiveWidth();
					}
				});
			}
		}
		async function setRatingValue(value, rating) {
			if (!rating.classList.contains('rating_sending')) {
				rating.classList.add('rating_sending');

				// Надсилання даних (value) на сервер
				let response = await fetch('rating.json', {
					method: 'GET',

					//body: JSON.stringify({
					//	userRating: value
					//}),
					//headers: {
					//	'content-type': 'application/json'
					//}

				});
				if (response.ok) {
					const result = await response.json();

					// Отримуємо новий рейтинг
					const newRating = result.newRating;

					// Виведення нового середнього результату
					ratingValue.innerHTML = newRating;

					// Оновлення активних зірок
					setRatingActiveWidth();

					rating.classList.remove('rating_sending');
				} else {
					alert("Помилка");

					rating.classList.remove('rating_sending');
				}
			}
		}
	}
}
*/

/* Модуль зіркового рейтингу */
export function formRating() {
	// Rating
	const ratings = document.querySelectorAll('[data-rating]');
	if (ratings) {
		ratings.forEach(rating => {
			const ratingValue = +rating.dataset.ratingValue
			const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5
			formRatingInit(rating, ratingSize)
			ratingValue ? formRatingSet(rating, ratingValue) : null
			document.addEventListener('click', formRatingAction)
		});
	}
	function formRatingAction(e) {
		const targetElement = e.target;
		if (targetElement.closest('.rating__input')) {
			const currentElement = targetElement.closest('.rating__input');
			const ratingValue = +currentElement.value
			const rating = currentElement.closest('.rating')
			const ratingSet = rating.dataset.rating === 'set'
			ratingSet ? formRatingGet(rating, ratingValue) : null;
		}
	}
	function formRatingInit(rating, ratingSize) {
		let ratingItems = ``;
		for (let index = 0; index < ratingSize; index++) {
			index === 0 ? ratingItems += `<div class="rating__items">` : null
			ratingItems += `
				<label class="rating__item">
					<input class="rating__input" type="radio" name="rating" value="${index + 1}">
				</label>`
			index === ratingSize ? ratingItems += `</div">` : null
		}
		rating.insertAdjacentHTML("beforeend", ratingItems)
	}
	function formRatingGet(rating, ratingValue) {
		// Тут відправка оцінки (ratingValue) на бекенд...
		// Отримуємо нову седню оцінку formRatingSend()
		// Або виводимо ту яку вказав користувач
		const resultRating = ratingValue;
		formRatingSet(rating, resultRating);
	}
	function formRatingSet(rating, value) {
		const ratingItems = rating.querySelectorAll('.rating__item');
		const resultFullItems = parseInt(value);
		const resultPartItem = value - resultFullItems;

		rating.hasAttribute('data-rating-title') ? rating.title = value : null

		ratingItems.forEach((ratingItem, index) => {
			ratingItem.classList.remove('rating__item--active');
			ratingItem.querySelector('span') ? ratingItems[index].querySelector('span').remove() : null;

			if (index <= (resultFullItems - 1)) {
				ratingItem.classList.add('rating__item--active');
			}
			if (index === resultFullItems && resultPartItem) {
				ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`)
			}
		});
	}
	function formRatingSend() {

	}

}

