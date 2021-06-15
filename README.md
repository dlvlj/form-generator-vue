# form-generator-vue

Form generator component for vue. Build forms using different component libraries.

## Demo

[Link](https://divijbhardwaj.github.io/form-generator-vue-demo/)

## Features

* schema based form

* mixing component libraries

* css framework support

* model based validations

* customisable styles

* dependency free

## Installation

`npm install form-generator-vue`

## How to use



## Props

|props|type|description|
|----|---|----|
| schema | obj | contains **fields, rules, form, class and options** |
| components | obj | map to render component for specific type of field |
| submit | async/sync function | submit success function |
| submitFail | async/sync function | submit fail function.|

## Field Options

| options | type | default | purpose |
| ---- | ---- | ------ | ---- |
| model | String | | v-model with component.|
| type | String | 'text' | Input type. Component for it is loaded from `components`. |
| props| obj | {} | Component props |
| hide | bool/() => bool | false | show/hide field. Not required when hidden |
| v-on | obj | {} | Assigned to component `v-on`. |
|validator | () => //return error data | | function returning error data(string, array etc) on validation fail. |
| component | String | | for using any component |
| errorProp | String | 'errorMessages' | name of error prop consumed by component to show error |
| activeValidation | Boolean | false | toggle validation on input |
| activeValidationDelay | Number | 0 | debounced validation |

## HTML | Layout

row(s) => column(s) => field/component

```js
{
	fields: [ 
		// 1 row 1 column -------
		{
			model:'name',
			vOn: {
				type:'text'
			}
		},
		// 1 row 2 columns -------
		[
			{
				model:'mobile',
				vOn: {
					type:'number'
				}
			},
			{
				model:'password',
				vOn: {
					type:'password'
				}
			}
		]
	]
}
```

## Slots

## classes used

## Contributors

This project exists thanks to all the people who contribute. [Contribute](https://github.com/divijhardwaj/form-generator-vue).

* [Carlos Noguera](https://github.com/kaysersoze)

## [Changelog](https://github.com/divijbhardwaj/form-generator-vue/blob/master/changelog.md)