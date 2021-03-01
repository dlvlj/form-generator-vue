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
* #### header
* #### footer
* #### before-<model>
* #### after-<model>
* #### before-row
* #### after-row
* #### before-col
* #### after-col
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