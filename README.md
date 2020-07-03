form-generator-vue is a vue component which can be used to **generate forms using custom ```v-model```able components only**. It has a built in validation engine.

### Installation
```sh
npm i form-generator-vue
```
# Usage:
This step(**for beginners**) shows you how to import and use form-generator-vue component after installation. **Follow Min Config step to get it working.**

```
<template>
    <form-generator-vue>
    </form-generator-vue>
</template>

<script>
import FormGeneratorVue from 'form-generator-vue';
export default {
    components: {
        FormGeneratorVue
    }
}
</script>
```

## Min Config:
For making this form generator work we need to pass it **two essential props** `custom-components-map` and `form-config`.

```
    <form-generator-vue
        :custom-components-map="COMPONENTS_MAP"
        :form-config="FORM_CONFIG"
    >
    </form-generator-vue>
```

##### **custom-components-map:**
This prop requires a map of custom components to know which custom component will be used for which input type or types.
**IMPORTANT - The components that you want to use must be globally registered. Follow [Official Doc](https://vuejs.org/v2/guide/components-registration.html) to learn how to register component**

**example**:
```
const COMPONENTS_MAP = [
  {
    type: ['number', 'password', 'text', 'email'],
    name: 'custom-input-component'   //component name
  },
  {
    type: 'select',
    name: 'custom-select-component'
  },
  {
    type: 'checkbox',
    name: 'custom-checkbox-component'
  },
];
```

##### **form-config:**
this prop requires an object containing the following options:

| property | type | required |
| ------ | ------ | ------ | 
| fields | Array | true |
| activeValidation | Boolean | Optional |

**example**:
```
computed: {
    function FORM_CONFIG  {
        return {
            activeValidation: false,
            fields: [
              {
                name: 'firstName',
                type: 'number',
                props: {
                    // component props here
                }
              },
              {
                name: 'gender',
                type: 'select',
                props: {
            
                }
              }
            ]
        }
    }
}
```
when the above `form-config` is passed to the `form-generator-vue` as a prop then the following data properties are created: 

```
fields: {
    firstName,
    gender
},
errors: {
    firstName,
    gender
}
```

in above example the `fields` property of `FORM_CONFIG` is an array of objects. Each object is a `field config`. for each `field config` you can use the following options:

| property | type | required | purpose |
| ------ | ------ | ------ | ----- |
| name | String | true | it `v-model`'s with your custom component |
| type | String | optional | Its input type and tells form generator to find custom component for specified input type from `custom-component-map`. If left undefined then default will be 'text' and the custom component for 'text' will be picked from `custom-component-map` |
|value|any value that your component supports|optional| assigns default value to that component|
|props| Object | optional | provide props to the custom components that you use |
| show | Function that returns Boolean (form context is available as func parameter here) |optional| to dynamically hide or show the field based on anything you want, form context is available. it the field has show false then its not validated and its value is set to default(value property from its `field config`, If value was not provided in `field config` then empty string('') is assigned to it)|
|triggers|Function that returns object (form context available as parameter)| optional | adding custom events **example** `triggers: ctx => ({onSelect: function({ value }) {ctx.fields.gender = val;}})` the object returned by triggers is simply assigned to `v-on` |
|required|Boolean|optional|if value is false then component's value is not validated and validated if its true|
|disabled|Boolean (inside props)|optional| to diable your field you can use this |
|rules|Object|optional|is used for applying custom validation types(regex, minmax value .. etc) and constants to evaluate with. goto [Validations section]() to learn more|
