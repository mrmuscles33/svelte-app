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
        export let iconRight = "";
        export let label = "";
        export let errorMessage = "";
        export let required = false;
        export let readonly = false;
        export let format = "-1234567,12";

        export let precision = 2;
        export let decimal = 7;
        export let min = null;
        export let max = null;
        
        // PRIVATE ATTRIBUTES
        $: pattern = precision > 0 ? "^(-?)[0-9]{1," + decimal + "}((\\.|,)[0-9]{1," + precision + "})?$" : "^(-?)[0-9]{1," + decimal + "}$";

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
        {color}
        {colorFocus}
        {colorBackground}
        {colorBackgroundHover}
        {width}
        {iconLeft}
        {required}
        {readonly}
        {format}
        type="number"
        {pattern}
        {iconRight}
        {label}
        bind:errorMessage={errorMessage}
        {colorError}
        on:change={onChange}
        on:blur
        on:clickIcon
        on:focus
        on:focusout
        on:input
        on:keydown
        on:keyup
/>

<style>

</style>