<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        
        // PUBLIC ATTRIBUTES
        export let label = "";
        export let check = false;
        export let name = "";
        export let value = "";
        export let disable = false;
        export let cls = "";
        export let style = "";
        
        // PRIVATE ATTRIBUTES
        let id = '_' + Math.random().toString(36).substring(2, 12);

        // METHODS
        const dispatch = createEventDispatcher();
        function onChange (){
                if(!disable) {
                        dispatch('change', {
                                check: check,
                                value: value
                        });
                }
        }
</script>

<input type="checkbox" {id} bind:checked={check} {name} {value} disabled={disable} on:change={onChange}/>
<label 
     class="checkbox-main {cls}"
     for={id}
     {style}
>
        {#if check}
                <span class="material-icons-round" role="presentation">check_box</span>
        {:else}
                <span class="material-icons-round" role="presentation">check_box_outline_blank</span>
        {/if}
        <span>{label}</span>
</label>

<style>
        input {
                opacity: 0;
                width: 0px;
                height: 0px;
                padding: 0px;
                margin: 0px;
        }
        .checkbox-main {
                margin:         10px 5px;
                padding:        0;
                cursor:         pointer;
                user-select:    none;
                display:        inline-flex;
                vertical-align: middle;
                white-space:    nowrap;
                color:          var(--color-font);
        }
        input:disabled + .checkbox-main {
                cursor: not-allowed;
                opacity: .5;
        }
        .checkbox-main span {
                vertical-align: middle;
        }
        .checkbox-main .material-icons-round {
                color: var(--color-primary);
                margin-right: 5px;
        }
        input:checked + .checkbox-main .material-icons-round {
                color: var(--color-checked);
        }
        input:focus-visible + .checkbox-main .material-icons-round,
        .checkbox-main:hover .material-icons-round {
                color: var(--color-hover);
        }
        input:checked:focus-visible + .checkbox-main .material-icons-round,
        input:checked + .checkbox-main:hover .material-icons-round {
                color: var(--color-checked-hover);
        }
        input:checked:focus-visible + .checkbox-main .material-icons-round {
                box-shadow: inset 0px 0px 0 1px var(--color-checked-hover), 0px 0px 0px 1px var(--color-checked-hover);
                padding-right: 1px;
                border-radius: 3px;
        }
        input:focus-visible + .checkbox-main .material-icons-round {
                box-shadow: inset 0px 0px 0 1px var(--color-hover), 0px 0px 0px 1px var(--color-hover);
                padding-right: 1px;
                border-radius: 3px;
        }
</style>