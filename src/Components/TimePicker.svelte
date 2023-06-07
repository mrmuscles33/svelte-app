<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Textfield from './Textfield.svelte';
        import Button from './Button.svelte';
        import Tooltip from './Tooltip.svelte';
        import Events from '../Utils/Events';
        import Times from '../Utils/Times';
        
        // PUBLIC ATTRIBUTES
        export let format = Times.H_M;
        export let value = "";
        export let disable = false;
        export let width = 290;
        export let iconLeft = "";
        export let label = "";
        export let errorMessage = "";
        export let required = false;
        export let readonly = false;
        export let filled = true;

        export let minTime = Times.format('00:00', format);
        export let maxTime = Times.format('23:59', format);
        export let clockOnly = false;
        
        // PRIVATE ATTRIBUTES
        let pattern = Times.getPattern(format);
        let type = "text";
        let tmpValue = Times.isValid(value) ? Times.format(value, Times.H_M_S) : Times.toText(Times.now(), Times.H_M_S);
        let visible = false;
        let input;
        let clock;
        let selectHour = true;
        let morning = Times.getHours(tmpValue) != 0 && Times.getHours(tmpValue) < 13;
        let minutes = [0,5,10,15,20,25,30,35,40,45,50,55];
        let focusedHour = Times.getHours(tmpValue);
        let focusedMinute = minutes.slice().sort((a,b) => Math.abs(a - Times.getMinutes(tmpValue)) <= Math.abs(b - Times.getMinutes(tmpValue)) ? -1 : 1)[0];
        $: displayedHours = morning ? [12,1,2,3,4,5,6,7,8,9,10,11] : [0,13,14,15,16,17,18,19,20,21,22,23];

        // EVENTS
        const dispatch = createEventDispatcher();
        function onBlur(evt) {
                let event = evt.detail;
                value = Times.isValid(value) ? Times.format(value, format) : value;
                let params = Events.copy(event);
                params.value = value;
                dispatch('blur', {
                        ...params
                });
        }
        function onChange(evt){
                let event = evt.detail;
                if(errorMessage == "" && value != ""){
                        errorMessage = Times.toTime(value) < Times.toTime(minTime) || Times.toTime(value) > Times.toTime(maxTime) ? "L'heure doit etre comprise entre " + minTime + " et " + maxTime : "";
                }
                let params = Events.copy(event);
                params.value = value;
                dispatch('change', {
                        ...params
                });
        }
	function onClickIcon() {
                visible = true;
                selectHour = true;
                tmpValue = Times.isValid(value) ? value : Times.toText(Times.now(), Times.H_M_S);
                morning = Times.getHours(tmpValue) < 13 && Times.getHours(tmpValue) > 0;
                focusedHour = Times.getHours(tmpValue);
                focusedMinute = minutes.slice().sort((a,b) => Math.abs(a - Times.getMinutes(tmpValue)) <= Math.abs(b - Times.getMinutes(tmpValue)) ? -1 : 1)[0];
                setTimeout(() => {
                        clock.querySelector('.timepicker-hour > span[tabindex="0"]')?.focus();
                }, 100);
        }
        function onClickMask(evt) {
                if(evt.target == this){
                        onClickFermer();
                }
        }
        function onClickFermer(){
                visible = false;
                input.getInput().focus();
        }
        function onClickValider(){
                onClickFermer();
                value = Times.format(tmpValue, format);
                setTimeout(() => {
                        input.onChange();
                }, 200);
        }
        function onClickHour(evt){
                var hour = evt.currentTarget.getAttribute('hour');
                if(Times.getHours(minTime) > parseInt(hour) || Times.getHours(maxTime) < parseInt(hour)) return false;
                tmpValue = Times.toText((parseInt(hour) * 60 * 60) + (Times.getMinutes(tmpValue) * 60), Times.H_M_S);
                selectHour = false;
                var parent = evt.currentTarget.parentElement.parentElement;
                // Waiting for minutes display
                setTimeout(() => {
                        parent.querySelector('[tabindex="0"]').focus();
                }, 50);
        }
        function onClickMinute(evt){
                var minute = evt.currentTarget.getAttribute('minute');
                var time = (Times.getHours(tmpValue) * 60 * 60) + (parseInt(minute) * 60);
                if(Times.toTime(minTime, format) > time || Times.toTime(maxTime, format) < time) return false;
                tmpValue = Times.toText(60 * 60 * Times.getHours(tmpValue) + (60 * parseInt(minute)), Times.H_M_S);
        }
        function onClickSelectHour(){
                selectHour = true;
        }
        function onClickSelectMinute(){
                selectHour = false;
        }
        function onClickAM(){
                morning = true;
        }
        function onClickPM(){
                morning = false;
        }

        // METHODS
        function onEscMask(evt){
                if(Events.isEsc(evt)){
                        onClickFermer();
                }
        }
        function onEnterHour(event){
                if(Events.isEnter(event)) {
                        onClickHour(event);
                }
        }
        function onNavigateHour(event) {
                if(Events.isArrow(event)) {
                        var clickedHour = parseInt(event.currentTarget.getAttribute('hour'));
                        var nextHour = clickedHour;
                        if (Events.isArrowLeft(event) || Events.isArrowDown(event)) {
                                nextHour--;
                        } else if (Events.isArrowRight(event) || Events.isArrowUp(event)) {
                                nextHour++;
                        }
                        if(nextHour > Times.getHours(maxTime)) {
                                nextHour = Times.getHours(minTime);
                        } else if(nextHour < Times.getHours(minTime)) {
                                nextHour = Times.getHours(maxTime);
                        }
                        morning = nextHour != 0 && nextHour < 13;
                        var parent = event.currentTarget.parentElement.parentElement;
                        // Waiting for the AM/PM changing
                        setTimeout(() => {
                                parent.querySelector('[hour="' + nextHour + '"]').focus();
                        }, 10);
                        focusedHour = nextHour;
                        event.preventDefault();
                        event.stopPropagation();
                }
        }
        function onEnterMinute(event){
                if(Events.isEnter(event)) {
                        onClickMinute(event);
                }
        }
        function onNavigateMinute(event) {
                if(Events.isArrow(event)) {
                        var clickedMinute = parseInt(event.currentTarget.getAttribute('minute'));
                        var nextMinute = clickedMinute;
                        if (Events.isArrowLeft(event) || Events.isArrowDown(event)) {
                                nextMinute -= 5;
                        } else if (Events.isArrowRight(event) || Events.isArrowUp(event)) {
                                nextMinute += 5;
                        }
                        var enableMinutes = minutes.filter(m => 
                                Times.toTime(minTime) <= (Times.getHours(tmpValue) * 60 * 60 + m * 60) && 
                                (Times.getHours(tmpValue) * 60 * 60 + m * 60) <= Times.toTime(maxTime)
                        );
                        if(Times.getHours(tmpValue) * 60 * 60 + nextMinute * 60 > Times.toTime(maxTime) || nextMinute > 55) {
                                nextMinute = enableMinutes[0];
                        } else if(Times.getHours(tmpValue) * 60 * 60 + nextMinute * 60 < Times.toTime(minTime) || nextMinute < 0) {
                                nextMinute = enableMinutes.reverse()[0];
                        }
                        event.currentTarget.parentElement.parentElement.querySelector('[minute="' + nextMinute + '"]').focus();
                        focusedMinute = nextMinute;
                        event.preventDefault();
                        event.stopPropagation();
                }
        }
        function onEnterSelectHour(event) {
                if(Events.isEnter(event)) {
                        onClickSelectHour();
                }
        }
        function onKeyDownSelectHour(event){
                if(Events.isTab(event) && Events.isShift(event)){
                        event.preventDefault();
                        event.stopPropagation();
                }
        }
        function onEnterSelectMinute(event){
                if(Events.isEnter(event)) {
                        onClickSelectMinute();
                }
        }
        function onEnterAM(event){
                if(Events.isEnter(event)) {
                        onClickAM();
                }
        }
        function onEnterkPM(event){
                if(Events.isEnter(event)) {
                        onClickPM();
                }
        }
        function onKeyDownValider(evt){
                evt = evt.detail.event;
                if(Events.isTab(evt) && !Events.isShift(evt)){
                        evt.preventDefault();
                        evt.stopPropagation();
                }
        }
</script>

<Textfield 
        bind:value={value}
        {disable}
        {width}
        {iconLeft}
        {required}
        {type}
        {format}
        readonly={readonly || clockOnly}
        iconRight={readonly ? "" : "schedule"}
        {pattern}
        {label}
        {filled}
        bind:errorMessage={errorMessage}
        on:change={onChange}
        on:blur={onBlur}
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
     style="--rotate-hour : {(30 * Times.getHours(tmpValue)) + (0.5 * Times.getMinutes(tmpValue))}deg;
            --rotate-minute : {6 * Times.getMinutes(tmpValue)}deg;"
     on:click={onClickMask}
     on:keydown={onEscMask}>
        <div class="timepicker-main">
                <div class="timepicker-info">
                        <h4>{label}</h4>
                        <div class="timepicker-time">
                                <Tooltip text="Sélectionner l'heure">
                                        <span role="button" tabindex="0"
                                           on:click|stopPropagation|preventDefault={onClickSelectHour} 
                                           on:keypress|stopPropagation|preventDefault={onEnterSelectHour} 
                                           on:keydown={onKeyDownSelectHour}
                                           class:timepicker-selected={selectHour}>
                                                {Times.getHours(tmpValue).toString().padStart(2,'0')}
                                        </span>
                                </Tooltip>
                                :
                                <Tooltip text="Sélectionner les minutes">
                                        <span role="button" tabindex="0"
                                           on:click|stopPropagation|preventDefault={onClickSelectMinute} 
                                           on:keypress|stopPropagation|preventDefault={onEnterSelectMinute} 
                                           class:timepicker-selected={!selectHour}>
                                                {Times.getMinutes(tmpValue).toString().padStart(2,'0')}
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
                        <div class="timepicker-clock" bind:this={clock}>
                                {#if selectHour}
                                        {#each displayedHours as hour}
                                                <div class="timepicker-hour">
                                                        <span role="button" 
                                                        tabindex={
                                                                (
                                                                        // If focused hour is between min and max and contained in displayed hours
                                                                        displayedHours.some(h => focusedHour == h && Times.getHours(minTime) <= h && h <= Times.getHours(maxTime)) && 
                                                                        focusedHour == hour
                                                                ) || (
                                                                        // If focused hour isn't between min and max, take first available hour
                                                                        !displayedHours.some(h => focusedHour == h && Times.getHours(minTime) <= h && h <= Times.getHours(maxTime)) 
                                                                        && displayedHours.find(h => Times.getHours(minTime) <= h  && h <= Times.getHours(maxTime)) == hour
                                                                ) ? "0" : "-1"
                                                           } 
                                                           on:click|stopPropagation|preventDefault={onClickHour}
                                                           on:keypress|stopPropagation|preventDefault={onEnterHour}
                                                           on:keydown={onNavigateHour}
                                                           class:timepicker-hour-selected={Times.getHours(tmpValue) == hour}
                                                           class:timepicker-hour-disable={Times.getHours(minTime) > hour || Times.getHours(maxTime) < hour}
                                                           hour={hour}>
                                                                {hour}
                                                        </span>
                                                </div>
                                        {/each}
                                {:else}
                                        {#each minutes as minute}
                                                <div class="timepicker-hour">
                                                        <span role="button" 
                                                           tabindex={
                                                                (
                                                                        // If focused minute with selected hour is between min and max
                                                                        minute == focusedMinute && Times.toTime(minTime) <= (Times.getHours(tmpValue) * 60 * 60 + focusedMinute * 60) && 
                                                                        (Times.getHours(tmpValue) * 60 * 60 + focusedMinute * 60) <= Times.toTime(maxTime)
                                                                ) || (
                                                                        // If focused minute with selected hour isn't between min and max
                                                                        // take first available minute (using selected hour)
                                                                        (
                                                                                Times.toTime(minTime) > (Times.getHours(tmpValue) * 60 * 60 + focusedMinute * 60) || 
                                                                                (Times.getHours(tmpValue) * 60 * 60 + focusedMinute * 60) > Times.toTime(maxTime)
                                                                        ) && minutes.find(m => 
                                                                                Times.toTime(minTime) <= (Times.getHours(tmpValue) * 60 * 60 + m * 60) && 
                                                                                (Times.getHours(tmpValue) * 60 * 60 + m * 60) <= Times.toTime(maxTime)
                                                                        ) == minute
                                                                ) ? "0" : "-1"
                                                           } 
                                                           on:click|stopPropagation|preventDefault={onClickMinute} 
                                                           on:keypress|stopPropagation|preventDefault={onEnterMinute}
                                                           on:keydown={onNavigateMinute}
                                                           class:timepicker-hour-selected={Math.abs(Times.getMinutes(tmpValue) - minute) < 3}
                                                           class:timepicker-hour-disable={Times.toTime(minTime) > (Times.getHours(tmpValue) * 60 * 60 + minute * 60) || Times.toTime(maxTime) < (Times.getHours(tmpValue) * 60 * 60 + minute * 60)}
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
                                        icon="close"
                                        border={false}
                                        on:click={onClickFermer}
                                />
                                <Button
                                        text="Valider"
                                        icon="done"
                                        primary={true}
                                        on:click={onClickValider}
                                        on:keydown={onKeyDownValider}
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