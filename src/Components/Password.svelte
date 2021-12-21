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
        export let format = null;
        
        // PRIVATE ATTRIBUTES
        let showPassword = false;

        // EVENTS
        const dispatch = createEventDispatcher();
        function clickIcon(){
                showPassword = !showPassword;
                dispatch('clickIcon', {
                        value: value
                });
        }

        // METHODS
</script>

<!-- On ne peut pas binder le type donc on fait 2 input (password/text) pour afficher/cacher le mot de passe --> 
{#if showPassword}
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
                type="text"
                iconRight="visibility_off"
                {label}
                bind:errorMessage={errorMessage}
                {colorError}
                on:change
                on:blur
                on:clickIcon={clickIcon}
                on:focus
                on:focusout
                on:input
                on:keydown
                on:keyup
        />
{:else}
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
                type="password"
                iconRight="visibility"
                {label}
                bind:errorMessage={errorMessage}
                {colorError}
                on:change
                on:blur
                on:clickIcon={clickIcon}
                on:focus
                on:focusout
                on:input
                on:keydown
                on:keyup
        />
{/if}


<style>

</style>