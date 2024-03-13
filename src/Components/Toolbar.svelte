<script>
    // IMPORT

    // PUBLIC ATTRIBUTES
    export let style = "";
    export let align = "right"; // left | right
    export let cls = "";


    // PRIVATE ATTRIBUTES
    let cssAlign = align == "left" ? "flex-start" : "flex-end";

    // PUBLIC METHODS

    // EVENTS
</script>

<div class="toolbar {cls}" style="--align: {cssAlign}; {style}" role="toolbar">
    <slot></slot>
</div>

<style>
    .toolbar {
        width: 100%;
        display: flex;
        justify-content: var(--align);
    }
</style>