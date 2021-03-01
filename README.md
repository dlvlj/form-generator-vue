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
| disabled | Bool | toggle disable all fields |
| activeValidation | bool | toggle validation on input for all fields. Default is `false` |
| activeValidationDelay | milliseconds | debounced validation for given time for all fields|
| logs | bool | toggle validation and submit logs |
| classes | obj | To add classes to all the rows and columns inside form body |

#### field schema Options

| options | type | default | purpose |
| ------ | ------ | ------ | ----- |
| model | String |  | v-model with component.|
| type | String | 'text' | Input type. Component for it is loaded from `components`. |
| props| obj | {} | Component props |
| hide | bool/() => bool | false | show/hide field. Not required when hidden |
| v-on | obj | {} | Assigned to component `v-on`. |
|validator | () => //return error data | | function returning error data(string, array etc) on validation fail. |
| component | String |  | for using any component |
| errorProp | String | 'errorMessages' | name of error prop consumed by component to show error |
| activeValidation | Boolean | false | toggle validation on input |
| activeValidationDelay | milliseconds | 0 | debounced validation for given time |

## Slots
#### header
#### Classes used
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