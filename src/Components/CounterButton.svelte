<script>
    // IMPORT
    import { createEventDispatcher } from 'svelte';
    import Events from '../Utils/Events';

    // PUBLIC ATTRIBUTES
    export let text = '';
    export let style = "";
    export let icon = '';
    export let disable = false;
    export let value = 0;
    export let check = false;
    export let name = "";
    export let cls = "";

    // PRIVATE ATTRIBUTES
    const dispatch = createEventDispatcher();
    $: displayedCounter = formatCount(value);
    let id = '_' + Math.random().toString(36).substring(2, 12);

    // EVENTS
    function onChange(event) {
        if(!disable){
            check ? value++ : value--;
            let params = Events.copy(event);
            params.check = check;
            params.value = value;
            setTimeout(() => dispatch('click',{
                ...params
            }), 100);
        }
    }
    
    // METHODS
    function formatCount(count){
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
            parts[1] = parts[1].substring(0,3-parts[0].length);
        }
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        base = parts.join(".").replaceAll('.',',');
        if(base.endsWith(',')) {
            base = base.substring(0,base.length - 1);
        }
        return base + unit;
    }
</script>


<input type="checkbox" {id} bind:checked={check} {name} {value} disabled={disable} tabindex={disable ? "-1" : "0"} on:change={onChange}/>
<label 
    for={id}
    class="counter-main {cls}"
    {style}
>
    <span class="counter-left">
        {#if icon}
            <i class="material-icons-round" role="presentation">{icon}</i>
        {/if}
        {#if text}
            <span class="counter-text">{text}</span>
        {/if}
    </span>
    <span class="counter-right">
        <span class="counter-text">{displayedCounter}</span>
        <span class="counter-arrow"></span>
    </span>
</label>


<style>
    input{
        opacity: 0;
        width: 0px;
        height: 0px;
        padding: 0px;
        margin: 0px;
        position: absolute;
        top: 0;
        left: 0;
    }
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
    input:checked + .counter-main {
        border: 1px solid var(--color-checked);
    }
    input:focus-visible + .counter-main,
    .counter-main:hover {
        border: 1px solid var(--color-hover);
    }
    input:checked:focus-visible + .counter-main,
    input:checked + .counter-main:hover {
        border: 1px solid var(--color-checked-hover);
    }
    input:disabled + .counter-main {
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
        font-size: inherit;
    }
    .counter-left i + .counter-text {
        margin-left: 5px;
    }
    input:focus-visible + .counter-main .counter-left,
    .counter-main:hover .counter-left {
        background-color:   var(--color-hover);
    }
    input:checked + .counter-main .counter-left{
        background-color:   var(--color-checked);
        color:              var(--color-text-checked);
        border-radius:      3px 0 0 3px;
    }
    .check .counter-left i {
        color:              var(--color-text-checked);
    }
    input:checked:focus-visible + .counter-main .counter-left,
    input:checked + .counter-main:hover .counter-left {
        background-color:   var(--color-checked-hover);
    }
    .counter-right {
        background-color:   none;
        border-radius:      0 5px 5px 0;
        color:              var(--color);
        padding:            0px 16px;
        position:           relative;
    }
    input:focus-visible + .counter-main .counter-right,
    .counter-main:hover .counter-right {
        color:              var(--color-hover);
    }
    input:checked + .counter-main .counter-right {
        color:  var(--color-checked);
    }
    input:checked:focus-visible + .counter-main .counter-right,
    input:checked + .counter-main:hover .counter-right {
        color:  var(--color-checked-hover);
    }
    .counter-right .counter-text {
        font-weight:    700;
        text-transform: none;
    }
    input:checked + .counter-main .counter-arrow {
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