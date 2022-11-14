<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Events from '../Utils/Events';
        
        // PUBLIC ATTRIBUTES
        export let text = "";
        export let icon = "";
        export let primary = false;
        export let border = true;
        export let disable = false;
        export let style = "";
        export let cls = "";
        
        // PRIVATE ATTRIBUTES
        let iconPadding = text == "" ? '0 12px' : '0 16px 0 12px';

        // METHODS
	const dispatch = createEventDispatcher();
        function onClick(){
                if(!disable) dispatch('click', {});
        }

        function onKeyUp(event){
                if(Events.isEnter(event)) {
                        onClick();
                }
        }
</script>

<span class="btn-main {cls}" 
     class:btn-with-icon="{icon != ''}"
     class:primary
     class:border
     class:disable
     role="button"
     tabindex={disable ? "-1" : "0"}
     on:click|stopPropagation|preventDefault={onClick}
     on:keyup|stopPropagation|preventDefault={onKeyUp}
     style="--icon-padding: {iconPadding}; {style}">
        <span class="btn-icon material-icons-round" role="presentation">{icon}</span>
        <span class="btn-text">{text}</span>
</span>

<style>
        .btn-main {
                padding: 0 16px;
                margin: 0 5px 5px 0;
                height: 36px;
                color: var(--color-font);
                border: 1px solid transparent;
                border-radius: 5px;
                display: inline-block;
                line-height: 32px;
                cursor: pointer;
                font-weight: 500;
                user-select: none;
                text-decoration: none;
                outline: none;
        }
        .btn-main.disable {
                cursor: not-allowed;
                opacity: .5;
        }
        .btn-main.primary {
                background-color: var(--color-primary);
        }
        .btn-main.border {
                border-color: var(--color-primary);
        }
        .btn-main:hover,
        .btn-main:focus-visible {
                background-color: var(--color-hover);
        }
        .btn-main.primary:hover,
        .btn-main.primary:focus-visible {
                border-color: var(--color-hover);
        }
        .btn-with-icon {
                padding: var(--icon-padding);
        }
        .btn-icon {
                font-size: inherit;
                vertical-align: middle;
                margin: 0;
                padding: 0;
        }
        .btn-text {
                letter-spacing: .7px;
                margin: 0;
                padding: 0;
                vertical-align: middle;
        }
</style>