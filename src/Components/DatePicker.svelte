<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Textfield from './Textfield.svelte';
        import Button from './Button.svelte';
        import Tooltip from './Tooltip.svelte';
        import Dates from '../Utils/Dates';
        import Events from '../Utils/Events';
        
        // PUBLIC ATTRIBUTES
        export let format = Dates.D_M_Y;
        export let value = "";
        export let disable = false;
        export let width = 290;
        export let iconLeft = "";
        export let label = "";
        export let errorMessage = "";
        export let required = false;
        export let readonly = false;
        export let cls = "";
        export let minDate = Dates.format('01/01/1900', Dates.D_M_Y, format);
        export let maxDate = Dates.format('31/12/2099', Dates.D_M_Y, format);
        export let startWeek = Dates.MONDAY;
        export let filled = true;
        export let calendarOnly = false;
        
        // PRIVATE ATTRIBUTES
        let pattern = Dates.getPattern(format);
        let realMinDate = Dates.toDate(minDate, format);
        let realMaxDate = Dates.toDate(maxDate, format);
        let type = "text";
        let days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
        let months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
        let visible = false;
        let tmpValue = Dates.isValid(value, format) ? Dates.format(value, format, Dates.D_M_Y) : Dates.toText(Dates.today(), Dates.D_M_Y);
        let currentMonth = Dates.format(tmpValue, Dates.D_M_Y, Dates.M_Y);
        let focusedDate = tmpValue;
        let focusedYear = Dates.toDate(tmpValue, Dates.D_M_Y).getFullYear();
        let input;
        let calendar;
        let showYears = false;
        let displayedYears = [];
        let yearsPage = 0;
        let endWeek = startWeek == 0 ? 6 : startWeek - 1;
        let id = '_' + Math.random().toString(36).substring(2, 12);
        $: allYear = getDisplayedYears(realMinDate,realMaxDate);
        $: displayedDays = getDisplayedDays(currentMonth);
        $: sortedDays = days.slice(startWeek,7).concat(days.slice(0,startWeek));

        // EVENTS
        const dispatch = createEventDispatcher();
        export function onChange(evt){
                let event = evt.detail;
                if(errorMessage == "" && value != ""){
                        errorMessage = Dates.toDate(value, format) < realMinDate || Dates.toDate(value, format) > realMaxDate ? "La date doit etre comprise entre " + minDate + " et " + maxDate : "";
                }
                let params = Events.copy(event);
                params.value = value;
                dispatch('change', {
                        ...params
                });
        }
	export function onClickIcon() {
                visible = true;
                tmpValue = Dates.isValid(value, format) ? Dates.format(value, format, Dates.D_M_Y) : Dates.toText(Dates.today(), Dates.D_M_Y);
                currentMonth = Dates.format(tmpValue, Dates.D_M_Y, Dates.M_Y);
                showYears = false;
                focusedDate = tmpValue;
                setTimeout(() => {
                        calendar.querySelector('.datepicker-day[tabindex="0"]').focus();
                }, 100);
        }
        export function onClickMask(evt) {
                if(evt.target == this){
                        onClickFermer();
                }
        }
        export function onClickFermer(){
                visible = false;
                input.getInput().focus();
        }
        export function onClickValider(){
                onClickFermer();
                value = Dates.format(tmpValue, Dates.D_M_Y, format);
                setTimeout(() => {
                        input.onChange();
                }, 200);
        }
        export function onClickDay(evt) {
                var clickedDate = evt.currentTarget.getAttribute('value');
                if(Dates.toDate(clickedDate, Dates.D_M_Y) < realMinDate || Dates.toDate(clickedDate, Dates.D_M_Y) > realMaxDate) return false;
                tmpValue = clickedDate;
        }
        export function onClickYearButton(){
                showYears = !showYears;
                if(showYears) {
                        var currentYear = Dates.toDate(tmpValue, Dates.D_M_Y).getFullYear();
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
                        var date = Dates.toDate(currentMonth, Dates.M_Y);
                        date.setMonth(date.getMonth() - 1);
                        currentMonth = Dates.toText(date, Dates.M_Y);
                }
        }
        export function onClickNext(){
                if(showYears) {
                        yearsPage++;
                        displayedYears = allYear.slice(yearsPage * 18, yearsPage * 18 + 18);
                } else {
                        var date = Dates.toDate(currentMonth, Dates.M_Y);
                        date.setMonth(date.getMonth() + 1);
                        currentMonth = Dates.toText(date, Dates.M_Y);
                }
        }
        export function onClickYear(evt){
                var year = evt.currentTarget.getAttribute('value');
                var newDate = Dates.toDate(tmpValue, Dates.D_M_Y);
                newDate.setFullYear(year);
                tmpValue = Dates.toText(newDate, Dates.D_M_Y);
                currentMonth = Dates.format(tmpValue, Dates.D_M_Y, Dates.M_Y);
                onClickYearButton();
        }

        // METHODS
        function getDisplayedDate(strDate,format) {
                var date = Dates.toDate(strDate,format);
                return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        }
        function getDisplayedDays(monthYear){
                // If the first day of month is not the beginning of the week, replace by first day of week
                var initFirstDay = Dates.toDate(monthYear, Dates.M_Y);
                var firstDay = Dates.copy(initFirstDay);
                if(firstDay.getDay() != startWeek) {
                        if(firstDay.getDay() > startWeek) {
                                firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - startWeek));
                        } else {
                                firstDay.setDate(firstDay.getDate() - (7 - (startWeek - firstDay.getDay())));
                        }
                }
                
                // If the last day of month is not the end of the week, replace by last day of week
                var initLastDay = Dates.lastDay(initFirstDay);
                var lastDay = Dates.copy(initLastDay);
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
                        days.push(Dates.copy(oneDay));
                        oneDay.setDate(oneDay.getDate() + 1);
                }

                return days;
        }
        function getDisplayedMonth(currentMonth){
               var date =  Dates.toDate(currentMonth, Dates.M_Y);
               return months[date.getMonth()] + ' ' + date.getFullYear();
        }
        function getDisplayedYears(minDate,maxDate){
                var years = [];
                for(var i = minDate.getFullYear(); i <= maxDate.getFullYear(); i++){
                        years.push(i);
                }
                return years;
        }
        function onEscMask(evt){
                if(Events.isEsc(evt)){
                        onClickFermer();
                }
        }
        function onEnterDay(event){
                if(Events.isEnter(event)) {
                        onClickDay(event);
                }
        }
        function onEnterYear(event){
                if(Events.isEnter(event)) {
                        onClickYear(event);
                }
        }
        function onNavigateDay(event){
                if(Events.isArrow(event)) {
                        var clickedDate = event.currentTarget.getAttribute('value');
                        var nextDate = null;
                        if (Events.isArrowLeft(event)) {
                                nextDate = Dates.addDays(Dates.toDate(clickedDate, Dates.D_M_Y), -1);
                        } else if (Events.isArrowRight(event)) {
                                nextDate = Dates.addDays(Dates.toDate(clickedDate, Dates.D_M_Y), 1);
                        } else if (Events.isArrowUp(event)) {
                                nextDate = Dates.addDays(Dates.toDate(clickedDate, Dates.D_M_Y), -7);
                        } else if (Events.isArrowDown(event)) {
                                nextDate = Dates.addDays(Dates.toDate(clickedDate, Dates.D_M_Y), 7);
                        }
                        if(displayedDays.some(d => Dates.toText(d, Dates.D_M_Y) == Dates.toText(nextDate, Dates.D_M_Y)) && realMinDate <= nextDate  && nextDate <= realMaxDate) {
                                event.currentTarget.parentElement.querySelector('[value="' + Dates.toText(nextDate, Dates.D_M_Y) + '"]').focus();
                                focusedDate = Dates.toText(nextDate, Dates.D_M_Y);
                        }
                        event.preventDefault();
                        event.stopPropagation();
                }
        }
        function onNavigateYear(event){
                if(Events.isArrow(event)) {
                        var clickedYear = parseInt(event.currentTarget.getAttribute('value'));
                        var nextYear = clickedYear;
                        if (Events.isArrowLeft(event)) {
                                nextYear--;
                        } else if (Events.isArrowRight(event)) {
                                nextYear++;
                        } else if (Events.isArrowUp(event)) {
                                nextYear -= 3;
                        } else if (Events.isArrowDown(event)) {
                                nextYear += 3;
                        }
                        if(displayedYears.some(y => y == nextYear)) {
                                event.currentTarget.parentElement.querySelector('[value="' + nextYear + '"]').focus();
                                focusedYear = nextYear;
                        }
                        event.preventDefault();
                        event.stopPropagation();
                }
        }
        function onKeyDownYearButton(evt){
                evt = evt.detail.event;
                if(Events.isTab(evt) && Events.isShift(evt)){
                        evt.preventDefault();
                        evt.stopPropagation();
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
        readonly={readonly || calendarOnly}
        iconRight={readonly ? "" : "today"}
        {pattern}
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
     on:click={onClickMask}
     on:keydown={onEscMask}>
        <div class="datepicker-main">
                <div class="datepicker-info">
                        <h4>{label}</h4>
                        <h1>{getDisplayedDate(tmpValue, Dates.D_M_Y)}</h1>
                </div><!--
             --><div class="datepicker-calendar" bind:this={calendar}>
                        <Tooltip text={showYears ? "Choisir le jour" : "Choisir l'année"}>
                                <Button
                                        text={getDisplayedMonth(currentMonth)}
                                        border={false}
                                        on:click={onClickYearButton}
                                        on:keydown={onKeyDownYearButton}
                                        style="margin-left: 8px"
                                />
                        </Tooltip>
                        <div class="datepicker-buttons">
                                <Tooltip text={showYears ? "Années précédentes" : "Mois précedent"}>
                                        <Button
                                                text=""
                                                icon="arrow_back_ios"
                                                border={false}
                                                disable={(showYears && yearsPage == 0) || (!showYears && displayedDays.some(d => Dates.toText(d, format) == minDate))}
                                                on:click={onClickPrevious}
                                        />
                                </Tooltip>
                                <Tooltip text={showYears ? "Années suivantes" : "Mois suivant"}>
                                        <Button
                                                text=""
                                                icon="arrow_forward_ios"
                                                border={false}
                                                disable={(showYears && displayedYears.length < 12) || (!showYears && displayedDays.some(d => Dates.toText(d, format) == maxDate))}
                                                on:click={onClickNext}
                                        />
                                </Tooltip>
                        </div>
                        {#if showYears}
                                <div class="datepicker-years">
                                        {#each displayedYears as year}
                                                <span role="button" class="datepicker-year" 
                                                class:datepicker-today={year == Dates.today().getFullYear()}
                                                class:datepicker-selected={year == Dates.toDate(tmpValue, Dates.D_M_Y).getFullYear()}
                                                tabindex= {
                                                        (displayedYears.some(y => y == focusedYear) && focusedYear == year) ||
                                                        (!displayedYears.some(y => y == focusedYear) && displayedYears[0] == year)
                                                        ? "0" : "-1"
                                                }
                                                on:click|stopPropagation|preventDefault={onClickYear} 
                                                on:keypress|stopPropagation|preventDefault={onEnterYear} 
                                                on:keydown={onNavigateYear} 
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
                                                class:datepicker-today={Dates.toText(day, Dates.D_M_Y) == Dates.toText(Dates.today(), Dates.D_M_Y)}
                                                class:datepicker-selected={Dates.toText(day, Dates.D_M_Y) == tmpValue}
                                                class:datepicker-other-month={day.getMonth() != Dates.toDate(currentMonth, Dates.M_Y).getMonth()}
                                                class:datepicker-day-disable={(day < realMinDate) || (day > realMaxDate)}
                                                tabindex= {
                                                        (displayedDays.some(d => focusedDate == Dates.toText(d, Dates.D_M_Y)) && focusedDate == Dates.toText(day, Dates.D_M_Y)) ||
                                                        (!displayedDays.some(d => focusedDate == Dates.toText(d, Dates.D_M_Y)) && displayedDays.find(d => realMinDate <= d  && d <= realMaxDate) == day)
                                                        ? "0" : "-1"
                                                }
                                                on:click|stopPropagation|preventDefault={onClickDay} 
                                                on:keypress|stopPropagation|preventDefault={onEnterDay} 
                                                on:keydown={onNavigateDay} 
                                                value={Dates.toText(day, Dates.D_M_Y)}>{day.getDate()}</span>
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
                                        on:keydown={onKeyDownValider}
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
                grid-template-columns: repeat(7, 1fr);
                margin: 0 0 5px 0;
                padding: 0px 22px;
        }
        .datepicker-years {
                grid-template-columns: repeat(3, 1fr);
                min-height: 270px;
                grid-auto-rows: minmax(min-content, max-content);
        }
        .datepicker-day,
        .datepicker-year {
                text-align: center;
                width: 100%;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                user-select: none;
                color: var(--color-font);
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