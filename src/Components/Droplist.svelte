<script>
        // IMPORTS
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
        export let format = null;
        export let items = [];
        export let selectOnly = false;
        export let render = null;
        
        // PRIVATE ATTRIBUTES
        let type = "text";
        let input;
        let visible = false;
        let position = "bottom";
        let displayedItems = items;
        let droplist;
        $: displayedValue = getLabel(value);

        // EVENTS
	export function onClickIcon (){
                if(visible) {
                        close();
                } else {
                        open();
                }
        }
        export function onClickItem (evt){
                let pValue = evt.currentTarget.getAttribute('code');
                if(pValue == value) {
                        displayedValue = getLabel(value);
                } else {
                        value = pValue;
                }
                close();
        }
        export function onKeyUp(evt) {
                let event = evt.detail;
                if(Events.isArrowUp(event) || Events.isArrowDown(event)) {
                        open();
                } else if(Events.isEnter(event)) {
                        displayedItems = items.filter(i => i.label.toLowerCase().includes(displayedValue.toLowerCase()));
                        open();
                }
        }
        export function onClick(evt) {
                if(selectOnly && !readonly) {
                        open();
                }
        }

        // METHODS
        function getLabel(pValue){
                var i = items.find(i => i.value == pValue);
                return i ? i.label : "";
        }
        function onKeyDownItem(event){
                if(Events.isEnter(event)){
                        onClickItem(event);
                        setTimeout(() => {
                                input.getInput().focus();
                        }, 100);
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
        function open() {
                position = (window.innerHeight - input.getInput().getBoundingClientRect().top) < 250 ? 'top' : 'bottom';
                visible = true;
                focusItem();
        }
        function close() {
                visible = false;
                displayedItems = items;
        }
        function onFocusOut(event){
                if (!event.currentTarget.contains(event.relatedTarget)) {
                        visible = false;
                }
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

<div class="droplist-main">
        <Textfield 
                bind:value={displayedValue}
                {disable}
                {width}
                {iconLeft}
                {required}
                {type}
                {format}
                readonly={readonly || selectOnly}
                iconRight={readonly ? "" : "expand_more"}
                {label}
                {cls}
                bind:errorMessage={errorMessage}
                on:change
                on:blur
                on:clickIcon={onClickIcon}
                on:click={onClick}
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
                style="--width: {width}px;">
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
        .droplist-items {
                list-style: none;
                margin: 5px 0;
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
        .droplist-bottom {
                top: 100%;
                transform: translateY(0%);
        }
        .droplist-top {
                top: -10px;
                transform: translateY(-100%);
        }
        .droplist-visible {
                display: block;
        }
        .droplist-items li {
                margin: 0;
                padding: 10px 12px;
                width: var(--width);
                cursor: pointer;
                min-height: 41px;
                color: var(--color);
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