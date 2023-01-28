<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Checkbox from './Checkbox.svelte';
        import Events from '../Utils/Events';

        // PUBLIC ATTRIBUTES
        // Array of object
        // {
        //      label: String,
	// 	value: String/int,
	// 	disable: Boolean
        // }
        export let items = [];
        export let selectedValues = [];
        export let name = "";
        export let inline = true;
        
        // PRIVATE ATTRIBUTES
        
        // METHODS
        const dispatch = createEventDispatcher();
        function onChange (evt) {
                let event = evt.detail;
                if(event.check) {
                        selectedValues = [...selectedValues, event.value]
                } else {
                        selectedValues = selectedValues.filter(v => v != event.value);
                }
                let params = Events.copy(event);
                params.selectedValues = selectedValues;
                dispatch('change', {
                        ...params
                });
        }
</script>

{#each items as item}
	<Checkbox
                {...item}
                check={selectedValues.includes(item.value)}
                {name}
                on:change={onChange}
        />
        {#if !inline}
                <br/>
        {/if}
{/each}

<style>
</style>