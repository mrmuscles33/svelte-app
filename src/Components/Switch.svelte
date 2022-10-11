<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        
        // PUBLIC ATTRIBUTES
        export let name = "";
        export let disable = false;
        export let check = false;
        export let style = "";
        
        // PRIVATE ATTRIBUTES
        let id = '_' + Math.random().toString(36).substring(2, 12);
        
        // METHODS
        const dispatch = createEventDispatcher();
        let onChange = () => {
                if(!disable) {
                        dispatch('change', {
                                check: check
                        });
                }
        }
</script>

<div class="switch-main"
     class:disable
     {style}
>
        <input type="checkbox" {id} {name} bind:checked={check} disabled={disable} on:change={onChange}/>
        <label for={id} class="switch-background">
                <div class="switch-button"></div>
        </label>
</div>

<style>
        .switch-main {
                display: inline-block;
                user-select: none;
        }
        .switch-main.disable {
                opacity: .5;
        }
        input {
                opacity: 0;
                width: 0px;
                height: 0px;
                padding: 0px;
                margin: 0px;
        }
        .switch-background {
                width: 50px;
                height: 30px;
                border-radius: 50px;
                background-color: var(--color-primary);
                position: relative;
                display: inline-block;
                cursor: pointer;
                transition: background-color .3s;
        }
        .disable .switch-background {
                cursor: not-allowed;
        }
        input:focus ~ .switch-background,
        .switch-main:hover .switch-background {
                background-color: var(--color-hover);
        }
        .switch-button {
                position: absolute;
                width: 24px;
                height: 24px;
                top: 3px;
                left: 3px;
                border-radius: 50px;
                background-color: var(--color-button);
                cursor: pointer;
                transition: left .3s;
        }
        .disable .switch-button {
                cursor: not-allowed;
        }
        input:checked ~ .switch-background {
                background-color: var(--color-checked);
        }
        input:checked:focus ~ .switch-background,
        .switch-main:hover input:checked ~ .switch-background {
                background-color: var(--color-checked-hover);
        }
        input:checked ~ .switch-background .switch-button {
                left: 23px; 
        }
</style>