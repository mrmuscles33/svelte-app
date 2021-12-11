<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Textfield from './Textfield.svelte';
        
        // PUBLIC ATTRIBUTES
        export let value = "";
        export let disable = false;
        export let color = "#666666";
        export let colorFocus = "#0d31a6";
        export let colorBackground = "#EEEEEE";
        export let colorBackgroundHover = "#DDDDDD";
        export let colorError = "#cc4141";
        export let width = 290;
        export let iconLeft = "";
        export let label = "";
        export let errorMessage = "";
        export let required = false;
        export let readonly = false;

        export let input;
        export let displayedValue = "";
        export let items = [];

        // PRIVATE ATTRIBUTES
        let visible = false;
        let selectOnly = false;
        let position = "bottom";

        // EVENTS
        const dispatch = createEventDispatcher();
	export function onClickIcon() {
                input.getInput().focus();
        }
        export function onFocus(evt) {
                position = (window.innerHeight - input.getInput().getBoundingClientRect().top) < 250 ? 'top' : 'bottom';
                visible = true;
        }
        export function onFocusOut(evt) {
                setTimeout(() => {
                        visible = false;
                }, 100); // pour laisser le temps du onClickItem
        }
        export function onClickItem(evt){
                value = evt.currentTarget.getAttribute('value');
                displayedValue = evt.currentTarget.getAttribute('label');
        }

        // METHODS
</script>

<div class="droplist-main">
        <Textfield 
                bind:value={displayedValue}
                {disable}
                {color}
                {colorFocus}
                {colorBackground}
                {colorBackgroundHover}
                {width}
                {iconLeft}
                {required}
                readonly={readonly || selectOnly}
                iconRight={readonly ? "" : "expand_more"}
                {label}
                bind:errorMessage={errorMessage}
                {colorError}
                on:change
                on:blur
                on:clickIcon={onClickIcon}
                on:focus={onFocus}
                on:focusout={onFocusOut}
                on:input
                on:keydown
                on:keyup
                bind:this={input}
        />

        <ul class="droplist-items droplist-{position}"
                class:droplist-visible={visible}
                style="--color-backgroud: {colorBackground}; 
                --color-backgroud-hover: {colorBackgroundHover};
                --color: {color};
                --color-focus: {colorFocus};
                --color-error: {colorError};
                --width: {width}px;">
                {#each items as item}
                        <li on:click={onClickItem} value={item.value} label={item.label}>{item.label}</li>
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
                overflow: auto;
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                max-height: 200px;
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