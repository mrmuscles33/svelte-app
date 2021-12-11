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
	}];
	let checkboxValues = [1,2];
	function onChangeCheckboxes(event){
		alert(event.detail.selectedValues);
	}

	let date = '25/11/2021';
	function onChangeDate(evt){
		alert(evt.detail.value)
	}

	let droplistItems =  [
				{ value: '',   label: '' },
                { value: 'H',  label: 'Homme' },
                { value: 'F',  label: 'Femme' },
				{ value: 'T',  label: 'Transgenre' },
				{ value: 'NB', label: 'Non binaire' },
				{ value: 'NG', label: 'Non genré' },
                { value: 'A',  label: 'Autre' },
        ];
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
			colorHover="#111111"
			colorFont="#FFFFFF"
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
			inline={false}
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

		<h3>Date Pickers</h3>
		<DatePicker
			label="Date"
			minDate="10/11/2021"
			on:change={onChangeDate}
			required={true}
			calendarOnly={true}
			colorPicker="#222222"
			colorPickerBackground="#444444"
			colorPickerFont="#FFFFFF"
			colorPickerFontSelected="#FFFFFF"
			colorPickerHover="#666666"
			colorPickerFontOut="#888888"
		/>

		<h3>Droplists</h3>
		<Droplist 
			label="Sexe"
			items={droplistItems}
		/>
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