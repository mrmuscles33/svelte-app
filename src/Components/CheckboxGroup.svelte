<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Checkbox from './Checkbox.svelte';

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
        export let color = "#444";
        export let colorHover = "#000000";
        export let colorChecked = "#0d31a6";
        export let colorCheckedHover = "#4e6ac7";
        export let inline = true;
        
        // PRIVATE ATTRIBUTES
        
        // METHODS
        const dispatch = createEventDispatcher();
        function onChange(event){
                if(event.detail.check) {
                        selectedValues = [...selectedValues, event.detail.value]
                } else {
                        selectedValues = selectedValues.filter(v => v != event.detail.value);
                }
                dispatch('change', {
                        selectedValues: selectedValues
                });
        }
</script>

{#each items as item}
	<Checkbox
                {...item}
                check={selectedValues.includes(item.value)}
                {name}
                {color}
                {colorHover}
                {colorChecked}
                {colorCheckedHover}
                on:change={onChange}
        />
        {#if !inline}
                <br/>
        {/if}
{/each}

<style>
</style>