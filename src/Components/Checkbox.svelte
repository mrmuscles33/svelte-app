<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        
        // PUBLIC ATTRIBUTES
        export let label = "";
        export let check = false;
        export let name = "";
        export let value = "";
        export let disable = false;
        export let color = "#444";
        export let colorHover = "#000000";
        export let colorChecked = "#0d31a6";
        export let colorCheckedHover = "#4e6ac7";
        
        // PRIVATE ATTRIBUTES
        let id = '_' + Math.random().toString(36).substring(2, 12);

        // METHODS
        const dispatch = createEventDispatcher();
        function onChange(){
                if(disable) return;
                dispatch('change', {
                        check: check,
                        value: value
                });
        }
</script>

<div class="checkbox-main"
     class:disable
     style="--color-primary: {color}; 
            --color-hover: {colorHover}; 
            --color-checked: {colorChecked}; 
            --color-checked-hover: {colorCheckedHover}">
        <input type="checkbox" {id} bind:checked={check} {name} {value} disabled={disable} on:change={onChange}/>
        <label for={id} class="material-icons-round uncheck">check_box_outline_blank</label>
        <label for={id} class="material-icons-round check">check_box</label>
        <label for={id}>{label}</label>
</div>

<style>
        .checkbox-main {
               margin: 10px 5px;
               user-select: none;
               display: inline-block;
        }
        .checkbox-main.disable{
                opacity: .5;
        }
        input{
                opacity: 0;
                width: 0px;
                height: 0px;
                padding: 0px;
                margin: 0px;
        }
        input ~  .uncheck {
                color: var(--color-primary);
        }
        input:focus ~ .uncheck,
        input ~  .uncheck:hover {
                color: var(--color-hover);
        }
        input ~  .check {
                display: none;
        }
        input:checked ~  .check {
                display: inline-block;
                color: var(--color-checked);
        }
        input:focus ~ .check,
        input ~ .check:hover {
                color: var(--color-checked-hover);
        }
        input:checked ~  .uncheck {
                display: none;
        }
        input:focus ~ .uncheck {
                box-shadow: inset 0px 0px 0 1px var(--color-hover), 0px 0px 0px 1px var(--color-hover);
                padding-right: 1px;
                border-radius: 3px;
        }
        input:focus ~ .check {
                box-shadow: inset 0px 0px 0 1px var(--color-checked-hover), 0px 0px 0px 1px var(--color-checked-hover);
                padding-right: 1px;
                border-radius: 3px;
        }
        label{
                vertical-align: middle;
        }
        .check, .uncheck, label {
                cursor: pointer;
        }
        .disable .check, .disable .uncheck, .disable label {
                cursor: not-allowed;
        }
</style>