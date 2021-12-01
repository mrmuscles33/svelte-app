<script>
        // IMPORTS
        
        // PUBLIC ATTRIBUTES
        export let text = "";
        export let colorFont = "#FFFFFF";
        export let colorBackground = "#6C6C6C";
        export let position = "bottom";
        
        // PRIVATE ATTRIBUTES
        
        // METHODS
	
</script>

<span class="tooltip-main tooltip-position-{position}"
      style="--color-background: {colorBackground};
             --color-font: {colorFont}">
        <slot></slot>
        <div class="tooltip-text">{text}</div>
</span>

<style>
        .tooltip-main {
                position: relative;
                display: inline-flex;
        }
        .tooltip-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                background-color: var(--color-background);
                color: var(--color-font);
                font-size: 14px;
                padding: 8px 12px;
                border-radius: 5px;
                white-space: nowrap;
                text-align: center;
                visibility: hidden;
                opacity: 0;
                transition: opacity 0.2s ease-in;
        }
        .tooltip-main:hover .tooltip-text {
                visibility: visible;
                opacity: 1;
        }
        .tooltip-position-top .tooltip-text{
                top: -10px;
                transform: translate(-50%,-100%);
        }
        .tooltip-position-left .tooltip-text{
                left: -10px;
                transform: translate(-100%,-50%);
        }
        .tooltip-position-right .tooltip-text{
                left: calc(100% + 10px);
                transform: translate(0%,-50%);
        }
        .tooltip-position-bottom .tooltip-text{
                top: calc(100% + 10px);
                transform: translate(-50%,0%);
        }
</style>