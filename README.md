Create beautiful forms using any component library for vue.
## Features
* reactive schema based form.
* compatible with third party component libraries like vuetify, element etc and custom components.
* customizable form layout.
## [Demo](https://divijbhardwaj.github.io/form-generator-vue-demo/)
### Installation
```
npm install form-generator-vue
```
## How to use
```vue
<template>
    <form-generator-vue 
        v-model="fields"
        :components="components"
        :schema="schema"
        :on-submit="handleSubmit"
    />
</template>

<script>
import FormGeneratorVue from 'form-generator-vue';
export default {
    data() {
        return {
            fields: {}
        }
    },
    components: {
        FormGeneratorVue
    },
    computed: {
        components: () => [
            {   
                name: 'v-text-field',
                type: ['text', 'password', 'email', 'number'],
                errorProp: 'errorMessages'
            }
        ],
        schema() {
          return {
            fields: [
              {
                model: 'email',
                type: 'email'
              },
              {
                model: 'mobile',
                type: 'number'
              },
              {
                model: 'password',
                type: 'password'
              }
            ]
          }
        }
    },
    methods: {
        async handleSubmit() {
            // await network call ---------;
            console.log('form submitted', this.fields)
        }
    }
}
</script>
```
## Props
|props|type|description|
|----|---|----|
| schema | obj | json schema to create form |
| components | obj | component map to render component for specific type of field |
| onSubmit | async/sync function | submit success function |
| onSubmitFail | async/sync function | submit fail function.|
| disabled | Bool | disable all fields |
| activeValidation | bool | toggle validation on input for all fields. Default is `false` |
| activeValidationDelay | milliseconds | debounced validation for given time for all fields|
| logs | bool | toggle validation and submit logs |
| classes | obj | To add classes to all the rows and columns inside form body |

#### `field-config` Options

| options | type | required | purpose |
| ------ | ------ | ------ | ----- |
| model | String | true | v-model with component.|
| type | String | false | Input type. Component for it is loaded from `components`. Default is 'text' |
|props| obj | false | Component props |
| hide | bool/() => bool | false | show/hide field. Not required when hidden |
|events| obj | optional | Assigned to component `v-on` |
|props.required|bool/(ctx) => bool|optional|Field is not validated if false, validations will run if `activeValidation` is enabled and `rules` are  provided but will not validate onSubmit|
|props.disabled|bool/(ctx) => bool|optional| To disable or enable field.|
|rules|obj|optional| For validations.|
|component|String|optional| For rendering component which is not in `form-components`.|
|errorProp|String|optional|Error prop that component will use to show error message.|

## Slots
#### [Slots Arrangement](https://drive.google.com/file/d/1vq3KcNKR0CAHy8BYKi0FsNeieAwoSGpl/view?usp=sharing)

#### v-slot:`header`
For form header information.

#### v-slot:`sectionLabel`
Single label for multiple components.
**slot props** `fieldConfig`, `fieldsConfigFlat`.

#### Sub component slot
`v-slot:<model>` for adding sub components to the parent component.

#### Slots `before` and `after` a component
For adding support components or ui elements before or after a component.
* v-slot:`<model>_before`
* v-slot:`<model>_after`
(replace **<model>** with the **model** property of **field-config**)

#### v-slot:`disabled`
This slot is only visible when the `form-editable` prop of `form-generator-vue` is enabled. When enabled the form body(containing all the components/fields) hides from view and only this slot is visible.
This slot can be used to show disabled state of the form however you want.
**slot prop:** `fieldsConfigFlat`.

#### v-slot:`agreement`
To show terms and condition checkbox, policy checkbox, etc.

#### v-slot:`actions`
For form actions like submit and cancel etc.

### v-slot:`footer`
For footer notes, etc.

## Styling
No default CSS is present in form generator. **BEM** methodology is used to enure no class conflicts with third party component library.

#### Classes
* form - **"generated-form"**
    * header - **"generated-form__header"**
    * body - **"generated-form__body"**
        * row - **"generated-form__body__row"**
            * col - **"generated-form__body__row__col**
            * col - **"col-`<model>`"** (dynamic class, to precisely identify col in which component is rendered).
    * footer - **"generated-form__footer"**

## Contributors
This project exists thanks to all the people who contribute. [Contribute](https://github.com/divijhardwaj/form-generator-vue).
* [Carlos Noguera](https://github.com/kaysersoze)
## Versions
 1.1.7
* Fixed form not validating properly and v-model bug.
* Added v-model now supports field errors too.

 1.1.5
* v-model support added.
* sub component slot added to support nested components like radio button group etc.

 1.1.3
* `required` prop moved from field-config to field-config.props
* `loading` data property removed.

 1.1.0
* `trim` directive modifier removed.

 1.0.9
* `handle-submit-fail` prop is provided.
*  Auto scroll to first invalid field Removed.

 1.0.5
* Optimizations and auto scroll to first invalid field on submit.

1.0.4
* The prop name `custom-componenets-map` changed to `form-components`.
* The property `name` changed to `model` in `field-config`.
* `form-components` now supports `errorProp` for each component.