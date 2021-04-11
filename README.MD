```html
<div class="custom-select">
	<input type="text" class="custom-select__input" required placeholder="Placeholder">
	<div class="custom-select__message custom-select__message_hide"></div>
	<div class="custom-select__dropdown-wrap custom-select__dropdown-wrap_hide">
		<div class="custom-select__dropdown">
			//items
			<span class="custom-select__item">Value 1</span>
			<span data-selected='true' class="custom-select__item">Value 2</span>
		</div>
	</div>
</div>
```

```JavaScript
const settings = {
    showOptions: 10,
    highlight: true
}
```

```JavaScript
//return element
const select = new Select(settings);
```

```JavaScript
//return Array elements
const select = Select.some(settings);
```