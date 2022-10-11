<script>
        // IMPORTS
        import { createEventDispatcher } from 'svelte';
        import Textfield from './Textfield.svelte';
        import Button from './Button.svelte';
        import Tooltip from './Tooltip.svelte';
        
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
        export let startWeek = 1;
        export let colorPicker = "#0d31a6";
        export let colorPickerBackground = "#FFFFFF";
        export let colorPickerFont = "#333333";
        export let colorPickerFontSelected = "#FFFFFF";
        export let colorPickerHover = "#EEEEEE";
        export let colorPickerFontOut = "#AAAAAA";
        export let calendarOnly = false;
        
        // PRIVATE ATTRIBUTES
        let days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
        let months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
        let visible = false;
        let tmpValue = value || dateToText(new Date(), 'DD/MM/YYYY');
        let currentMonth = dateToText(textToDate(tmpValue,'DD/MM/YYYY'),'MM/YYYY');
        let input;
        let showYears = false;
        let displayedYears = [];
        let yearsPage = 0;
        let endWeek = startWeek == 0 ? 6 : startWeek - 1;
        $: allYear = getDisplayedYears(minDate,maxDate);
        $: displayedDays = getDisplayedDays(currentMonth);
        $: sortedDays = days.slice(startWeek,7).concat(days.slice(0,startWeek));

        // EVENTS
        const dispatch = createEventDispatcher();
        export function onChange(evt){
                if(errorMessage == "" && value != ""){
                        errorMessage = textToDate(value,'DD/MM/YYYY') < textToDate(minDate,'DD/MM/YYYY') || textToDate(value,'DD/MM/YYYY') > textToDate(maxDate,'DD/MM/YYYY') ? "La date doit etre comprise entre " + minDate + " et " + maxDate : "";
                }
                dispatch('change', {
                        value: value,
                        oldValue: evt.detail.oldValue
                });
        }
	export function onClickIcon() {
                visible = true;
                tmpValue = isValidDate(value,'DD/MM/YYYY') ? value : dateToText(new Date(), 'DD/MM/YYYY');
                currentMonth = dateToText(textToDate(tmpValue,'DD/MM/YYYY'),'MM/YYYY');
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
                if(textToDate(clickedDate,"DD/MM/YYYY") < textToDate(minDate,"DD/MM/YYYY") || textToDate(clickedDate,"DD/MM/YYYY") > textToDate(maxDate,"DD/MM/YYYY")) return false;
                tmpValue = clickedDate;
        }
        export function onClickYearButton(){
                showYears = !showYears;
                if(showYears) {
                        var currentYear = textToDate(tmpValue,"DD/MM/YYYY").getFullYear();
                        for(yearsPage = 0; yearsPage * 18 < allYear.length; yearsPage++){
                                var tmpArray = allYear.slice(yearsPage * 18, yearsPage * 18 + 18);
                                if(tmpArray.includes(currentYear)){
                                        displayedYears = tmpArray;
                                        break;
                                }
                        }
                }
        }
        export function onClickPrevious(){
                if(showYears) {
                        yearsPage--;
                        displayedYears = allYear.slice(yearsPage * 18, yearsPage * 18 + 18);
                } else {
                        var date = textToDate("01/" + currentMonth,"DD/MM/YYYY");
                        date.setMonth(date.getMonth() - 1);
                        currentMonth = dateToText(date,"MM/YYYY");
                }
        }
        export function onClickNext(){
                if(showYears) {
                        yearsPage++;
                        displayedYears = allYear.slice(yearsPage * 18, yearsPage * 18 + 18);
                } else {
                        var date = textToDate("01/" + currentMonth,"DD/MM/YYYY");
                        date.setMonth(date.getMonth() + 1);
                        currentMonth = dateToText(date,"MM/YYYY");
                }
        }
        export function onClickYear(evt){
                var year = evt.currentTarget.getAttribute('value');
                var newDate = textToDate(tmpValue,"DD/MM/YYYY");
                newDate.setFullYear(year);
                tmpValue = dateToText(newDate,"DD/MM/YYYY");
                currentMonth = dateToText(textToDate(tmpValue,'DD/MM/YYYY'),'MM/YYYY');
        }

        // METHODS
        function getDisplayedDate(strDate,format) {
                var date = textToDate(strDate,format);
                return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        }
        function textToDate(strDate,format) {
                var regexp = format.trim().replaceAll('D', '[0-9]').replaceAll('M', '[0-9]').replaceAll('Y', '[0-9]').replaceAll('/','\\/').replaceAll('.','\\.');
                if(strDate.length == format.length && new RegExp(regexp).test(strDate)) {
                        var separator = strDate.trim().replaceAll(/[0-9]/g, '').charAt(0);
                        var splitFormat = format.split(separator);
                        var splitDate = strDate.split(separator);
                        return new Date(
                                parseInt(splitDate[splitFormat.indexOf('YYYY')]), 
                                parseInt(splitDate[splitFormat.indexOf('MM')]) - 1, 
                                parseInt(splitDate[splitFormat.indexOf('DD')])
                        );
                }
        }
        function dateToText(date,format) {
                return format   .replace('DD',date.getDate().toString().padStart(2,'0'))
                                .replace('MM',(date.getMonth() + 1).toString().padStart(2,'0'))
                                .replace('YYYY',date.getFullYear())
        }
        function getDisplayedDays(monthYear){
                var initFirstDay = textToDate('01/' + monthYear,'DD/MM/YYYY');
                var firstDay = new Date(initFirstDay);
                if(firstDay.getDay() != startWeek) {
                        if(firstDay.getDay() > startWeek) {
                                firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - startWeek));
                        } else {
                                firstDay.setDate(firstDay.getDate() - (7 - (startWeek - firstDay.getDay())));
                        }
                }
                
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
               var date =  textToDate('01/' + currentMonth,'DD/MM/YYYY');
               return months[date.getMonth()] + ' ' + date.getFullYear();
        }
        function isValidDate(strDate,format){
                try {
                        return textToDate(strDate,format) ? true : false;
                } catch (error) {
                        return false;
                }
        }
        function getDisplayedYears(minDate,maxDate){
                var years = [];
                for(var i = textToDate(minDate,'DD/MM/YYYY').getFullYear(); i <= textToDate(maxDate,'DD/MM/YYYY').getFullYear(); i++){
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
        readonly={readonly || calendarOnly}
        iconRight={readonly ? "" : "today"}
        pattern="((([0-2][0-9])|(3[0-1]))(\/|-|\.)((0[13578])|10|12)(\/|-|\.)(19|20)[0-9][0-9])|((([0-2][0-9])|30)(\/|-|\.)((0[469])|11)(\/|-|\.)(19|20)[0-9][0-9])|(([0-2][0-9])(\/|-|\.)02(\/|-|\.)(19|20)[0-9][0-9])"
        {label}
        {cls}
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

<div class="datepicker-mask"
     class:datepicker-visible={visible}
     style="--color-primary:{colorPicker}; 
            --color-background: {colorPickerBackground}; 
            --color-font: {colorPickerFont}; 
            --color-font-selected: {colorPickerFontSelected};
            --color-hover: {colorPickerHover};
            --color-font-other: {colorPickerFontOut}"
     on:click={onClickMask}>
        <div class="datepicker-main">
                <div class="datepicker-info">
                        <h4>{label}</h4>
                        <h1>{getDisplayedDate(tmpValue,'DD/MM/YYYY')}</h1>
                </div><!--
             --><div class="datepicker-calendar">
                        <Button
                                text={getDisplayedMonth(currentMonth)}
                                border={false}
                                on:click={onClickYearButton}
                                style="margin-left: 8px"
                        />
                        <div class="datepicker-buttons">
                                <Tooltip text={showYears ? "Années précédentes" : "Mois précedent"}>
                                        <Button
                                                text=""
                                                icon="arrow_back_ios"
                                                border={false}
                                                disable={(showYears && yearsPage == 0) || (!showYears && displayedDays.some(d => dateToText(d,'DD/MM/YYYY') == minDate))}
                                                on:click={onClickPrevious}
                                        />
                                </Tooltip>
                                <Tooltip text={showYears ? "Années suivantes" : "Mois suivant"}>
                                        <Button
                                                text=""
                                                icon="arrow_forward_ios"
                                                border={false}
                                                disable={(showYears && displayedYears.length < 12) || (!showYears && displayedDays.some(d => dateToText(d,'DD/MM/YYYY') == maxDate))}
                                                on:click={onClickNext}
                                        />
                                </Tooltip>
                        </div>
                        {#if showYears}
                                <div class="datepicker-years">
                                        {#each displayedYears as year}
                                                <!-- svelte-ignore a11y-invalid-attribute -->
                                                <a href="#" class="datepicker-year" 
                                                class:datepicker-today={year == new Date().getFullYear()}
                                                class:datepicker-selected={year == textToDate(tmpValue,'DD/MM/YYYY').getFullYear()}
                                                on:click|stopPropagation|preventDefault={onClickYear} value={year}>{year}</a>
                                        {/each}
                                </div>
                        {:else}
                                <div class="datepicker-days">
                                        {#each sortedDays as day}
                                                <span class="datepicker-day">{day.substr(0,3)}</span>
                                        {/each}
                                        {#each displayedDays as day}
                                                <!-- svelte-ignore a11y-invalid-attribute -->
                                                <a href="#" class="datepicker-day" 
                                                class:datepicker-today={dateToText(day,'DD/MM/YYYY') == dateToText(new Date(),'DD/MM/YYYY')}
                                                class:datepicker-selected={dateToText(day,'DD/MM/YYYY') == tmpValue}
                                                class:datepicker-other-month={day.getMonth() != textToDate('01/' + currentMonth,'DD/MM/YYYY').getMonth()}
                                                class:datepicker-day-disable={(day < textToDate(minDate,'DD/MM/YYYY')) || (day > textToDate(maxDate,'DD/MM/YYYY'))}
                                                on:click|stopPropagation|preventDefault={onClickDay} value={dateToText(day,'DD/MM/YYYY')}>{day.getDate()}</a>
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
        a.datepicker-day,
        a.datepicker-year {
                cursor: pointer;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 500;
        }
        a.datepicker-day:hover,
        a.datepicker-year:hover {
                background-color: var(--color-hover);
        }
        a.datepicker-today {
                border: 2px solid var(--color-font);
        }
        a.datepicker-other-month,
        a.datepicker-day-disable {
                color: var(--color-font-other);
        }
        a.datepicker-day-disable {
                cursor: not-allowed;
        }
        a.datepicker-selected,
        a.datepicker-selected:hover {
                background-color: var(--color-primary);
                color: var(--color-font-selected);
        }
        .datepicker-buttons {
                float: right;
        }
</style>