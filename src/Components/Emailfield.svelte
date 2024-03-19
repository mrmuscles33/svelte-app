<script>
        // IMPORTS
        import Textfield from './Textfield.svelte';
        
        // PUBLIC ATTRIBUTES
        export let value = "";
        export let disable = false;
        export let width = 290;
        export let iconLeft = "alternate_email";
        export let iconRight = "";
        export let label = "";
        export let errorMessage = "";
        export let required = false;
        export let readonly = false;
        export let filled = true;
        export let style = "";
        export let flex = false;
        export let format = "exemple@domaine.com";
        export let maxLength = 128;

        // PRIVATE ATTRIBUTES
        $: pattern = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
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
        bind:pattern={pattern}
        {iconRight}
        {label}
        {filled}
        {style}
        {flex}
        {errorMessage}
        {maxLength}
        on:change
        on:blur
        on:clickIcon
        on:focus
        on:focusout
        on:input
        on:keydown
        on:keyup
/>