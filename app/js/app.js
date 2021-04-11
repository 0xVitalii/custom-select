
class Select {
	constructor(settings) {
		this.selector = '.custom-select';
		this.showOptions = 10;
		Object.assign(this, settings);
		let selectedFlag = false;

		if (!this.el)
			this.el = document.querySelector(this.selector);

		this.input = this.el.querySelector(`${this.selector}__input`);
		this._message = this.el.querySelector(`${this.selector}__message`);
		this.dropdown = this.el.querySelector(`${this.selector}__dropdown`);
		this.dropdownWrap = this.el.querySelector(`${this.selector}__dropdown-wrap`);
		this.items = this.el.querySelectorAll(`${this.selector}__item`);

		this.transition = getComputedStyle(this.dropdownWrap).transitionDuration.slice(0, -1) * 1000;
		this.required = this.input.required;
		this.visibleItems = this.el.querySelectorAll(':not(.custom-select__item_hide)')

		this.input.addEventListener('input', this._inputEvent.bind(this));
		this.input.addEventListener('focus', this._focusEvent.bind(this));
		this.input.addEventListener('blur', this._blurEvent.bind(this));
		this.input.addEventListener('keydown', this._enterEvent.bind(this));


		this.itemActive = undefined;
		this.itemValues = [];

		//Если поле required тогда показать звездочку
		this.required && this.el.classList.add(`${this.selector.slice(1)}__required`);

		this._dropDownHeight();

		for (const item of this.items) {
			const value = item.innerHTML;
			item.dataset.val = value;
			item.addEventListener('mousedown', this._itemSelected.bind(this));
			this.itemValues.push(value.toLowerCase())

			if (!selectedFlag && item.dataset.selected == 'true') {
				selectedFlag = true;
				this.input.value = value;
				this.itemActive = item;
				item.classList.add(`${this.selector.slice(1)}__item_active`);
			}
		}
	}

	_blurEvent() {
		this.dropdownWrap.classList.add(`${this.selector.slice(1)}__dropdown-wrap_hide`);
		this._itemsReset();
		this.isValid;
	}

	_focusEvent(event) {
		this.highlight && event.target.select()
		this.dropdownWrap.classList.remove(`${this.selector.slice(1)}__dropdown-wrap_hide`);
		this._dropDownHeight()
	}

	_inputEvent(event) {
		const self = event.target;
		const value = self.value.toLowerCase();
		const length = value.length;
		let index = -1;

		for (const item of this.items) {
			const dataset = item.dataset.val;

			index = dataset.toLowerCase().indexOf(value, 0);
			if (index == -1) {
				item.classList.add(`${this.selector.slice(1)}__item_hide`);
			}
			else {
				item.classList.remove(`${this.selector.slice(1)}__item_hide`);

				item.innerHTML = `
				${dataset.slice(0, index)}
				<i class="${this.selector.slice(1)}__marker">${dataset.slice(index, index + length)}</i>
				${dataset.slice(index + length)}
				`;
			}
		}
		this.dropdownWrap.classList.remove(`${this.selector.slice(1)}__dropdown-wrap_hide`);
		this._dropDownHeight();
		this.visibleItems = this.el.querySelectorAll('.custom-select__item:not(.custom-select__item_hide)');

	}

	_enterEvent(event) {

		if (event.keyCode == 13) {
			const blur = new Event("blur", { bubbles: true, cancelable: true });
			const click = new Event("click", { bubbles: true, cancelable: true });

			const value = event.target.value.toLowerCase();
			for (const item of this.items)
				if (item.dataset.val.toLowerCase() == value) {
					item.dispatchEvent(click);
					break;
				}
			this.input.dispatchEvent(blur);
		}
	}

	_dropDownHeight() {
		const itemHeight = +getComputedStyle(this.items[0]).height.slice(0, -2);
		let itemsLength = 0;

		for (const item of this.items)
			if (getComputedStyle(item).display != 'none')
				itemsLength++;

		if (itemsLength > this.showOptions) {
			this.dropdownWrap.style.height = `${itemHeight * this.showOptions}px`;
			this.dropdown.style.overflowY = 'scroll';
		} else {
			this.dropdownWrap.style.height = `${(itemHeight * itemsLength) + 1}px`;
			this.dropdown.style.overflowY = 'hidden';
		}

		if (!itemsLength) {
			this.dropdownWrap.classList.add(`${this.selector.slice(1)}__dropdown-wrap_hide`);
		}
	}

	_itemSelected(event) {
		const self = event.target;
		this.input.value = self.dataset.val;
		this.itemActive && this.itemActive.classList.remove(`${this.selector.slice(1)}__item_active`);
		this.itemActive = self;
		self.classList.add(`${this.selector.slice(1)}__item_active`);

		this._itemsReset();
		this.isValid;
	}

	_itemsReset() {
		for (const item of this.items) {
			item.classList.remove(`${this.selector.slice(1)}__item_hide`);
			item.innerHTML = item.dataset.val;
		}

		this._dropDownHeight()
	}

	_errOn(message) {
		this._message.classList.remove('custom-select__message_hide');
		this.el.classList.add('custom-select_error-border');
		this.errorMessage = message;
	}

	_errOff() {
		this._message.classList.add('custom-select__message_hide');
		this.el.classList.remove('custom-select_error-border');
	}

	get isValid() {
		const inputVal = this.input.value.toLowerCase();
		if (!inputVal && this.required) {
			this._errOn('Обязательно для заполнения');
			return false;
		} else {
			this._errOff();
		}

		for (const itemVal of this.itemValues)
			if (inputVal == itemVal) {
				this._errOff();
				return true;
			}
			else if (inputVal && inputVal != itemVal) {
				this._errOn('Выберите из списка');
			}
		return false;
	}

	set errorMessage(val) {
		this._message.innerText = val;
	}

	static some(settings) {
		const result = [];

		const elements = document.querySelectorAll('.custom-select');
		for (const element of elements) {
			settings.el = element
			result.push(new Select(settings))
		}

		return result;
	}
}

document.addEventListener('DOMContentLoaded', () => {

	let selects = Select.some({
		showOptions: 10,
		highlight: true
	});
})
