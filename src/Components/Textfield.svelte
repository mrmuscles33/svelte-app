<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Tooltip from './Tooltip.svelte';
        
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
        export let iconRight = "";
        export let label = "";
        export let errorMessage = "";
        export let pattern = null;
        export let required = false;
        export let readonly = false;
        export let type = "text";
        export let format = null;
        
        // PRIVATE ATTRIBUTES
        $: inputWidth = width - (iconLeft != "" ? 40 : 12) - (iconRight != "" ? 32 : 0) - (hasError != "" ? 32 : 0) - 12;
        $: hasError = errorMessage != "";
        let id = '_' + Math.random().toString(36).substring(2, 12);
        let input;
        let oldValue = "";

        // EVENTS
	const dispatch = createEventDispatcher();
        export function onClick() {
                if(readonly) return;
                input.focus();
        }
        export function onClickIcon() {
                if(disable) return;
                dispatch('clickIcon', {
                        value: value
                });
        }
        export function onChange() {
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
        export function onInput(){
                if(disable) return;
                dispatch('input', {
                        value: value
                });
        }
        export function onFocus(){
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
        export function getInput(){
                return input;
        }
        function typeAction(node) {
		node.type = type;
	}
</script>

<div class="textfield-main"
     class:textfield-icon-left={iconLeft != ""}
     class:textfield-icon-right={iconRight != ""}
     class:disable
     class:textfield-error={hasError}
     on:click={onClick}
     style="--color-backgroud: {colorBackground}; 
            --color-backgroud-hover: {colorBackgroundHover};
            --color: {color};
            --color-focus: {colorFocus};
            --color-error: {colorError};
            --width: {width}px;
            --width-input: {inputWidth}px;">
        <input use:typeAction bind:this={input} {id} bind:value={value} {required} pattern={pattern || undefined} {readonly} disabled={disable} placeholder="." 
                on:change={onChange} 
                on:input={onInput}
                on:focus={onFocus}
                on:focusout={onFocusOut}
                on:blur={onBlur}
                on:keydown={onKeyDown}
                on:keyup={onKeyUp}/>
        <label for={id}>{label}</label>
        <!-- svelte-ignore a11y-missing-attribute -->
        <span class="textfield-icon textfield-icon-left material-icons-round">{iconLeft}</span>
        {#if hasError}
                <span class="textfield-icon textfield-icon-right textfield-icon-error">
                        <Tooltip text={errorMessage}>
                                <!-- svelte-ignore a11y-missing-attribute -->
                                <a class="material-icons-round">error</a>
                        </Tooltip>
                </span>
        {/if}
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="textfield-icon textfield-icon-right material-icons-round" on:click|stopPropagation={onClickIcon}>{iconRight}</a>
</div>

<style>
        .textfield-main {
                background-color: var(--color-backgroud);
                display: inline-block;
                height: 48px;
                width: var(--width);
                border-radius: 8px 8px 0 0;
                position: relative;
                border-bottom: 1px solid var(--color);
                box-sizing: border-box;
                cursor: text;
        }
        .textfield-main:hover {
                background-color: var(--color-backgroud-hover);
        }
        .textfield-main:focus-within {
                border-bottom: 2px solid var(--color-focus);
        }
        .textfield-main.textfield-error {
                border-bottom-color: var(--color-error);
        }
        .textfield-main.disable {
                opacity: 0.5;
                cursor: not-allowed;
        }
        input {
                position: absolute;
                top: 22px;
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
                top: 16px;
                left: 12px;
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
                font-size: 12px; 
                font-weight: 500;
        }
        .textfield-icon {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 24px;
                text-decoration: none;
                user-select: none;
        }
        .textfield-icon.textfield-icon-left {
                left: 12px;
        }
        .textfield-icon.textfield-icon-right {
                cursor: pointer;
                right: 12px;
        }
        .textfield-icon-error {
                color: var(--color-error);
                display: flex;
        }
        .textfield-icon-error ~ .textfield-icon-right {
                right: 44px;
        }
</style>