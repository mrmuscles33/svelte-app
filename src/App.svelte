<script>
	import Button from './Components/Button.svelte';
	import Checkbox from './Components/Checkbox.svelte';
	import CheckboxGroup from './Components/CheckboxGroup.svelte';
	import RadioGroup from './Components/RadioGroup.svelte';
	import Switch from './Components/Switch.svelte';
	import Textfield from './Components/Textfield.svelte';
	import DatePicker from './Components/DatePicker.svelte';
	import Droplist from './Components/Droplist.svelte';
	import CounterButton from './Components/CounterButton.svelte';
	import TimePicker from './Components/TimePicker.svelte';
	import Password from './Components/Password.svelte';
	import Numberfield from './Components/Numberfield.svelte';
	import Grid from './Components/Grid.svelte';
	import Dates from './Utils/Dates';
	import Times from './Utils/Times';
	import Ajax from './Utils/Ajax';

	function clickButton(){
		alert('click');
	}
	function changeSwitch(evt){
		alert(evt.detail.check)
	}

	let radios = [{
		label: 'Radio 1',
		value: 1,
		disable: false
	},{
		label: 'Radio 2',
		value: 2,
		disable: false
	},{
		label: 'Radio 3',
		value: 3,
		disable: true
	}];
	let radioValue = 1;
	function onChangeRadio(event){
		alert(event.detail.selectedValue);
	}

	let checkboxes = [{
		label: 'Checkbox 1',
		value: 1
	},{
		label: 'Checkbox 2',
		value: 2
	},{
		label: 'Checkbox 3',
		value: 3
	},];
	let checkboxValues = [1,2];
	function onChangeCheckboxes(event){
		alert(event.detail.selectedValues);
	}

	let date = '25/11/2021';
	function onChangeDate(evt){
		alert(evt.detail.value)
	}

	let droplistValue = 'fr';
	let droplistItems =  [
		{ value: '',   label: '' },
		{ value: 'fr',  label: 'Français'},
		{ value: 'gb',  label: 'English'},
		{ value: 'es',  label: 'Espanol'},
		{ value: 'de', label: 'Deutsch'},
		{ value: 'it', label: 'Italiano'},
		{ value: 'ru',  label: 'русский'}
	];
	let droplistItemsRender = (record) => '<span class="flag-icon flag-icon-' + record.value + '"></span> ' + record.label;

	let droplistItems2 =  [
		{ value: '',   label: '' },
		{ value: 'H',  label: 'Homme', sexe: 'male' },
		{ value: 'F',  label: 'Femme', sexe: 'female'}
	];
	let droplistItems2Render = (record) => '<span class="material-icons-round" style="vertical-align:middle">' + record.sexe + '</span> <span style="vertical-align:middle">' + record.label + '</span>';

	function sendRequest(){
		Ajax.send(
			'TestServlet',
			'test',
			{
				toto: ['aaa','bbb']
			},
			(response) => {
				alert(response.toto)
			},
			() => {}
		);
	}

	let gridColumn = [
		{label: 'Colonne 1', property: 'prop1', type: 'date', format: Dates.D_M_Y},
		{label: 'Colonne 2', property: 'prop2'},
		{label: 'Colonne 3', property: 'prop3', type: 'number', render: (record) => record.prop3 || '<i>Vide</i>'}
	];
	let gridData = [
		{prop1: '01/01/2023', prop2: 'Valeur A', prop3: 'Valeur 1'},
		{prop1: '02/01/2023', prop2: 'Valeur B'},
		{prop1: '03/03/2023', prop2: 'Valeur C', prop3: 'Valeur 2', prop4: 'Valeur'},
		{prop1: '04/01/2023', prop2: 'Valeur D', prop3: 'Valeur 1'},
		{prop1: '05/01/2023', prop2: 'Valeur E'},
		{prop1: '06/07/2023', prop2: 'Valeur F', prop3: 'Valeur 2', prop4: 'Valeur'},
		{prop1: '07/01/2023', prop2: 'Valeur G', prop3: 'Valeur 1'},
		{prop1: '08/01/2023', prop2: 'Valeur H'},
		{prop1: '09/11/2023', prop2: 'Valeur I', prop3: 'Valeur 1', prop4: 'Valeur'},
	];
	let gridSelection = [
		{prop1: 'Valeur B', prop2: 'Valeur 2'}
	]
	let filters = [{
		property: 'prop2',
		dataType: 'string',
		type: 'equals',	
		value: 'Valeur A',
	}];
</script>

<main>
	<h1>Svelte JS Components</h1>
	<section>
		<h2>Controls</h2>
		<h3>Buttons</h3>

		<Button
			icon="search"
			text="Primary"
			primary={true}
			cls="test"
			on:click={sendRequest}
		/>
		<Button
			icon="search"
			text="Secondary"
			on:click={clickButton}
		/>
		<Button
			text="Tertiary"
			border={false}
		/>
		<Button
			text="Disabled"
			disable={true}
			on:click={clickButton}
		/>

		<h3>Custom Buttons</h3>
		<CounterButton
			text="Likes"
			icon="favorite"
			value="999"
		/>

		<h3>Checkboxes</h3>
		<Checkbox
			label="Single checkbox"
			check={true}
			disable={true}
		/>
		<br/>
		<CheckboxGroup
			bind:items={checkboxes}
			name="checkboxgroup"
			bind:selectedValues={checkboxValues}
			on:change={onChangeCheckboxes}
		/>

		<h3>Radios</h3>
		<RadioGroup
			bind:items={radios}
			name="radiogroup"
			bind:selectedValue={radioValue}
			on:change={onChangeRadio}
			inline={true}
		/>

		<h3>Switches</h3>
		<Switch
			on:change={changeSwitch}
			check={true}
		/>
		<Switch
			disable={true}
		/>
	</section>
	<br/>
	<section>
		<h2>Inputs</h2>
		<h3>Textfields</h3>

		<Textfield 
			label="Label"
			errorMessage="tt"
		/>
		<Textfield 
			filled={false}
		/>
		<Textfield 
			label="Icons"
			iconLeft="search"
			iconRight="highlight_off"
		/>
		<Textfield 
			label="Disable"
			iconLeft="search"
			disable={true}
		/>
		<Textfield 
			label="Error"
			iconRight="home"
			errorMessage="Le champ est vide"
		/>

		<h3>Passwords</h3>
		<Password 
			label="Password"
			iconLeft="fingerprint"
		/>

		<h3>Numberfields</h3>
		<Numberfield 
			label="Number"
			integer=2
			decimal=1
			min=-1
		/>

		<h3>Date & Time Pickers</h3>
		<DatePicker
			label="Date"
			minDate="2000/01/01"
			maxDate="2024/12/31"
			format={Dates.Y_M_D}
			on:change={onChangeDate}
			required={true}
			filled={false}
		/>
		<TimePicker 
			format={Times.H_M_S}
			label="Heure"
			minTime="11:28:00"
			maxTime="21:50:00"
		/>

		<h3>Droplists</h3>
		<Droplist 
			label="Langue"
			filter={true}
			value={droplistValue}
			items={droplistItems}
			render={droplistItemsRender}
		/>
		<Droplist 
			label="Sexe"
			items={droplistItems2}
			render={droplistItems2Render}
		/>
	</section>
	<br/>
	<section>
		<h2>Grid</h2>

		<Grid 
			columns={gridColumn} 
			datas={gridData}
			selection={gridSelection}
			filters={filters}
			pageSize=5
			select="multiple">
			<span slot="grid-toolbar">
				<Button
					text="Ajouter"
					border={false}
				/>
				<Button
					text="Exporter"
					border={false}
				/>
			</span>
		</Grid>
	</section>
</main>

<style>
	main {
		padding: 15px;
		background-color: #EEEEEE;
		margin: 0;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}
	section {
		background-color: #FFFFFF;
		border-radius: 10px;
		padding: 15px 30px;
	}
	h1{
		font-size: 32px;
	}
	h2{
		font-size: 26px;
	}
	h3{
		font-size: 20px;
	}
</style>