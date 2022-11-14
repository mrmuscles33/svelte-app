<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Textfield from './Textfield.svelte';
        
        // PUBLIC ATTRIBUTES
        export let value = "";
        export let disable = false;
        export let width = 290;
        export let iconLeft = "";
        export let iconRight = "";
        export let label = "";
        export let errorMessage = "";
        export let required = false;
        export let readonly = false;
        export let filled = true;

        export let decimal = 2;
        export let integer = 7;
        export let min = null;
        export let max = null;
        
        // PRIVATE ATTRIBUTES
        $: pattern = decimal > 0 ? "^" + (max != null & min < 0 ? "(-?)" : "") + "[0-9]{1," + integer + "}((\\\.|,)[0-9]{1," + decimal + "})?$" : "^(-?)[0-9]{1," + integer + "}$";
        $: format = (min != null & min < 0 ? "-" : "") + "".padStart(integer, "X") + (decimal > 0 ? ".".padEnd(parseInt(decimal) + 1, "x") : "");

        // EVENTS
        const dispatch = createEventDispatcher();
        export function onChange(evt){
                if(errorMessage == "" && value != ""){
                        if(min != null && max != null && (parseFloat(value.replace(",",".")) < parseFloat(min.replace(",",".")) || parseFloat(value.replace(",",".")) > parseFloat(max.replace(",",".")))){
                                errorMessage = "La donnée " + label + " doit etre comprise entre " + min + " et " + max;
                        } else if(min != null && parseFloat(value.replace(",",".")) < parseFloat(min.replace(",","."))) {
                                errorMessage = "La donnée " + label + " doit etre supérieure à " + min;
                        } else if(max != null && parseFloat(value.replace(",",".")) > parseFloat(max.replace(",","."))){
                                errorMessage = "La donnée " + label + " doit etre inférieure à " + max;
                        }
                }
                dispatch('change', {
                        value: parseFloat(value.replace(",",".")),
                        oldValue: parseFloat(evt.detail.oldValue.replace(",",".") || "")
                });
        }

        // METHODS
</script>

<Textfield 
        bind:value={value}
        {disable}
        {width}
        {iconLeft}
        {required}
        {readonly}
        {format}
        type="number"
        {pattern}
        {iconRight}
        {label}
        {filled}
        bind:errorMessage={errorMessage}
        on:change={onChange}
        on:blur
        on:clickIcon
        on:focus
        on:focusout
        on:input
        on:keydown
        on:keyup
/>