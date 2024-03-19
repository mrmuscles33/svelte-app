<script>
        // IMPORTS
        import Textfield from './Textfield.svelte';
        
        // PUBLIC ATTRIBUTES
        export let value = "";
        export let disable = false;
        export let width = 290;
        export let iconLeft = "call";
        export let iconRight = "";
        export let label = "";
        export let errorMessage = "";
        export let required = false;
        export let readonly = false;
        export let filled = true;
        export let style = "";
        export let flex = false;
        export let format = "01.23.45.67.89";
        export let maxLength = 20;

        // PRIVATE ATTRIBUTES
        $: pattern = "^\\+?(\\d[\\d-. ]+)?(\\([\\d-. ]+\\))?\\d[\\d-. ]+\\d$";
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
        maxLenght={maxLength}
        on:change
        on:blur
        on:clickIcon
        on:focus
        on:focusout
        on:input
        on:keydown
        on:keyup
/>