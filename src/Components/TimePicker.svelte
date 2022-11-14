<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Textfield from './Textfield.svelte';
        import Button from './Button.svelte';
        import Tooltip from './Tooltip.svelte';
        import Events from '../Utils/Events';
        
        // PUBLIC ATTRIBUTES
        export let value = "";
        export let disable = false;
        export let width = 290;
        export let iconLeft = "";
        export let label = "";
        export let errorMessage = "";
        export let required = false;
        export let readonly = false;
        export let filled = true;

        export let minTime = '00:00';
        export let maxTime = '23:59';
        export let clockOnly = false;
        
        // PRIVATE ATTRIBUTES
        let type = "text";
        let tmpValue = isValidTime(value) ? value : new Date().getHours().toString().padStart(2,'0') + ':' + new Date().getMinutes().toString().padStart(2,'0');
        let visible = false;
        let input;
        let selectHour = true;
        let morning = true;
        let minutes = [0,5,10,15,20,25,30,35,40,45,50,55];
        $: displayedHours = morning ? [12,1,2,3,4,5,6,7,8,9,10,11] : [0,13,14,15,16,17,18,19,20,21,22,23];

        // EVENTS
        const dispatch = createEventDispatcher();
        export function onChange(evt){
                if(errorMessage == "" && value != ""){
                        errorMessage = textToTime(value) < textToTime(minTime) || textToTime(value) > textToTime(maxTime,'DD/MM/YYYY') ? "L'heure doit etre comprise entre " + minTime + " et " + maxTime : "";
                }
                dispatch('change', {
                        value: value,
                        oldValue: evt.detail.oldValue
                });
        }
	export function onClickIcon() {
                visible = true;
                selectHour = true;
                tmpValue = isValidTime(value) ? value : new Date().getHours().toString().padStart(2,'0') + ':' + new Date().getMinutes().toString().padStart(2,'0');
                morning = getHour(tmpValue) < 13 && getHour(tmpValue) > 0;
        }
        export function onClickMask(evt) {
                if(evt.target == this){
                        onClickFermer();
                }
        }
        export function onClickFermer(){
                visible = false;
        }
        export function onClickValider(){
                onClickFermer();
                value = tmpValue;
                setTimeout(() => {
                        input.onChange();
                }, 200);
        }
        export function onClickHour(evt){
                var hour = evt.currentTarget.getAttribute('hour');
                if(getHour(minTime) > parseInt(hour) || getHour(maxTime) < parseInt(hour)) return false;
                tmpValue = timeToText(parseInt(hour) * 60 + getMinute(tmpValue));
                selectHour = false;
        }
        export function onEnterHour(event){
                if(Events.isEnter(event)) {
                        onClickHour(event);
                }
        }
        export function onClickMinute(evt){
                var minute = evt.currentTarget.getAttribute('minute');
                if(textToTime(minTime) > (getHour(tmpValue) * 60 + parseInt(minute)) || textToTime(maxTime) < (getHour(tmpValue) * 60 + parseInt(minute))) return false;
                tmpValue = timeToText(60 * getHour(tmpValue) + parseInt(minute));
        }
        export function onEnterMinute(event){
                if(Events.isEnter(event)) {
                        onClickMinute(event);
                }
        }
        export function onClickSelectHour(){
                selectHour = true;
        }
        export function onEnterSelectHour(event) {
                if(Events.isEnter(event)) {
                        onClickSelectHour();
                }
        }
        export function onClickSelectMinute(){
                selectHour = false;
        }
        export function onEnterSelectMinute(event){
                if(Events.isEnter(event)) {
                        onClickSelectMinute();
                }
        }
        export function onClickAM(){
                morning = true;
        }
        export function onEnterAM(event){
                if(Events.isEnter(event)) {
                        onClickAM();
                }
        }
        export function onClickPM(){
                morning = false;
        }
        export function onEnterkPM(event){
                if(Events.isEnter(event)) {
                        onClickPM();
                }
        }

        // METHODS
        function isValidTime(time) {
                return new RegExp("([0-1][0-9]|2[0-3]):[0-5][0-9]").test(time);
        }
        function textToTime(strTime) {
                return 60*getHour(strTime) + getMinute(strTime);
        }
        function timeToText(time) {
                var hour = Math.floor(time/60);
                var minute = time - (hour * 60);
                return hour.toString().padStart(2,'0') + ':' + minute.toString().padStart(2,'0');
        }
        function getHour(time){
                return isValidTime(time) ? parseInt(time.substring(0,2)) : 0;
        }
        function getMinute(time){
                return isValidTime(time) ? parseInt(time.substring(3,5)) : 0;
        }
</script>

<Textfield 
        bind:value={value}
        {disable}
        {width}
        {iconLeft}
        {required}
        {type}
        format="hh:mm"
        readonly={readonly || clockOnly}
        iconRight={readonly ? "" : "schedule"}
        pattern="([0-1][0-9]|2[0-3]):[0-5][0-9]"
        {label}
        {filled}
        bind:errorMessage={errorMessage}
        on:change={onChange}
        on:blur
        on:clickIcon={onClickIcon}
        on:focus
        on:focusout
        on:input
        on:keydown
        on:keyup
        bind:this={input}
/>

<div class="timepicker-mask"
     class:timepicker-visible={visible}
     style="--rotate-hour : {(30 * getHour(tmpValue)) + (0.5 * getMinute(tmpValue))}deg;
            --rotate-minute : {6 * getMinute(tmpValue)}deg;"
     on:click={onClickMask}>
        <div class="timepicker-main">
                <div class="timepicker-info">
                        <h4>{label}</h4>
                        <div class="timepicker-time">
                                <Tooltip text="Sélectionner l'heure">
                                        <span role="button" tabindex="0"
                                           on:click|stopPropagation|preventDefault={onClickSelectHour} 
                                           on:keypress|stopPropagation|preventDefault={onEnterSelectHour} 
                                           class:timepicker-selected={selectHour}>
                                                {getHour(tmpValue).toString().padStart(2,'0')}
                                        </span>
                                </Tooltip>
                                :
                                <Tooltip text="Sélectionner les minutes">
                                        <span role="button" tabindex="0"
                                           on:click|stopPropagation|preventDefault={onClickSelectMinute} 
                                           on:keypress|stopPropagation|preventDefault={onEnterSelectMinute} 
                                           class:timepicker-selected={!selectHour}>
                                                {getMinute(tmpValue).toString().padStart(2,'0')}
                                        </span>
                                </Tooltip>
                                {#if selectHour}
                                        <div class="timepicker-morning">
                                                <Tooltip text="Matin">
                                                        <span role="button" tabindex="0" 
                                                           on:click|stopPropagation|preventDefault={onClickAM} 
                                                           on:keypress|stopPropagation|preventDefault={onEnterAM} 
                                                           class:timepicker-selected={morning}>
                                                                AM
                                                        </span>
                                                </Tooltip>
                                                <Tooltip text="Après-midi">
                                                        <span role="button" tabindex="0" 
                                                           on:click|stopPropagation|preventDefault={onClickPM} 
                                                           on:keypress|stopPropagation|preventDefault={onEnterkPM} 
                                                           class:timepicker-selected={!morning}>
                                                                PM
                                                        </span>
                                                </Tooltip>     
                                        </div>
                                {/if}
                        </div>
                </div><!--
             --><div class="timepicker-select">
                        <div class="timepicker-clock">
                                {#if selectHour}
                                        {#each displayedHours as hour}
                                                <div class="timepicker-hour">
                                                        <span role="button" 
                                                           tabindex={(getHour(minTime) > hour || getHour(maxTime) < hour) ? "-1" : "0"} 
                                                           on:click|stopPropagation|preventDefault={onClickHour}
                                                           on:keypress|stopPropagation|preventDefault={onEnterHour}
                                                           class:timepicker-hour-selected={getHour(tmpValue) == hour}
                                                           class:timepicker-hour-disable={getHour(minTime) > hour || getHour(maxTime) < hour}
                                                           hour={hour}>
                                                                {hour}
                                                        </span>
                                                </div>
                                        {/each}
                                {:else}
                                        {#each minutes as minute}
                                                <div class="timepicker-hour">
                                                        <span role="button" 
                                                           tabindex={(textToTime(minTime) > (getHour(tmpValue) * 60 + minute) || textToTime(maxTime) < (getHour(tmpValue) * 60 + minute)) ? "-1" : "0"} 
                                                           on:click|stopPropagation|preventDefault={onClickMinute} 
                                                           on:keypress|stopPropagation|preventDefault={onEnterMinute}
                                                           class:timepicker-hour-selected={Math.abs(getMinute(tmpValue) - minute) < 3}
                                                           class:timepicker-hour-disable={textToTime(minTime) > (getHour(tmpValue) * 60 + minute) || textToTime(maxTime) < (getHour(tmpValue) * 60 + minute)}
                                                           minute={minute}>
                                                                {minute}
                                                        </span>
                                                </div>
                                        {/each}
                                {/if}
                                <div class="timepicker-aiguille timepicker-aiguille-hour">
                                        <div></div>
                                </div>
                                <div class="timepicker-aiguille timepicker-aiguille-minute">
                                        <div></div>
                                </div>
                                <div class="timepicker-aiguille-center"></div>
                        </div>
                        <div class="timepicker-buttons">
                                <Button
                                        text="Fermer"
                                        border={false}
                                        on:click={onClickFermer}
                                />
                                <Button
                                        text="Valider"
                                        primary={true}
                                        on:click={onClickValider}
                                />
                        </div>
                </div>
        </div>
</div>

<style>
        .timepicker-mask {
                position: fixed;
                width: 100%;
                height: 100%;
                background-color: rgba(150,150,150,0.5);
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
        .timepicker-visible {
                visibility: visible;
                pointer-events: auto;
                opacity: 1;
        }
        .timepicker-main {
                width: 630px;
                transform: scale(0.8);
                background-color: var(--color-background);
                border-radius: 8px;
                box-shadow: 0 6px 25px rgba(150,150,150,0.7);
                overflow: hidden;
                transition: transform 0.2s;
                display: flex;
                align-items: stretch;
                overflow: visible;
        }
        .timepicker-visible .timepicker-main {
                transform: scale(1);
        }
        .timepicker-info {
                width: 250px;
                background-color: var(--color-primary);
                color: var(--color-font-selected);
                padding: 20px 15px;
                box-sizing: border-box;
                position: relative;
                display: flex;
                vertical-align: top;
                border-radius: 10px 0 0 10px;
        }
        h4 {
                padding: 0;
                margin: 0;
                font-size: 18px;
                font-weight: 100;
                letter-spacing: 2.5px;
        }
        .timepicker-time {
                margin: 0;
                font-weight: 500;
                font-size: 40px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 100%;
                text-align: center;
        }
        .timepicker-time span {
                text-decoration: none;
                color: var(--color-font-selected);
                padding: 0 8px;
                border-radius: 5px;
                cursor: pointer;
                outline: none;
        }
        .timepicker-time span:hover,
        .timepicker-time span:focus-visible {
                color: var(--color-font);
                background-color: var(--color-left-background);
        }
        .timepicker-time span:focus-visible {
                border: 2px solid var(--color-font);
        }
        .timepicker-time span.timepicker-selected:hover,
        .timepicker-time span.timepicker-selected:focus-visible,
        .timepicker-time span.timepicker-selected {
                background-color: var(--color-left-background);
                color: var(--color-font);
        }
        .timepicker-morning {
                font-size: 26px;
                margin-top: 20px;
        }
        .timepicker-select {
                display: inline-block;
                vertical-align: top;
                width: 380px;
                padding: 10px;
                box-sizing: border-box;
        }
        .timepicker-clock {
                width: 340px;
                height: 340px;
                border-radius: 180px;
                background-color: var(--color-clock-background);
                position: relative;
                margin: 20px 10px;
        }
        .timepicker-hour {
                position: absolute;
                height: calc(100% - 100px);
                top: 50px;
                left: 50%;
                transform: translateX(-50%);
        }
        .timepicker-hour:nth-child(2) {
                transform: translateX(-50%) rotate(30deg);
        }
        .timepicker-hour:nth-child(3) {
                transform: translateX(-50%) rotate(60deg);
        }
        .timepicker-hour:nth-child(4) {
                transform: translateX(-50%) rotate(90deg);
        }
        .timepicker-hour:nth-child(5) {
                transform: translateX(-50%) rotate(120deg);
        }
        .timepicker-hour:nth-child(6) {
                transform: translateX(-50%) rotate(150deg);
        }
        .timepicker-hour:nth-child(7) {
                transform: translateX(-50%) rotate(180deg);
        }
        .timepicker-hour:nth-child(8) {
                transform: translateX(-50%) rotate(210deg);
        }
        .timepicker-hour:nth-child(9) {
                transform: translateX(-50%) rotate(240deg);
        }
        .timepicker-hour:nth-child(10) {
                transform: translateX(-50%) rotate(270deg);
        }
        .timepicker-hour:nth-child(11) {
                transform: translateX(-50%) rotate(300deg);
        }
        .timepicker-hour:nth-child(12) {
                transform: translateX(-50%) rotate(330deg);
        }
        .timepicker-hour span {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 45px;
                height: 45px;
                border-radius: 45px;
                cursor: pointer;
                text-decoration: none;
                font-weight: 500;
                transform: translateY(-100%);
                color: var(--color-font);
        }
        .timepicker-hour span:hover,
        .timepicker-hour span:focus-visible {
                background-color: var(--color-hover);
                color: var(--color-font);
        }
        .timepicker-hour span.timepicker-hour-disable {
                color: var(--color-font-other);
                cursor: not-allowed;
        }
        .timepicker-hour span.timepicker-hour-selected,
        .timepicker-hour span.timepicker-hour-selected:hover,
        .timepicker-hour span.timepicker-hour-selected:focus-visible {
                background-color: var(--color-primary);
                color: var(--color-font-selected);
        }
        .timepicker-hour:nth-child(2) span {
                transform: translateY(-100%) rotate(-30deg);
        }
        .timepicker-hour:nth-child(3) span {
                transform: translateY(-100%) rotate(-60deg);
        }
        .timepicker-hour:nth-child(4) span {
                transform: translateY(-100%) rotate(-90deg);
        }
        .timepicker-hour:nth-child(5) span {
                transform: translateY(-100%) rotate(-120deg);
        }
        .timepicker-hour:nth-child(6) span {
                transform: translateY(-100%) rotate(-150deg);
        }
        .timepicker-hour:nth-child(7) span {
                transform: translateY(-100%) rotate(-180deg);
        }
        .timepicker-hour:nth-child(8) span {
                transform: translateY(-100%) rotate(-210deg);
        }
        .timepicker-hour:nth-child(9) span {
                transform: translateY(-100%) rotate(-240deg);
        }
        .timepicker-hour:nth-child(10) span {
                transform: translateY(-100%) rotate(-270deg);
        }
        .timepicker-hour:nth-child(11) span {
                transform: translateY(-100%) rotate(-300deg);
        }
        .timepicker-hour:nth-child(12) span {
                transform: translateY(-100%) rotate(-330deg);
        }
        .timepicker-aiguille,
        .timepicker-aiguille-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
        }
        .timepicker-aiguille-center {
                width: 12px;
                height: 12px;
                border-radius: 6px;
                background-color: var(--color-primary);
        }
        .timepicker-aiguille-hour {
                height: 40%;
                transform: translate(-50%,-50%) rotate(var(--rotate-hour));
        }
        .timepicker-aiguille-minute {
                height: 55%;
                transform: translate(-50%,-50%) rotate(var(--rotate-minute));
        }
        .timepicker-aiguille-hour div,
        .timepicker-aiguille-minute div{
                height: 50%;
                border-radius: 5px;
                background-color: var(--color-primary);
        }
        .timepicker-aiguille-hour div{
                border: 3px solid var(--color-primary);
        }
        .timepicker-aiguille-minute div{
                border: 2px solid var(--color-primary);
        }
        .timepicker-buttons {
                float: right;
        }
</style>