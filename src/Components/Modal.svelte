<script>
	// IMPORTS
    import { createEventDispatcher } from 'svelte';
	import Events from '../Utils/Events';
	import Toolbar from './Toolbar.svelte';
	import Button from './Button.svelte';

	// PUBLIC ATTIRUBUTES
    export let title = "";
    export let visible = false;
	export let width = 500;
    export let minHeight = 200;
    export let cls = "";
    export let style = "";

	// PRIVATE PRIVATE ATTIRUBUTES

	// PUBLIC METHODS
    const dispatch = createEventDispatcher();
    export function show(){
        visible = true;
        dispatch('show', {});
    }

    export function close(){
        visible = false;
        dispatch('close', {});
    }

    // PRIVATE METHODS
    function onClickFermer(){
        close();
    }

	// EVENTS
	function onClickMask(evt) {
        if(evt.target == this){
            onClickFermer();
        }
    }
	function onEscMask(evt){
        if(Events.isEsc(evt)){
            onClickFermer();
        }
    }

</script>

<div class="modal-mask {cls}"
     class:modal-visible={visible}
	 style="--modal-width: {width}px; --modal-min-height: {minHeight}px; {style}"
     on:click={onClickMask}
     on:keydown={onEscMask}>
	<div class="modal-main">
        {#if title != ""}
			<div class="modal-title">{title}</div>
        {/if}
        <div class="modal-content">
            <slot name="modal-content"></slot>
        </div>
        <slot name="modal-buttons">
            <Toolbar slot="modal-buttons">
				<Button
					text="Fermer"
                    primary={true}
					on:click={onClickFermer}
				/>
			</Toolbar>
        </slot>
	</div>
</div>

<style>
	.modal-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: var(--mask-color);
        top: 0;
        left: 0;
        backdrop-filter: blur(2px);
        visibility: hidden;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }
    .modal-visible {
        visibility: visible;
        pointer-events: all;
        opacity: 1;
    }
    .modal-main {
        width: var(--modal-width);
        transform: scale(0.8);
        background-color: #FFF;
        border-radius: 8px;
        box-shadow: 0 6px 25px rgba(150,150,150,0.7);
        overflow: visible;
        transition: transform 0.2s;
        padding: 10px 10px 5px 10px;
    }
    .modal-visible .modal-main {
        transform: scale(1);
    }
    .modal-title {
        font-weight: bold;
        font-size: 20px;
        margin: 10px 5px;
    }
    .modal-content {
        max-height: 70vh;
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 10px;
        min-height: var(--modal-min-height);
    }
</style>
