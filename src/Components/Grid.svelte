<script>
    // IMPORTS
    import { onMount } from 'svelte';
    import Checkbox from "./Checkbox.svelte";
    import Button from "./Button.svelte";
    import Arrays from "../Utils/Arrays";
    import Radio from './Radio.svelte';
    import Droplist from './Droplist.svelte';
    import Textfield from './Textfield.svelte';
    import DatePicker from './DatePicker.svelte';
    import Numberfield from './Numberfield.svelte';
    import Events from '../Utils/Events';
    import Objects from '../Utils/Objects';
    import Dates from '../Utils/Dates';
    import Modal from './Modal.svelte';
    import Toolbar from './Toolbar.svelte';

    // PUBLIC ATTRIBUTES
    export let columns = []; // Array of objects [{label: '...', property: '...', type: 'string/number/date', render: (record) => {...}}]
    export let datas = []; // Array of objects [{prop_A: '...', prop_B: '...'}]
    export let select = null; // null, single, multiple
    export let selection = []; // Like datas
    export let sortProperty = '';
    export let sortDirection = 'asc';
    export let pageSize = 0;
    export let page = 1;
    export let filters = [];
    export let filterWidth = 500;

    // PRIVATE ATTRIBUTES
    let showFilter = false;
    let operation = "view";
    let currentFilter = getDefaultFilter();
    let filterButton;
    let filterBtnAdd;
    let filterDroplistCol;
    $: filterTypes = getFilterTypes(currentFilter);
    $: filteredDatas = Arrays.filter(datas, filters);
    $: tmpFilters = filters;
    $: filtersWidth = filterWidth - 20;
    $: selectedValue = select == "single" && selection.length > 0 ? selection[0].id : null;
    $: selectAll = selection.length == filteredDatas.length;
    $: visibleDatas = pageSize > 0 ? filteredDatas.slice((page - 1) * pageSize, Math.min(page * pageSize, filteredDatas.length)) : filteredDatas;
    $: columnsFilter = columns.map(col => {
        return {
            label: col.label,
            value: col.property
        }
    });
    
    // EVENTS
    onMount(() => {
        // Generate id for each record
        datas.forEach(record => {
            record.id = '_' + Math.random().toString(36).substring(2, 12); 
        });
        datas = [...datas];

        // Init sort
        if(sortProperty && sortDirection) {
            filteredDatas = Arrays.sort(filteredDatas, sortProperty, sortDirection, getFormatSort());
        }
        filteredDatas = [...filteredDatas];

        // Init selection
        selection.forEach(defaultRecord => {
            defaultRecord.id = filteredDatas.find(record => Objects.equals(record, defaultRecord, [], ['id']))?.id || null;
        });
        selection = selection.filter(record => record.id != null);

        // Generate id for each filter
        filters.forEach(filter => {
            filter.id = '_' + Math.random().toString(36).substring(2, 12); 
        });
        filters = [...filters];
    });
    function onSelect(id) {
        if(select == "single") {
            // Single selection : find the only one element
            selection = [filteredDatas.find(record => record.id == id)];
        } else if(select == "multiple") {
            // Multiple selection
            if(selection.some(record => record.id == id)) {
                // Remove selection
                selection = selection.filter(record => record.id != id);
            } else {
                // Add selection
                selection = [...selection, filteredDatas.find(record => record.id == id)];
            }
        }
    }
    function onSelectAll(event) {
        if(event.detail.target.name == "selectAll") {
            selection = selection.length == filteredDatas.length ? [] : filteredDatas;
        }
    }
    function onSort(property) {
        sortDirection = property == sortProperty && sortDirection == 'asc' ? 'desc' : 'asc';
        sortProperty = property;
        filteredDatas = [...Arrays.sort(filteredDatas, sortProperty, sortDirection, getFormatSort())];
    }
    function firstPage() {
        page = 1;
    }
    function previousPage() {
        if(page > 1) page--;
    }
    function nextPage(){
        if(page < Math.ceil(filteredDatas.length / pageSize)) page++;
    }
    function lastPage(){
        page = Math.ceil(filteredDatas.length / pageSize);
    }
    function onClickMask(evt) {
        if(evt.target == this){
            onClickFermer();
        }
    }
    function onClickFermer(){
        showFilter = false;
        filterButton.focus();
    }
    function onClickFilters(){
        // Open filter panel
        showFilter = true;
        tmpFilters = [...filters];
        operation = tmpFilters.length > 0 ? "view" : "add";
        currentFilter = getDefaultFilter();
        setFocusFilter();
    }
    function setFocusFilter() {
        // Set focus to first visible item
        if(operation == "view") {
            setTimeout(() => {
                filterBtnAdd.focus();
            }, 100);
        } else if(operation == "add" || operation == "edit"){
            setTimeout(() => {
                filterDroplistCol.focus();
            }, 100);
        }
    }
    function onEscMask(evt){
        if(Events.isEsc(evt)){
            onClickFermer();
        }
    }
    function onClickReset(evt) {
        tmpFilters = [];
        setFocusFilter();
    }
    function onClickValider(evt){
        if(operation == "view"){
            // Validate
            filters = [...tmpFilters];
            onClickFermer();
        } else if(operation == "add"){
            // Add
            if(checkFilter(currentFilter)) {
                currentFilter.id ??= '_' + Math.random().toString(36).substring(2, 12);
                tmpFilters = [...tmpFilters, {...currentFilter}];
                onClickRetour(evt);
            }
        } else {
            // Modify
            if(checkFilter(currentFilter)) {
                tmpFilters.splice(tmpFilters.findIndex(f => f.id == currentFilter.id), 1, currentFilter);
                tmpFilters = [...tmpFilters];
                onClickRetour(evt);
            }
        }
    }
    function onClickAjouter(evt) {
        operation = "add";
        setFocusFilter();
    }
    function onClickModifier(id) {
        operation = "edit";
        setFocusFilter();
        currentFilter = {...tmpFilters.find(f => f.id == id)};
    }
    function onClickRetour(evt) {
        operation = "view";
        setFocusFilter();
        currentFilter = getDefaultFilter();
    }
    function onClickSupprimer1(id){
        currentFilter = {...tmpFilters.find(f => f.id == id)};
        tmpFilters = tmpFilters.filter(f => f.id != currentFilter.id);
    }
    function onClickSupprimer2(evt){
        tmpFilters = tmpFilters.filter(f => f.id != currentFilter.id);
        onClickRetour(evt);
    }
    function onChangeColonne(evt) {
        currentFilter.type = null;
        currentFilter.value = null;
        currentFilter.dataType = columns.find(col => col.property == evt.detail.value)?.type || 'string';
        currentFilter.format = columns.find(col => col.property == evt.detail.value)?.format || null;
        currentFilter = {...currentFilter};
    }
    
    // METHODS
    function getDefaultFilter(){
        return {
            property: null,
            dataType: null,
            type: null,
            value: null,
            min: null,
            max: null,
            format: null
        };
    }
    function getFilterTypes(filter) {
        var colType = columns.find(col => col.property == filter.property)?.type || 'string';
        if(colType == 'date') {
            return [
                {label: 'Égal à', value : 'equals'},
                {label: 'Jusqu\'au', value : 'before'},
                {label: 'Depuis le', value : 'after'},
                {label: 'Entre', value : 'between'}
            ];
        } else if(colType == 'number') {
            return [
                {label: 'Égal à', value : 'equals'},
                {label: 'Inférieur à', value : 'before'},
                {label: 'Supérieur à', value : 'after'},
                {label: 'Entre', value : 'between'}
            ];
        } else {
            return [
                {label: 'Contient', value : 'contains'},
                {label: 'Commence par', value : 'starts'},
                {label: 'Termine par', value : 'ends'},
                {label: 'Égal à', value : 'equals'},
                {label: 'Dans la liste', value : 'in'}
            ];
        }
    }
    function getLabel(filter) {
        let label = columns.find(col => col.property == filter.property)?.label || filter.property;
        label += ' ' + (getFilterTypes(filter).find(type => type.value == filter.type)?.label || '').toLocaleLowerCase();
        if(filter.type == 'between') {
            label += ' ' + filter.min + ' et ' + filter.max;
        } else {
            label += ' ' + filter.value;
        }
        return label;
    }
    function checkFilter(filter) {
        if(!filter.property) {
            alert('Veuillez choisir une colonne');
            return false;
        } else if(!filter.type) {
            alert('Veuillez choisir un type');
            return false;
        } else if(filter.type == 'between' && (!filter.min || !filter.max)) {
            alert('Veuillez choisir les bornes');
            return false;
        } else if(filter.type && filter.type != 'between' && !filter.value) {
            alert('Veuillez choisir une valeur');
            return false;
        }
        return true;
    }
    function getFormatSort() {
        // Get format for date sort
        var col = columns.find(c => c.property == sortProperty);
        if(col && col.type == 'date') {
            return col.format || Dates.M_D_Y;
        }
        return null;
    }
</script>

<!-- GRID -->
<div class="grid-main" style="--page-size: {pageSize}">
    <!-- TOOLBAR -->
    <Toolbar align="left">
        <slot name="grid-toolbar"></slot>
        <span style="flex-grow: 1;"></span>
        <Button
            text={"Filtrer" + (filters.length > 0 ? " (" + filters.length + ")" : "")}
            border={false}
            icon="filter_list"
            bind:this={filterButton}
            style="margin-right:0"
            on:click={onClickFilters}
        />
    </Toolbar>
    <!-- TABLE -->
    <div class="grid-table">
        <table>
            <!-- HEADER -->
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
                            <th class="sortable" on:click={onSort.bind(this, column.property)}>
                                {column.label}
                                {#if column.property == sortProperty}
                                    <span class="material-icons-round">{sortDirection == 'asc' ? "arrow_upward" : "arrow_downward"}</span>
                                {/if}
                            </th>
                        {/if}
                    {/each}
                </tr>
            </thead>
            <!-- DATAS -->
            <tbody>
                {#each visibleDatas as record}
                    <tr recordId={record.id}>
                        {#if select == 'multiple'}
                            <td class="grid-cell-select">
                                <Checkbox 
                                    style="margin:0" 
                                    check={selection.some(r => r.id == record.id)} 
                                    on:change={onSelect.bind(this, record.id)}
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
                                    on:change={onSelect.bind(this, record.id)}
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
    <!-- PAGING -->
    <div class="grid-paging">
        <span class="grid-paging-text">
            {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredDatas.length)} sur {filteredDatas.length} résultats
        </span>
        {#if filteredDatas.length != visibleDatas.length}
            <span class="grid-paging-buttons">
                <Button icon="keyboard_double_arrow_left" border={false} disable={page == 1} on:click={firstPage}/>
                <Button icon="keyboard_arrow_left" border={false} disable={page == 1} on:click={previousPage}/>
                <Button icon="keyboard_arrow_right" border={false} disable={Math.ceil(filteredDatas.length / pageSize) == page} on:click={nextPage}/>
                <Button icon="keyboard_double_arrow_right" border={false} disable={Math.ceil(filteredDatas.length / pageSize) == page} on:click={lastPage} style="margin-right:0"/>
            </span>
        {/if}
    </div>
</div>

<!-- FILTER MODAL -->
<Modal
    minHeight={350}
    bind:visible={showFilter}
    title={ operation == "view" && tmpFilters.length == 0 ? "Aucun filtre actif" : 
            operation == "view" && tmpFilters.length == 1 ? tmpFilters.length + " filtre actif" : 
            operation == "view" && tmpFilters.length >  1 ? tmpFilters.length + " filtres actifs" :
            operation == "add" ? "Ajouter un filtre" :
            operation == "edit" ? "Modifier un filtre" : ""}
>
    <!-- CONTENT -->
    <div slot="modal-content">
        <!-- VIEW -->
        {#if operation == "view"}
            <!-- ADD BUTTON -->
            <Button
                text="Ajouter"
                icon="add"
                primary={true}
                bind:this={filterBtnAdd}
                on:click={onClickAjouter}
            />
            <!-- FILTERS -->
            {#each tmpFilters as filter}
                <div style="display: flex;">
                    <Button
                        text={getLabel(filter)}
                        border={false}
                        flex={true}
                        style="text-align: left;"
                        on:click={onClickModifier.bind(this, filter.id)}
                    />
                    <Button
                        border={false}
                        icon="delete"
                        on:click={onClickSupprimer1.bind(this, filter.id)}
                    />
                </div>
            {/each}
        <!-- ADD/MODIFY -->
        {:else}
            <!-- FILTER -->
            <div class="grid-filter-edit">
                <!-- COLUMN -->
                <!-- TODO arriver à faire sortir la combo de la popup -->
                <Droplist 
                    label="Colonne"
                    bind:value={currentFilter.property}
                    items={columnsFilter}
                    width={filtersWidth}
                    flex={true}
                    on:change={onChangeColonne}
                    required={true}
                    bind:this={filterDroplistCol}
                />
                <!-- TYPE -->
                {#if currentFilter.property}
                    <Droplist 
                        label="Type"
                        bind:value={currentFilter.type}
                        items={filterTypes}
                        width={filtersWidth}
                        required={true}
                        flex={true}
                    />
                {/if}
                <!-- VALUES -->
                {#if currentFilter.property && currentFilter.type}
                    <!-- DATE -->
                    {#if currentFilter.dataType == "date"}
                        {#if currentFilter.type == "between"}
                            <Toolbar>
                                <DatePicker
                                    label="Du"
                                    bind:value={currentFilter.min}
                                    required={true}
                                    format={currentFilter.format || Dates.D_M_Y}
                                    flex={true}
                                />
                                <DatePicker
                                    label="Au"
                                    bind:value={currentFilter.max}
                                    required={true}
                                    format={currentFilter.format || Dates.D_M_Y}
                                    flex={true}
                                />
                            </Toolbar>
                        {:else}
                            <DatePicker
                                label="Valeur"
                                bind:value={currentFilter.value}
                                required={true}
                                format={currentFilter.format || Dates.D_M_Y}
                                flex={true}
                            />
                        {/if}
                    <!-- NUMBER -->
                    {:else if currentFilter.dataType == "number"}
                        {#if currentFilter.type == "between"}
                            <Toolbar>
                                <Numberfield
                                    label="Valeur min"
                                    bind:value={currentFilter.min}
                                    required={true}
                                    flex={true}
                                />
                                <Numberfield
                                    label="Valeur max"
                                    bind:value={currentFilter.max}
                                    required={true}
                                    flex={true}
                                />
                            </Toolbar>
                        {:else}
                            <Numberfield
                                label="Valeur"
                                bind:value={currentFilter.value}
                                required={true}
                                flex={true}
                            />
                        {/if}
                    <!-- STRING -->
                    {:else}
                        <Textfield
                            label="Valeur"
                            bind:value={currentFilter.value}
                            required={true}
                            flex={true}
                        />
                    {/if}
                {/if}
            </div>
        {/if}
    </div>
    <!-- BUTTONS -->
    <Toolbar slot="modal-buttons">
        {#if operation == "view"}
            <Button
                text="Fermer"
                icon="close"
                border={false}
                flex={true}
                on:click={onClickFermer}
            />
            {#if tmpFilters.length > 0}
                <Button
                    text="Réinitialiser"
                    icon="restart_alt"
                    border={false}
                    flex={true}
                    on:click={onClickReset}
                />
            {/if}
        {:else}
            {#if tmpFilters.length == 0}
                <Button
                    text="Fermer"
                    icon="close"
                    border={false}
                    flex={true}
                    on:click={onClickFermer}
                />
            {:else}
                <Button
                    text="Retour"
                    icon="arrow_back"
                    border={false}
                    flex={true}
                    on:click={onClickRetour}
                />
            {/if}
            {#if operation == "edit"}
                <Button
                    text="Supprimer"
                    icon="delete"
                    border={false}
                    flex={true}
                    on:click={onClickSupprimer2}
                />
            {/if}
        {/if}
        <Button
            text="Valider"
            icon="done"
            primary={true}
            flex={true}
            on:click={onClickValider}
        />
    </Toolbar>
</Modal>

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
    .grid-filter-edit {
        display: grid;
        grid-auto-rows: min-content;
        grid-row-gap: 5px;
    }
</style>
