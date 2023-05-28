<script>
        // IMPORTS
        
        // PUBLIC ATTRIBUTES
        export let label = "";
        export let name = "";
        export let value = "";
        export let disable = false;
        export let selectedValue;
        export let style = "";
        
        // PRIVATE ATTRIBUTES
        let id = '_' + Math.random().toString(36).substring(2, 12);

        // METHODS
</script>

<input type="radio" {id} bind:group={selectedValue} {name} {value} disabled={disable}/>
<label 
     class="radio-main"
     for={id}
     {style}
>
        {#if selectedValue == value}
                <span class="material-icons-round" role="presentation">radio_button_checked</span>
        {:else}
                <span class="material-icons-round" role="presentation">radio_button_unchecked</span>
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
                position: absolute;
        }
        .radio-main {
                margin:         10px 5px 10px 0;
                padding:        0;
                cursor:         pointer;
                user-select:    none;
                display:        inline-flex;
                vertical-align: middle;
                white-space:    nowrap;
                color:          var(--color-font);
        }
        input:disabled + .radio-main {
                cursor: not-allowed;
                opacity: .5;
        }
        .radio-main span {
                vertical-align: middle;
        }
        .radio-main .material-icons-round {
                color: var(--color-primary);
                margin-right: 5px;
        }
        input:checked + .radio-main .material-icons-round {
                color: var(--color-checked);
        }
        input:focus + .radio-main .material-icons-round,
        .radio-main:hover .material-icons-round {
                color: var(--color-hover);
        }
        input:checked:focus + .radio-main .material-icons-round,
        input:checked + .radio-main:hover .material-icons-round {
                color: var(--color-checked-hover);
        }
        input:checked:focus + .radio-main .material-icons-round {
                box-shadow: inset 0px 0px 0 1px var(--color-checked-hover), 0px 0px 0px 1px var(--color-checked-hover);
                padding-right: 1px;
                border-radius: 50px;
        }
        input:focus + .radio-main .material-icons-round {
                box-shadow: inset 0px 0px 0 1px var(--color-hover), 0px 0px 0px 1px var(--color-hover);
                padding-right: 1px;
                border-radius: 50px;
        }
</style>