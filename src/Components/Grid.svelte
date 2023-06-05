<script>
    // IMPORTS
    import { onMount } from 'svelte';
    import Checkbox from "./Checkbox.svelte";
    import Button from "./Button.svelte";
    import Arrays from "../Utils/Arrays";
    import Radio from './Radio.svelte';
    import Droplist from './Droplist.svelte';

    // PUBLIC ATTRIBUTES
    // Array of objects [{label: '...', property: '...'}, render: (record) => {...}]
    export let columns = [];
    // Array of objects [{prop_A: '...', prop_B: '...'}]
    export let datas = [];
    // null, single, multiple
    export let select = null;
    export let selection = [];
    export let sortProperty = '';
    export let sortDirection = 'asc';
    export let pageSize = 0;
    export let page = 1;
    export let filters = [];

    // PRIVATE ATTRIBUTES
    let selectAll = selection.length == datas.length;
    let selectedValue = select == "single" && selection.length > 0 ? selection[0].id : null;
    let showFilter = false;
    let activeFilters = [];
    let operation = "view";
    let currentFilter = getDefaultFilter();
    $: visibleDatas = pageSize > 0 ? datas.slice((page - 1) * pageSize, Math.min(page * pageSize, datas.length)) : datas;
    $: columnsFilter = columns.map(col => {
        return {
            label: col.label,
            value: col.property
        }
    });
    $: filterTypes = getFilterTypes(currentFilter.colonne);
    
    // EVENTS
    onMount(() => {
        datas.forEach(record => {
            record.id = '_' + Math.random().toString(36).substring(2, 12); 
        });
        if(sortProperty && sortDirection) {
            Arrays.sort(datas, sortProperty, sortDirection);
        }
        datas = datas;
        selection.forEach(defaultRecord => {
            defaultRecord.id = datas.find(record => compareRecord(record, defaultRecord))?.id || null;
        });
        selection = selection.filter(record => record.id != null);
        selectedValue = select == "single" && selection.length > 0 ? selection[0].id : null;
        activeFilters = filters.slice();
    });
    function onSelect(event) {
        var id = event.detail.target.parentElement.parentElement.getAttribute('recordId');
        if(select == "single") {
            selection = [datas.find(record => record.id == id)];
            selectedValue = selection[0].id;
        } else if(select == "multiple") {
            if(selection.some(record => record.id == id)) {
                selection = selection.filter(record => record.id != id);
            } else {
                selection.push(datas.find(record => record.id == id));
            }
            selectAll = selection.length == datas.length;
        }
    }
    function onSelectAll(event) {
        if(event.detail.target.name == "selectAll") {
            selection = selection.length == datas.length ? [] : datas;
        }
        selectAll = selection.length == datas.length;
    }
    function onSort(event) {
        var property = event.target.getAttribute('property');
        sortDirection = property == sortProperty && sortDirection == 'asc' ? 'desc' : 'asc';
        sortProperty = property;
        Arrays.sort(datas, sortProperty, sortDirection);
        datas = datas;
    }
    function firstPage() {
        page = 1;
    }
    function previousPage() {
        if(page > 1) page--;
    }
    function nextPage(){
        if(page < Math.ceil(datas.length / pageSize)) page++;
    }
    function lastPage(){
        page = Math.ceil(datas.length / pageSize);
    }
    function onClickMask(evt) {
        if(evt.target == this){
            onClickFermer();
        }
    }
    function onClickFermer(){
        showFilter = false;
        filters = activeFilters.slice();
    }
    function onClickFilters(){
        showFilter = true;
        activeFilters = filters.slice();
    }
    function onEscMask(evt){
        if(Events.isEsc(evt)){
            onClickFermer();
        }
    }
    function onClickReset(evt) {
        filters = [];
    }
    function onClickValider(evt){
        if(operation == "view"){
            activeFilters = filters.slice();
            showFilter = false;
        } else {
            onClickRetour(evt);
        }
    }
    function onClickAjouter(evt) {
        operation = "add";
    }
    function onClickModifier(evt) {
        operation = "edit";
    }
    function onClickRetour(evt) {
        operation = "view";
    }
    function onClickSupprimer(evt){
        onClickRetour(evt);
    }
    
    // METHODS
    function compareRecord(recordA, recordB) {
        const keysA = Object.keys(recordA).filter(prop => prop != 'id');
        const keysB = Object.keys(recordB).filter(prop => prop != 'id');
        if (keysA.length != keysB.length) return false;
        for (const key of keysA) {
            if (recordA[key] != recordB[key]) return false;
        }
        return true;
    }
    function getDefaultFilter(){
        return {
            colonne: null,
            type: null,
            value: null,
            min: null,
            max: null
        };
    }
    function getFilterTypes(colonne) {
        var colType = columns.find(col => col.property == colonne)?.type || 'string';
        if(colType == 'date' || colType == 'number') {
            return [
                {label: 'Egal à', value : 'equals'},
                {label: 'Inférieur à', value : 'before'},
                {label: 'Supérieur à', value : 'after'},
                {label: 'Entre', value : 'between'}
            ];
        } else {
            return [
                {label: 'Contient', value : 'contains'},
                {label: 'Commence par', value : 'starts'},
                {label: 'Termine par', value : 'ends'},
                {label: 'Egal à', value : 'equals'},
                {label: 'Dans la liste', value : 'in'}
            ];
        }
    }
</script>

<div class="grid-main" style="--page-size: {pageSize}">
    <div class="grid-toolbar">
        <span class="grid-toolbar-custom">
            <slot name="grid-toolbar"></slot>
        </span>
        <span class="grid-toolbar-default">
            <Button
                text={"Filtrer" + (activeFilters.length > 0 ? " (" + activeFilters.length + ")" : "")}
                border={false}
                icon="filter_list"
                style="margin-right:0"
                on:click={onClickFilters}
            />
        </span>
    </div>
    <div class="grid-table">
        <table>
            <thead>
                <tr>
                    {#if select == 'multiple'}
                        <th class="grid-cell-select">
                            <Checkbox 
                                style={"margin:0;--color-primary:#EEEEEE;--color-checked:var(--color-primary);--color-hover:var(--color-primary);--color-checked-hover:var(--color-primary);"}
                                bind:check={selectAll}
                                name="selectAll"
                                on:change={onSelectAll}
                            />
                        </th>
                    {:else if select == 'single'}
                        <th class="grid-cell-select"></th>
                    {/if}
                    {#each columns as column}
                        {#if column.sortable == false}
                            <th>{column.label}</th>
                        {:else}
                            <th class="sortable" property={column.property} on:click={onSort}>
                                {column.label}
                                {#if column.property == sortProperty}
                                    <span class="material-icons-round">{sortDirection == 'asc' ? "arrow_upward" : "arrow_downward"}</span>
                                {/if}
                            </th>
                        {/if}
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each visibleDatas as record}
                    <tr recordId={record.id}>
                        {#if select == 'multiple'}
                            <td class="grid-cell-select">
                                <Checkbox 
                                    style="margin:0" 
                                    check={selection.some(r => r.id == record.id)} 
                                    on:change={onSelect}
                                />
                            </td>
                        {/if}
                        {#if select == 'single'}
                            <td class="grid-cell-select">
                                <Radio 
                                    style="margin:0"
                                    name="selection"
                                    value={record.id}
                                    bind:selectedValue={selectedValue} 
                                    on:change={onSelect}
                                />
                            </td>
                        {/if}
                        {#each columns as column}
                            <td>
                                {#if column.render}
                                    {@html column.render(record)}
                                {:else}
                                    {record[column.property] || ''}
                                {/if}
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="grid-paging">
        <span class="grid-paging-text">
            {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, datas.length)} sur {datas.length} résultats
        </span>
        {#if datas.length != visibleDatas.length}
            <span class="grid-paging-buttons">
                <Button icon="keyboard_double_arrow_left" border={false} disable={page == 1} on:click={firstPage}/>
                <Button icon="keyboard_arrow_left" border={false} disable={page == 1} on:click={previousPage}/>
                <Button icon="keyboard_arrow_right" border={false} disable={Math.ceil(datas.length / pageSize) == page} on:click={nextPage}/>
                <Button icon="keyboard_double_arrow_right" border={false} disable={Math.ceil(datas.length / pageSize) == page} on:click={lastPage} style="margin-right:0"/>
            </span>
        {/if}
    </div>
</div>
<div class="grid-filter-mask"
    class:grid-filter-visible={showFilter}
    on:click={onClickMask}
    on:keydown={onEscMask}>
    <div class="grid-filter-main">
        {#if operation == "view"}
            <div class="grid-filter-title">
                {#if filters.length == 0}
                    Aucun filtre actif
                {:else}
                    {filters.length} filtres actifs
                {/if}
            </div>
            <div class="grid-filter-filters">
                <Button
                    text="Ajouter un filtre"
                    icon="filter_list"
                    style="width:100%; text-align:center"
                    primary={true}
                    on:click={onClickAjouter}
                />
                {#if filters.length > 0}
                    <Button
                        text="Supprimer les filtres"
                        icon="filter_list_off"
                        style="width:100%; text-align:center"
                        on:click={onClickReset}
                    />
                {/if}
                {#each filters as filter}
                    <Button
                        text={filter}
                        border={false}
                        style="width:100%"
                        on:click={onClickModifier}
                    />
                {/each}
            </div>
            <div class="grid-filter-buttons">
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
                    style="margin-right:0"
                    on:click={onClickValider}
                />
            </div>
        {:else}
            <div class="grid-filter-title">
                {#if operation == "add"}
                    Ajouter un filtre
                {:else}
                    Modifier un filtre
                {/if}
            </div>
            <div class="grid-filter-filters">
                {#if operation == "edit"}
                    <Button
                        text="Supprimer ce filtre"
                        icon="delete"
                        style="width:100%; text-align:center"
                        primary={true}
                        on:click={onClickSupprimer}
                    />
                {/if}
                <Droplist 
                    label="Colonne"
                    bind:value={currentFilter.colonne}
                    items={columnsFilter}
                    width=480
                />
                {#if currentFilter.colonne}
                    <Droplist 
                        label="Type"
                        bind:value={currentFilter.type}
                        bind:items={filterTypes}
                        width=480
                    />
                {/if}
            </div>
            <div class="grid-filter-buttons">
                <Button
                    text="Retour"
                    icon="arrow_back"
                    border={false}
                    on:click={onClickRetour}
                />
                <Button
                    text="Valider"
                    icon="done"
                    primary={true}
                    style="margin-right:0"
                    on:click={onClickValider}
                />
            </div>
        {/if}
    </div>
</div>

<style>
    .grid-main .grid-table {
        height: calc(48px * (var(--page-size) + 1));
    }
    .grid-main table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 8px;
        overflow: hidden;
    }
    .grid-main tr:nth-child(even) {
        background-color: #EEEEEE;
    }
    .grid-main tr:hover {
        background-color: #DDDDDD;
    }
    .grid-main th, .grid-main td {
        text-align: left;
        padding: 12px 14px;
        font-weight: normal;
        line-height: 20px;
    }
    .grid-main td {
        color: #666666;
    }
    .grid-main th {
        background-color: #1D2B83;
        color: #EEEEEE;
    }
    .grid-main .grid-cell-select {
        width: 50px;
    }
    .grid-main th.sortable {
        cursor: pointer;
    }
    .grid-main th.sortable .material-icons-round {
        position: absolute;
        font-size: 20px;
        pointer-events: none;
    }
    .grid-main .grid-paging {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .grid-main .grid-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .grid-filter-mask {
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
    .grid-filter-visible {
        visibility: visible;
        pointer-events: auto;
        opacity: 1;
    }
    .grid-filter-main {
        width: 500px;
        transform: scale(0.8);
        background-color: #FFF;
        border-radius: 8px;
        box-shadow: 0 6px 25px rgba(150,150,150,0.7);
        overflow: hidden;
        transition: transform 0.2s;
        overflow: visible;
        padding: 10px 10px 5px 10px;
    }
    .grid-filter-visible .grid-filter-main {
        transform: scale(1);
    }
    .grid-filter-title {
        font-weight: bold;
        font-size: 20px;
        margin: 10px 5px;
    }
    .grid-filter-filters {
        min-height: 200px;
    }
    .grid-filter-buttons {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
</style>
