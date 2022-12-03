<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Tooltip from './Tooltip.svelte';
        import Events from '../Utils/Events';
        
        // PUBLIC ATTRIBUTES
        export let value = "";
        export let disable = false;
        export let width = 290;
        export let iconLeft = "";
        export let iconRight = "";
        export let label = "";
        export let errorMessage = "";
        export let pattern = null;
        export let required = false;
        export let readonly = false;
        export let type = "text";
        export let cls = "";
        export let style = "";
        export let format = null;
        export let filled = true;
        
        // PRIVATE ATTRIBUTES
        $: inputWidth = width - (iconLeft != "" ? 40 : 12) - (iconRight != "" ? 32 : 0) - (hasError != "" ? 32 : 0) - 12;
        $: hasError = errorMessage != "";
        let id = '_' + Math.random().toString(36).substring(2, 12);
        let input;
        let oldValue = "";

        // EVENTS
	const dispatch = createEventDispatcher();
        export function onClick () {
                if(readonly) return;
                input.focus();
        }
        export function onClickIcon() {
                if(disable) return;
                dispatch('clickIcon', {
                        value: value
                });
        }
        export function onChange () {
                if(disable) return;
                errorMessage = required && (value == null || value.trim().length == 0) ? "La donnée " + label + " est obligatoire" : "";
                if(pattern != null && errorMessage == ""){
                        errorMessage = new RegExp(pattern).test(value) || value == "" || value == null ? 
                                                "" : 
                                                format ? 
                                                        "La donnée " + label  + " doit être au format " + format : 
                                                        "Erreur dans le format de la donnée " + label;
                }
                dispatch('change', {
                        value: value,
                        oldValue: oldValue
                });
                oldValue = value;
        }
        export function onInput() {
                if(disable) return;
                dispatch('input', {
                        value: value
                });
        }
        export function onFocus() {
                if(disable) return;
                dispatch('focus', {
                        value: value
                });
        }
        export function onFocusOut(){
                if(disable) return;
                dispatch('focusout', {
                        value: value
                });
        }
        export function onBlur(){
                if(disable) return;
                dispatch('blur', {
                        value: value
                });
        }
        export function onKeyDown(event){
                if(disable) return;
                dispatch('keydown', {
                        value: value,
                        key: event.key,
                        keyCode: event.keyCode,
                        ctrlKey: event.ctrlKey,
                        shiftKey: event.shiftKey,
                        altKey: event.altKey
                });
        }
        export function onKeyUp(event){
                if(disable) return;
                dispatch('keyup', {
                        value: value,
                        key: event.key,
                        keyCode: event.keyCode,
                        ctrlKey: event.ctrlKey,
                        shiftKey: event.shiftKey,
                        altKey: event.altKey
                });
        }

        // METHODS
        export function getInput() {
                return input;
        }
        function typeAction(node){
		node.type = type;
	}
        function onKeyDownIcon(event){
                if(Events.isEnter(event)){
                        onClickIcon();
                }
        }
        function nothing(){
                return;
        }
</script>

<div class="textfield-main {cls}"
     class:textfield-icon-left={iconLeft != ""}
     class:textfield-icon-right={iconRight != ""}
     class:disable
     class:filled
     class:labelled={label!=""}
     class:textfield-error={hasError}
     on:click={onClick}
     on:keypress={nothing}
     style="--width: {width}px;
            --width-input: {inputWidth}px;
            {style}">
        <input use:typeAction bind:this={input} {id} bind:value={value} {required} pattern={pattern || null} {readonly} disabled={disable} placeholder="." 
                on:change={onChange} 
                on:input={onInput}
                on:focus={onFocus}
                on:focusout={onFocusOut}
                on:blur={onBlur}
                on:keydown={onKeyDown}
                on:keyup={onKeyUp}/>
        {#if label != ""}
                <label for={id}>{label}</label>
        {/if}
        {#if iconLeft != ""}
                <span class="textfield-icon textfield-icon-left material-icons-round">{iconLeft}</span>
        {/if}
        {#if iconRight != ""}
                <span 
                        class="textfield-icon textfield-icon-right material-icons-round" 
                        role="button"
                        tabindex="0"
                        on:keydown={onKeyDownIcon}
                        on:click|stopPropagation={onClickIcon}>
                        {iconRight}
                </span>
        {/if}
        {#if hasError}
                <span class="textfield-error-msg">{errorMessage}</span>
        {/if}
</div>

<style>
        .textfield-main {
                vertical-align: top;
                background-color: transparent;
                display: inline-block;
                height: 36px;
                width: var(--width);
                border-radius: 8px;
                position: relative;
                border: 1px solid var(--color);
                box-sizing: border-box;
                cursor: text;
                margin: 0 5px 5px 0;
        }
        .textfield-main.labelled {
                height: 48px;
        }
        .textfield-main.filled {
                background-color: var(--color-backgroud);
                border-radius: 8px 8px 0 0;
                border: none;
                border-bottom: 1px solid var(--color);
        }
        .textfield-main.filled:hover {
                background-color: var(--color-backgroud-hover);
        }
        .textfield-main:not(.filled):hover {
                border-width: 2px;
        }
        .textfield-main.filled:focus-within {
                border-bottom: 2px solid var(--color-focus);
        }
        .textfield-main:not(.filled):focus-within {
                border: 2px solid var(--color-focus);
        }
        .textfield-main.textfield-error.filled,
        .textfield-main.textfield-error:not(.filled) {
                border-color: var(--color-error);
                margin-bottom: 22px;
        }
        .textfield-main.disable {
                opacity: 0.5;
                cursor: not-allowed;
        }
        input {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 12px;
                width: var(--width-input);
                height: 20px;
                font-size: 16px;
                padding: 0;
                margin: 0;
                box-sizing: border-box;
                border: none;
                outline: none;
                background: none;
                -moz-appearance: textfield;
        }
        .textfield-main.labelled input {
                top: 22px;
                transform: translateY(0%);
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
                -webkit-appearance: none;
        }
        input::placeholder {
                opacity: 0;
        }
        input:read-only{
                pointer-events: none;
        }
        .textfield-main.disable input {
                pointer-events: none;
        }
        label {
                position: absolute;
                top: 50%;
                left: 12px;
                transform: translateY(-50%);
                font-size: 16px;
                line-height: 20px;
                color: var(--color);
                transition: .2s ease-out;
                pointer-events: none;
                user-select: none;
        }
        input:required ~ label::after {
                content: " *";
                color: var(--color-error)
        }
        .textfield-main:focus-within label {
                color: var(--color-focus);
                top: 2px;
                transform: translateY(0%);
                font-weight: 500;
                font-size: 12px;
        }
        .textfield-main.textfield-error label {
                color: var(--color-error);
        }
        .textfield-icon-left input,
        .textfield-icon-left label {
                left: 40px;
        }
        input:not(:placeholder-shown) ~ label {
                top: 2px;
                transform: translateY(0%);
                font-size: 12px; 
                font-weight: 500;
        }
        .textfield-icon {
                position: absolute;
                top: 50%;
                font-size: 21px;
                transform: translateY(-50%);
                text-decoration: none;
                user-select: none;
                color: var(--color);
        }
        .textfield-main:focus-within .textfield-icon {
                color: var(--color-focus);
        }
        .textfield-main.textfield-error .textfield-icon {
                color: var(--color-error);
        }
        .textfield-icon .material-icons-round {
                font-size: 21px;
        }
        .textfield-main.labelled .textfield-icon {
                font-size: 24px;
        }
        .textfield-icon.textfield-icon-left {
                left: 12px;
        }
        .textfield-icon.textfield-icon-right {
                cursor: pointer;
                right: 12px;
        }
        .textfield-error-msg {
                position: absolute;
                top: 100%;
                transform: translateY(5px);
                font-size: 12px;
                color: var(--color-error);
        }
</style>