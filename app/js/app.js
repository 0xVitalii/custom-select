
class Select {
	constructor(settings) {
		this.selector = '.custom-selector';
		this.showOptions = 10;
		Object.assign(this, settings);
		let selectedFlag = false;

		this.el = document.querySelector(settings.selector);
		this.input = this.el.querySelector(`${settings.selector}__input`);
		this.dropdown = this.el.querySelector(`${settings.selector}__dropdown`);
		this.dropdownWrap = this.el.querySelector(`${settings.selector}__dropdown-wrap`);
		this.items = this.el.querySelectorAll(`${settings.selector}__item`);
		this.required = this.input.required;
		this.transition = getComputedStyle(this.dropdownWrap).transitionDuration.slice(0, -1) * 1000;

		this.input.addEventListener('input', this._inputEvent.bind(this));
		this.input.addEventListener('focus', this._focusEvent.bind(this));
		this.input.addEventListener('blur', this._blurEvent.bind(this));

		this.itemActive = undefined;
		this.itemValues = [];

		this._dropDownHeight();

		for (const item of this.items) {
			const value = item.innerHTML;
			item.dataset.val = value;
			item.addEventListener('click', this._itemSelected.bind(this));
			this.itemValues.push(value.toLowerCase())

			if (!selectedFlag && item.dataset.selected == 'true') {
				selectedFlag = true;
				this.input.value = value;
				this.itemActive = item;
				item.classList.add(`${this.selector.slice(1)}__item_active`);
			}
		}
	}

	_blurEvent(event) {
		this.dropdownWrap.classList.add('custom-select__dropdown-wrap_hide');
		this.el.classList.remove('custom-select_active');
		setTimeout(this._itemsReset.bind(this), this.transition)
	}

	_focusEvent(event) {
		const self = event.target;
		self.select()
		this.dropdownWrap.classList.remove('custom-select__dropdown-wrap_hide');
		this.el.classList.add('custom-select_active');
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
				item.classList.add('custom-select__item_hide');
			}
			else {
				item.classList.remove('custom-select__item_hide');

				item.innerHTML = `
				${dataset.slice(0, index)}
				<i class="${this.selector.slice(1)}__marker">${dataset.slice(index, index + length)}</i>
				${dataset.slice(index + length)}
				`;
			}
		}
		this.dropdownWrap.classList.remove('custom-select__dropdown-wrap_hide');
		this.el.classList.add('custom-select_active');
		this._dropDownHeight();
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
		}
		else {
			this.dropdownWrap.style.height = `${(itemHeight * itemsLength) + 1}px`;
			this.dropdown.style.overflowY = 'hidden';
		}

		if (!itemsLength) {
			this.dropdownWrap.classList.add('custom-select__dropdown-wrap_hide');
			this.el.classList.remove('custom-select_active');
		}
	}

	_itemSelected(event) {
		const self = event.target;
		this.input.value = self.dataset.val;
		this.itemActive && this.itemActive.classList.remove(`${this.selector.slice(1)}__item_active`);
		this.itemActive = self;
		self.classList.add(`${this.selector.slice(1)}__item_active`);

		this._itemsReset();
	}

	_itemsReset() {
		for (const item of this.items) {
			item.classList.remove(`${this.selector.slice(1)}__item_hide`);
			item.innerHTML = item.dataset.val;
		}

		this._dropDownHeight()
	}

	get isValid() {
		let flag = false;
		const inputVal = this.input.value.toLowerCase();
		if(!inputVal) return false;

		for (const itemVal of this.itemValues)
			if (inputVal == itemVal) return true;
		return false;
	}
}

document.addEventListener('DOMContentLoaded', () => {

	let select = new Select({
		selector: '.custom-select',
		showOptions: 10
	});

	document.querySelector('#ee').addEventListener('click', event => console.log(select.isValid))
})
