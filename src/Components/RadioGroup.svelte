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
        export let inline = true;
        
        // PRIVATE ATTRIBUTES
        
        // METHODS
        const dispatch = createEventDispatcher();
        let onChange = (pSelectedValue) => {
                if(!disable){
                        dispatch('change', {
                                selectedValue: pSelectedValue
                        });
                }
        }
        $: onChange(selectedValue);
</script>

{#each items as item}
	<Radio
                {...item}
                bind:selectedValue={selectedValue}
                {name}
        />
        {#if !inline}
                <br/>
        {/if}
{/each}

<style>
</style>