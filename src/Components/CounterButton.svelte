<script>
    // IMPORT
    import { createEventDispatcher } from 'svelte';

    // PUBLIC ATTRIBUTES
    export let text = '';
    export let color = "#CCCCCC";
    export let colorHover = "#AAAAAA";
    export let colorChecked = "#0d31a6";
    export let colorCheckedHover ="#4e6ac7";
    export let colorText = "#333333";
    export let colorTextHover = "#111111";
    export let colorTextChecked = "white";
    export let colorTextCheckedHover ="white";
    export let colorBackground = "white";
    export let icon = '';
    export let disabled = false;
    export let value = 0;
    export let check = false;

    // PRIVATE ATTRIBUTES
    const dispatch = createEventDispatcher();
    $: displayedCounter = formatCount(value);

    // EVENTS
    let onClick = function(){
        if(!disabled){
            check = !check;
            check ? value++ : value--;
            setTimeout(() => dispatch('click',{
                check: check,
                value: value
            }), 100);
        }
    }
    
    // METHODS
    let formatCount = function(count){
        let unit, base, precision = 3;
        if(count < 10000) {
            unit = '';
            base = count;
            precision = 4;
        } else if(count < 1000000){
            unit = ' k';
            base = count/1000;
        } else if(count < 1000000000){
            unit = ' m';
            base = count/1000000;
        } else {
            unit = ' Md';
            base = count/1000000000;
        }
        var parts = base.toString().split(".");
        if(parts[1]) {
            parts[1] = parts[1].substr(0,3-parts[0].length);
        }
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        base = parts.join(".").replaceAll('.',',');
        if(base.endsWith(',')) {
            base = base.substr(0,base.length - 1);
        }
        return base + unit;
    }
</script>


<!-- svelte-ignore a11y-invalid-attribute -->
<a href="#" on:click|stopPropagation|preventDefault={onClick}
     class="counter-main"
     class:check
     class:disabled
     style="--color: {color}; 
            --color-hover: {colorHover}; 
            --color-checked: {colorChecked}; 
            --color-checked-hover: {colorCheckedHover};
            --color-text: {colorText};
            --color-text-hover: {colorTextHover}; 
            --color-text-checked: {colorTextChecked}; 
            --color-text-checked-hover: {colorTextCheckedHover};
            --color-background: {colorBackground};"
>
    <span class="counter-left">
        {#if icon}
            <i class="material-icons-round">{icon}</i>
        {/if}
        {#if text}
            <span class="counter-text">{text}</span>
        {/if}
    </span>
    <span class="counter-right">
        <span class="counter-text">{displayedCounter}</span>
        <span class="counter-arrow"></span>
    </span>
</a>


<style>
    .counter-main {
        padding:            0;
        cursor:             pointer;
        user-select:        none;
        display:            inline-flex;
        vertical-align:     middle;
        white-space:        nowrap;
        height:             36px;
        line-height:        32px;
        text-decoration:    none;
        outline:            none;
        border-radius:      5px;
        border:             1px solid var(--color);
    }
    .counter-main.check {
        border: 1px solid var(--color-checked);
    }
    .counter-main:focus,
    .counter-main:hover {
        border: 1px solid var(--color-hover);
    }
    .counter-main.check:focus,
    .counter-main.check:hover {
        border: 1px solid var(--color-checked-hover);
    }
    .counter-main.disabled {
        cursor: not-allowed;
        opacity: .5;
    }
    .counter-text{
        font-weight:    500;
        letter-spacing: 0.7px;
    }
    .counter-left {
        background-color:   var(--color);
        border-radius:      3px 5px 5px 3px;
        color:              var(--color-text);
        padding:            0px 16px;
    }
    .counter-left i {
        line-height: 32px;
        vertical-align: top;
        color: var(--color-text);
    }
    .counter-left i ~ .counter-text {
        margin-left: 5px;
    }
    .counter-main:focus .counter-left,
    .counter-main:hover .counter-left {
        background-color:   var(--color-hover);
        color:              var(--color-text-hover);
    }
    .counter-main:focus .counter-left i,
    .counter-main:hover .counter-left i {
        color:              var(--color-text-hover);
    }
    .check .counter-left{
        background-color:   var(--color-checked);
        color:              var(--color-text-checked);
        border-radius:      3px 0 0 3px;
    }
    .check .counter-left i {
        color:              var(--color-text-checked);
    }
    .counter-main.check:focus .counter-left,
    .counter-main.check:hover .counter-left {
        background-color:   var(--color-checked-hover);
        color:              var(--color-text-checked-hover);
    }
    .counter-main.check:focus .counter-left i ,
    .counter-main.check:hover .counter-left i {
        color:              var(--color-text-checked-hover);
    }
    .counter-right {
        background-color:   none;
        border-radius:      0 5px 5px 0;
        color:              var(--color);
        padding:            0px 16px;
        position:           relative;
    }
    .counter-main:focus .counter-right,
    .counter-main:hover .counter-right {
        color:              var(--color-hover);
    }
    .check .counter-right {
        color:  var(--color-checked);
    }
    .counter-main.check:focus .counter-right,
    .counter-main.check:hover .counter-right {
        color:  var(--color-checked-hover);
    }
    .counter-right .counter-text {
        font-weight:    700;
        text-transform: none;
    }
    .check .counter-arrow {
        position:           absolute;
        top:                50%;
        left:               0;
        width:              0;
        height:             0;
        border:             8px solid transparent;
        border-right-color: var(--color-background);
        transform:          translate(-100%,-50%);
    }
</style>