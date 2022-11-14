<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Textfield from './Textfield.svelte';
        import Button from './Button.svelte';
        import Tooltip from './Tooltip.svelte';
        import Dates from '../Utils/Dates';
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
        export let cls = "";
        export let minDate = '01/01/1900';
        export let maxDate = '31/12/2099';
        export let startWeek = Dates.MONDAY;
        export let filled = true;
        export let calendarOnly = false;
        
        // PRIVATE ATTRIBUTES
        let type = "text";
        let days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
        let months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
        let visible = false;
        let tmpValue = value || Dates.toText(new Date(), 'DD/MM/YYYY');
        let currentMonth = Dates.toText(Dates.toDate(tmpValue,'DD/MM/YYYY'),'MM/YYYY');
        let input;
        let showYears = false;
        let displayedYears = [];
        let yearsPage = 0;
        let endWeek = startWeek == 0 ? 6 : startWeek - 1;
        let id = '_' + Math.random().toString(36).substring(2, 12);
        $: allYear = getDisplayedYears(minDate,maxDate);
        $: displayedDays = getDisplayedDays(currentMonth);
        $: sortedDays = days.slice(startWeek,7).concat(days.slice(0,startWeek));

        // EVENTS
        const dispatch = createEventDispatcher();
        export function onChange(evt){
                if(errorMessage == "" && value != ""){
                        errorMessage = Dates.toDate(value,'DD/MM/YYYY') < Dates.toDate(minDate,'DD/MM/YYYY') || Dates.toDate(value,'DD/MM/YYYY') > Dates.toDate(maxDate,'DD/MM/YYYY') ? "La date doit etre comprise entre " + minDate + " et " + maxDate : "";
                }
                dispatch('change', {
                        value: value,
                        oldValue: evt.detail.oldValue
                });
        }
	export function onClickIcon() {
                visible = true;
                tmpValue = Dates.isValid(value,'DD/MM/YYYY') ? value : Dates.toText(new Date(), 'DD/MM/YYYY');
                currentMonth = Dates.toText(Dates.toDate(tmpValue,'DD/MM/YYYY'),'MM/YYYY');
                showYears = false;
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
        export function onClickDay(evt) {
                var clickedDate = evt.currentTarget.getAttribute('value');
                if(Dates.toDate(clickedDate,"DD/MM/YYYY") < Dates.toDate(minDate,"DD/MM/YYYY") || Dates.toDate(clickedDate,"DD/MM/YYYY") > Dates.toDate(maxDate,"DD/MM/YYYY")) return false;
                tmpValue = clickedDate;
        }
        export function onEnterDay(event){
                if(Events.isEnter(event)) {
                        onClickDay(event);
                }
        }
        export function onClickYearButton(){
                showYears = !showYears;
                if(showYears) {
                        var currentYear = Dates.toDate(tmpValue,"DD/MM/YYYY").getFullYear();
                        for(yearsPage = 0; yearsPage * 18 < allYear.length; yearsPage++){
                                var tmpArray = allYear.slice(yearsPage * 18, yearsPage * 18 + 18);
                                if(tmpArray.includes(currentYear)){
                                        displayedYears = tmpArray;
                                        break;
                                }
                        }
                        setTimeout(() => {
                                var toFocus = document.getElementById(id).querySelector('.datepicker-year.datepicker-selected');
                                if(toFocus) {
                                        toFocus.focus();
                                }
                        }, 100);
                } else {
                        setTimeout(() => {
                                var toFocus = document.getElementById(id).querySelector('.datepicker-day.datepicker-selected');
                                if(toFocus) {
                                        toFocus.focus();
                                }
                        }, 100);
                }
        }
        export function onClickPrevious(){
                if(showYears) {
                        yearsPage--;
                        displayedYears = allYear.slice(yearsPage * 18, yearsPage * 18 + 18);
                } else {
                        var date = Dates.toDate("01/" + currentMonth,"DD/MM/YYYY");
                        date.setMonth(date.getMonth() - 1);
                        currentMonth = Dates.toText(date,"MM/YYYY");
                }
        }
        export function onClickNext(){
                if(showYears) {
                        yearsPage++;
                        displayedYears = allYear.slice(yearsPage * 18, yearsPage * 18 + 18);
                } else {
                        var date = Dates.toDate("01/" + currentMonth,"DD/MM/YYYY");
                        date.setMonth(date.getMonth() + 1);
                        currentMonth = Dates.toText(date,"MM/YYYY");
                }
        }
        export function onClickYear(evt){
                var year = evt.currentTarget.getAttribute('value');
                var newDate = Dates.toDate(tmpValue,"DD/MM/YYYY");
                newDate.setFullYear(year);
                tmpValue = Dates.toText(newDate,"DD/MM/YYYY");
                currentMonth = Dates.toText(Dates.toDate(tmpValue,'DD/MM/YYYY'),'MM/YYYY');
                onClickYearButton();
        }
        export function onEnterYear(event){
                if(Events.isEnter(event)) {
                        onClickYear(event);
                }
        }

        // METHODS
        function getDisplayedDate(strDate,format) {
                var date = Dates.toDate(strDate,format);
                return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        }
        function getDisplayedDays(monthYear){
                // If the first day of month is not the beginning of the week, replace by first day of week
                var initFirstDay = Dates.toDate('01/' + monthYear,'DD/MM/YYYY');
                var firstDay = new Date(initFirstDay);
                if(firstDay.getDay() != startWeek) {
                        if(firstDay.getDay() > startWeek) {
                                firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - startWeek));
                        } else {
                                firstDay.setDate(firstDay.getDate() - (7 - (startWeek - firstDay.getDay())));
                        }
                }
                
                // If the last day of month is not the end of the week, replace by last day of week
                var initLastDay = new Date(initFirstDay.getFullYear(),initFirstDay.getMonth() + 1, 0);
                var lastDay = new Date(initLastDay);
                if(lastDay.getDay() != endWeek) {
                        if(lastDay.getDay() < endWeek) {
                                lastDay.setDate(lastDay.getDate() + (endWeek - lastDay.getDay()));
                        } else {
                                lastDay.setDate(lastDay.getDate() + (7 - (lastDay.getDay() - endWeek)));
                        }
                }

                var days = [];
                var oneDay = firstDay;
                while(oneDay <= lastDay) {
                        days.push(new Date(oneDay));
                        oneDay.setDate(oneDay.getDate() + 1);
                }

                return days;
        }
        function getDisplayedMonth(currentMonth){
               var date =  Dates.toDate('01/' + currentMonth,'DD/MM/YYYY');
               return months[date.getMonth()] + ' ' + date.getFullYear();
        }
        function getDisplayedYears(minDate,maxDate){
                var years = [];
                for(var i = Dates.toDate(minDate,'DD/MM/YYYY').getFullYear(); i <= Dates.toDate(maxDate,'DD/MM/YYYY').getFullYear(); i++){
                        years.push(i);
                }
                return years;
        }
</script>

<Textfield 
        bind:value={value}
        {disable}
        {width}
        {iconLeft}
        {required}
        {type}
        format="DD/MM/YYYY"
        readonly={readonly || calendarOnly}
        iconRight={readonly ? "" : "today"}
        pattern="((([0-2][0-9])|(3[0-1]))(\/|-|\.)((0[13578])|10|12)(\/|-|\.)(19|20)[0-9][0-9])|((([0-2][0-9])|30)(\/|-|\.)((0[469])|11)(\/|-|\.)(19|20)[0-9][0-9])|(([0-2][0-9])(\/|-|\.)02(\/|-|\.)(19|20)[0-9][0-9])"
        {label}
        {cls}
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

<div class="datepicker-mask" {id}
     class:datepicker-visible={visible}
     on:click={onClickMask}>
        <div class="datepicker-main">
                <div class="datepicker-info">
                        <h4>{label}</h4>
                        <h1>{getDisplayedDate(tmpValue,'DD/MM/YYYY')}</h1>
                </div><!--
             --><div class="datepicker-calendar">
                        <Tooltip text={showYears ? "Choisir le jour" : "Choisir l'année"}>
                                <Button
                                        text={getDisplayedMonth(currentMonth)}
                                        border={false}
                                        on:click={onClickYearButton}
                                        style="margin-left: 8px"
                                />
                        </Tooltip>
                        <div class="datepicker-buttons">
                                <Tooltip text={showYears ? "Années précédentes" : "Mois précedent"}>
                                        <Button
                                                text=""
                                                icon="arrow_back_ios"
                                                border={false}
                                                disable={(showYears && yearsPage == 0) || (!showYears && displayedDays.some(d => Dates.toText(d,'DD/MM/YYYY') == minDate))}
                                                on:click={onClickPrevious}
                                        />
                                </Tooltip>
                                <Tooltip text={showYears ? "Années suivantes" : "Mois suivant"}>
                                        <Button
                                                text=""
                                                icon="arrow_forward_ios"
                                                border={false}
                                                disable={(showYears && displayedYears.length < 12) || (!showYears && displayedDays.some(d => Dates.toText(d,'DD/MM/YYYY') == maxDate))}
                                                on:click={onClickNext}
                                        />
                                </Tooltip>
                        </div>
                        {#if showYears}
                                <div class="datepicker-years">
                                        {#each displayedYears as year}
                                                <span role="button" tabindex="0" class="datepicker-year" 
                                                class:datepicker-today={year == new Date().getFullYear()}
                                                class:datepicker-selected={year == Dates.toDate(tmpValue,'DD/MM/YYYY').getFullYear()}
                                                on:click|stopPropagation|preventDefault={onClickYear} 
                                                on:keypress|stopPropagation|preventDefault={onEnterYear} 
                                                value={year}>{year}</span>
                                        {/each}
                                </div>
                        {:else}
                                <div class="datepicker-days">
                                        {#each sortedDays as day}
                                                <span class="datepicker-day">{day.substring(0,3)}</span>
                                        {/each}
                                        {#each displayedDays as day}
                                                <span role="button" class="datepicker-day" 
                                                class:datepicker-today={Dates.toText(day,'DD/MM/YYYY') == Dates.toText(new Date(),'DD/MM/YYYY')}
                                                class:datepicker-selected={Dates.toText(day,'DD/MM/YYYY') == tmpValue}
                                                class:datepicker-other-month={day.getMonth() != Dates.toDate('01/' + currentMonth,'DD/MM/YYYY').getMonth()}
                                                class:datepicker-day-disable={(day < Dates.toDate(minDate,'DD/MM/YYYY')) || (day > Dates.toDate(maxDate,'DD/MM/YYYY'))}
                                                tabindex={(day < Dates.toDate(minDate,'DD/MM/YYYY')) || (day > Dates.toDate(maxDate,'DD/MM/YYYY')) ? "-1" : "0"}
                                                on:click|stopPropagation|preventDefault={onClickDay} 
                                                on:keypress|stopPropagation|preventDefault={onEnterDay} 
                                                value={Dates.toText(day,'DD/MM/YYYY')}>{day.getDate()}</span>
                                        {/each}
                                </div>
                        {/if}
                        <div class="datepicker-buttons">
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
        .datepicker-mask {
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
        .datepicker-visible {
                visibility: visible;
                pointer-events: auto;
                opacity: 1;
        }
        .datepicker-main {
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
        .datepicker-visible .datepicker-main {
                transform: scale(1);
        }
        .datepicker-info {
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
        h1 {
                font-size: 30px;
                margin: 0;
                font-weight: 500;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
        }
        .datepicker-calendar {
                display: inline-block;
                vertical-align: top;
                width: 380px;
                padding: 10px;
                box-sizing: border-box;
        }
        .datepicker-days,
        .datepicker-years {
                display: grid;
                grid-template-columns: repeat(7, 45px);
                margin: 0 0 5px 0;
                padding: 0px 22px;
        }
        .datepicker-years {
                grid-template-columns: repeat(3, 105px);
                min-height: 270px;
                grid-auto-rows: minmax(min-content, max-content);
        }
        .datepicker-day,
        .datepicker-year {
                text-align: center;
                width: 45px;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                user-select: none;
                color: var(--color-font);
        }
        .datepicker-year {
                width: 105px;
        }
        span.datepicker-day,
        span.datepicker-year {
                cursor: pointer;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 500;
        }
        span.datepicker-day:hover,
        span.datepicker-year:hover,
        span.datepicker-day:focus-visible,
        span.datepicker-year:focus-visible {
                background-color: var(--color-hover);
                color: var(--color-font);
        }
        span.datepicker-today,
        span.datepicker-day:focus-visible,
        span.datepicker-year:focus-visible {
                border: 2px solid var(--color-font);
                outline: none;
        }
        span.datepicker-other-month,
        span.datepicker-day-disable {
                color: var(--color-font-other);
        }
        span.datepicker-day-disable {
                cursor: not-allowed;
        }
        span.datepicker-selected,
        span.datepicker-selected:hover {
                background-color: var(--color-primary);
                color: var(--color-font-selected);
        }
        .datepicker-buttons {
                float: right;
        }
</style>