<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Radio from './Radio.svelte';
        
        // PUBLIC ATTRIBUTES
        // Array of object
        // {
        //      label: String,
	// 	value: String/int,
	// 	disable: Boolean
        // }
        export let items = [];
        export let selectedValue = "";
        export let name = "";
        export let disable = false;
        export let color = "#444";
        export let colorHover = "#000000";
        export let colorChecked = "#0d31a6";
        export let colorCheckedHover = "#4e6ac7";
        export let inline = true;
        
        // PRIVATE ATTRIBUTES
        
        // METHODS
        const dispatch = createEventDispatcher();
        function onChange(pSelectedValue){
                if(disable) return;
                dispatch('change', {
                        selectedValue: pSelectedValue
                });
        }
        $: onChange(selectedValue);
</script>

{#each items as item}
	<Radio
                {...item}
                bind:selectedValue={selectedValue}
                {name}
                {color}
                {colorHover}
                {colorChecked}
                {colorCheckedHover}
        />
        {#if !inline}
                <br/>
        {/if}
{/each}

<style>
</style>