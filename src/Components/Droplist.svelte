<script>
	// IMPORTS
	import { createEventDispatcher } from 'svelte';
	import Textfield from './Textfield.svelte';
	import Events from '../Utils/Events';
	
	// PUBLIC ATTRIBUTES
	export let value = "";
	export let disable = false;
	export let width = 290;
	export let iconLeft = "";
	export let label = "";
	export let errorMessage = "";
	export let required = false;
	export let readonly = false;
	export let cls = "";
	export let style = "";
	export let format = null;
	export let items = []; // Array of object [{label: '...', value: '...'}]
	export let render = null;
	export let filter = false;
	export let flex = false;

	export let textfieldCls = "";
	export let textfieldStyle = "";
	
	// PRIVATE ATTRIBUTES
	let type = "text";
	let input;
	let visible = false;
	let position = "bottom";
	let droplist;
	let filterValue;
	$: displayedItems = items;
	$: displayedValue = getLabel(value);

	// EVENTS
	const dispatch = createEventDispatcher();
	function onClickIcon (){
		if(visible) {
			close();
		} else {
			open();
		}
	}
	function onClickItem (evt){
		let pValue = evt.currentTarget.getAttribute('code');
		if(pValue == value) {
			displayedValue = getLabel(value);
		} else {
			value = pValue;
		}
		input.onChange(evt);
		close();
		focusIcon();
	}
	function focusIcon() {
		setTimeout(() => {
			input.getInput().parentElement.querySelector('.textfield-icon-right').focus();
		}, 100);
	}
	function onKeyUp(evt) {
		let event = evt.detail;
		if(Events.isArrowUp(event) || Events.isArrowDown(event)) {
			open();
		}
	}
	function onKeyUpFilter(evt) {
		displayedItems = items.filter(i => i.label.toLowerCase().includes(filterValue.toLowerCase()));
	}
	function onClick(evt) {
		if(!readonly) {
			open();
		}
	}
	function onChange(evt) {
		let params = Events.copy(evt.detail);
		params.value = value;
		dispatch('change', {
			...params
		});
	}
	function onBlur(evt){
		let i = items.find(item => (item.label || '').toLowerCase() == (displayedValue || '').toLowerCase());
		if(i) {
			value = i.value;
		} else {
				// Double change to trigger getLabel
			value = null;
			value = '';
		}
		let params = Events.copy(evt.detail);
		params.value = value;
		dispatch('blur', {
			...params
		});
	}
	function onKeyDownItem(event){
		if(Events.isEnter(event)){
			onClickItem(event);
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.preventDefault();
			event.stopPropagation();
		}
	}
	function onKeyUpItem(event){
		let pValue = event.currentTarget.getAttribute('code');
		let idx = displayedItems.findIndex(i => i.value == pValue);
		if(Events.isArrowUp(event)) {
			idx = idx == 0 ? displayedItems.length - 1 : idx - 1;
		} else if(Events.isArrowDown(event)) {
			idx = idx == displayedItems.length - 1 ? 0 : idx + 1;
		}
		let nextValue = displayedItems[idx].value;
		droplist.querySelector('li[code="' + nextValue + '"]').focus();
		event.preventDefault();
		event.stopPropagation();
	}
	function onFocusOut(event){
		if (!event.currentTarget.contains(event.relatedTarget)) {
			close();
		}
	}
	export function focus() {
		focusIcon();
	}

	// METHODS
	function getLabel(pValue){
		var i = items.find(i => i.value == pValue);
		return i ? i.label : "";
	}
	function open() {
		position = (window.innerHeight - input.getInput().getBoundingClientRect().top) < 250 ? 'top' : 'bottom';
		visible = true;
		filterValue = '';
		displayedItems = items;
		focusItem();
	}
	function close() {
		visible = false;
		displayedItems = items;
	}
	function focusItem() {
		setTimeout(() => {
			let selectedItem = droplist.querySelector('li[code="' + value + '"]');
			if(!selectedItem) {
				// Unknown value, select first item
				selectedItem = droplist.querySelector('li');
			}
			if(selectedItem) {
				selectedItem.focus();
			}
		}, 100); // Waiting for the list to open
	}
</script>

<div class="droplist-main {cls}" class:flex={flex} style={style}>
	<Textfield 
		bind:value={displayedValue}
		{disable}
		{width}
		{iconLeft}
		{required}
		{type}
		{format}
		readonly={true}
		iconRight={readonly ? "" : "expand_more"}
		{label}
		{flex}
		cls={textfieldCls}
		style={textfieldStyle}
		bind:errorMessage={errorMessage}
		on:change={onChange}
		on:clickIcon={onClickIcon}
		on:click={onClick}
		on:blur={onBlur}
		on:focus
		on:focusout
		on:input
		on:keydown
		on:keyup={onKeyUp}
		bind:this={input}
	/>

	<ul 
		bind:this={droplist}
		role="listbox"
		on:focusout={onFocusOut}
		class="droplist-items droplist-{position}" 
		class:droplist-visible={visible}
		class:flex={flex}
		style="--width: {width}px;">
		{#if filter}
			<Textfield
				bind:value={filterValue}
				filled={false}
				iconLeft="search"
				width={width-20}
				{flex}
				style="margin:10px 10px 0px 10px"
				on:keyup={onKeyUpFilter}
			/>
		{/if}
		{#each displayedItems as item}
			<li 
				tabindex={
					(item.value == value) || (!displayedItems.some(i => i.value == value) && displayedItems[0] == item)
					? "0" : "-1"
				}
				role="option" 
				aria-selected={item.value == value} 
				on:click={onClickItem} 
				on:keydown={onKeyDownItem} 
				on:keyup={onKeyUpItem}
				code={item.value}>
				{#if render}
					{@html render ? render(item) : item.label}
				{:else}
					{item.label}
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.droplist-main {
		display: inline-block;
		position: relative;
	}
	.droplist-main.flex {
		display: flex;
		width: 100%;
	}
	.droplist-items {
		list-style: none;
		margin: 0;
		padding: 0;
		width: var(--width);
		background-color: var(--color-backgroud);
		border-radius: 8px;
		overflow-y: auto;
		overflow-x: hidden;
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		max-height: 200px;
		z-index: 2;
	}
	.droplist-main.flex .droplist-items {
		width: calc(100% - 5px);
		max-height: 250px;
	}
	.droplist-visible {
		display: block;
	}
	.droplist-bottom {
		top: calc(100% + 5px);
		transform: translateY(0%);
	}
	.droplist-top {
		top: -10px;
		transform: translateY(-100%);
	}
	.droplist-items li {
		margin: 0;
		padding: 10px 12px;
		width: var(--width);
		cursor: pointer;
		min-height: 41px;
		color: var(--color);
	}
	.droplist-main.flex .droplist-items li {
		width: 100%;
	}
	.droplist-items li:focus,
	.droplist-items li:hover {
		background-color: var(--color-backgroud-hover);
		color: var(--color-focus);
	}
	::-webkit-scrollbar {
		width: 5px;
	}
	::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb {
		background: var(--color); 
		border-radius: 10px;
	}
</style>