<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Textfield from './Textfield.svelte';
        import Events from '../Utils/Events';
        
        // PUBLIC ATTRIBUTES
        export let value = "";
        export let disable = false;
        export let width = 290;
        export let iconLeft = "";
        export let label = "";
        export let errorMessage = "";
        export let required = false;
        export let readonly = false;
        export let format = null;
        export let filled = true;
        export let flex = false;
        export let cls = "";
        export let style = "";
        export let maxLength = 128;
        
        // PRIVATE ATTRIBUTES
        let showPassword = false;

        // EVENTS
        const dispatch = createEventDispatcher();
        function clickIcon(evt){
                let event = evt.detail;
                showPassword = !showPassword;
                let params = Events.copy(event);
                params.value = value;
                dispatch('clickIcon', {
                        ...params
                });
        }

        // METHODS
</script>

<!-- On ne peut pas binder le type donc on fait 2 input (password/text) pour afficher/cacher le mot de passe --> 
{#if showPassword}
        <Textfield 
                bind:value={value}
                {disable}
                {width}
                {iconLeft}
                {required}
                {readonly}
                {format}
                type="text"
                iconRight="visibility_off"
                {label}
                {filled}
                {flex}
                {cls}
                {style}
                {maxLength}
                bind:errorMessage={errorMessage}
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
                {width}
                {iconLeft}
                {required}
                {readonly}
                type="password"
                iconRight="visibility"
                {label}
                {filled}
                {flex}
                {cls}
                {style}
                {maxLength}
                bind:errorMessage={errorMessage}
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