//ф-ция принимает два аргумента тип и массив значений, который перебираем и возвращем тип каждого значения массива который совпадет с type
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

//находим все дивы с классом .dialog__response-block и из nodelist преобразуем в массив, далее перебираем полученный массив и каждый эл-т скрываем
	hideAllResponseBlocks = () => {
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},
//ф-ция принимает 3 аргумента: селектор, сообщение, селектор span.
//Получается что если blockSelector передан при вызове ф-ции тогда мы показываем соотвествующий блок и выводим сообщение msgText, если оно было передано в аргументах
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		hideAllResponseBlocks();
		document.querySelector(blockSelector).style.display = 'block';
		if (spanSelector) {
			document.querySelector(spanSelector).textContent = msgText;
		}
	},
//ф-ция которая показывает ошибку
//внутри этой ф-ции вызываем showResponseBlock с необходимыми аргументами
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),
//выводим результат 
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),
//вывод "ни чего не показывать" если данных нет
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

//передаем type и values из обработчика событий где была вызвана текущая ф-ция с аргументами (typeInput.value.trim(), dataInput.value.trim())
//далее в eval выполняем самую первую строку кода где возвращаем тип в зависимости от выбранного селекта и введенного значения в поле данные
//а так как в первой строке у нас работа с массивом, то с помощью метода join мы переводим его в строку по заданному делителю
//далее если у нас строка есть, тогда выводим данные с типом ${type}: ${valuesArray}` иначе выводим что данные отсутствуют
	tryFilterByType = (type, values) => {
		try {
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");//eval выполнение строки кода
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;
			showResults(alertMsg);
		} catch (e) {
			showError(`Ошибка: ${e}`);
		}
	};

const filterButton = document.querySelector('#filter-btn');
//вешаем обработчик на кнопку фильтровать
//если поле пустое при нажатии кнопки то выводим сообщение Поле не должно быть пустым!и запускаем ф-цию с полем нечего показывать
//иначе при передаче в метод setCustomValidity() пустой строки мы снова dataInput возвращаем к валидному состоянию и запускаем ф-цию tryFilterByType с переданными значениями
filterButton.addEventListener('click', e => {
	const typeInput = document.querySelector('#type');
	const dataInput = document.querySelector('#data');

	if (dataInput.value === '') {
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		showNoResults();
	} else {
		dataInput.setCustomValidity('');
		e.preventDefault();//отменяем отправку формы
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});
