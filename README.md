form-generator-vue is a vue component which can be used to **generate forms using custom ```v-model```able components(any type of component you want to use) only, default components are not provided by the form-generator-vue, i am planning to create components library for the form-generator-vue**. It has a built in validation engine.

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

## Props list:
|prop|how to use|
|----|----|
|form-config| this prop is used to pass the config file used for rendering the form. Breifly explained in the section below(Min Required Props)|
|custom-components-map| this prop is used for passing the map of custom components that you want to use with the form generator. Breifly explained in the section below(Min Required Props)|
|submit-handler| pass the `referrence` of the `function` that you want to use as submit handler for the generated form. `values` will be passed to the function as a parameter, so you can use the values of all the fields/component used int the generated form|
|form-rules| this prop is used for validating form using user/dev defined validation constants, validation function and validation types. breifly explained in section(Form Validation)|
|form-editable|this prop of type `Boolean` is used to set the editable state of the form. `Default is true`, if set to `false` then all the fields/components(those which are created with form-config) will be removed from view and you can use `v-slot:disabled` to show the disabled state however you want(you have access to the context of the form-generator-vue). `fieldsConfig_FLAT`(its `fields` of form-config prop, a non nested version. learn more about it in form-config under Section( Min Required Props ) ) is also available as slot prop `|

## Get form context:
When the form-generator-vue component is loaded then an event is emited to the parent at `created` lifecycle hook. To get the form context you can use the event handler `setFormContext`

eg:
```
<form-generator-vue
    @setFormContext = "ctx => formCtx = ctx"
>
</form-generator-vue>
<script>
    export default{
        data() {
            return {
                formCtx: undefined
            }
        }
    }
</script>
```

using form context you can get access to the `fields`, `errors` object. Every key in `fields` has its own component which is `v-model`ed with it, you can use this while creating your `form-config`**(read Min Required Props)**, so you can use the value of one key to change the value of another or hide show another component or the same. you can find all the options here (Min Required Props -> form-config -> field config -> options).

you can also access the computed properties of the form-generator-vue using the context. eg `fieldsConfig_FLAT`, its a flat version of the `fields` inside `form-config` that you will learn about in the section below(Min Required Props -> form-config).

## Min Required Props:
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
In above example the `fields` property of `FORM_CONFIG` is an array of objects where each object is a `field config`. In the above example each object is rendered into its own row. `fields` also supports row column layout where you can render multiple columns(components/fields) in same row.see the example below

eg: 
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
              },
              [
                {
                    name:'countryCode',
                    type:'select'
                },
                {
                    name: 'mobile',
                    type: 'number'
                }
              ]
            ]
        }
    }
}
```

when the above `form-config` is passed to the `form-generator-vue` as a prop then the following data properties are created: 

```
fields: {
    firstName,
    gender,
    countryCode,
    mobile
},
errors: {
    firstName,
    gender,
    countryCode,
    mobile
}
```
Every key in `fields` has its own component **(component is loaded from custom-component-map automatically if present, if not then text type component is loaded by default)** with which it is `v-model`ed with,

key in `errors` are passed to their respective components as prop `error` and `errorMsg`

For each `field config` you can use the following options:

| property | type | required | purpose |
| ------ | ------ | ------ | ----- |
| name | String | true | it `v-model`'s with your custom component.|
| type | String | optional | Its input type and tells form generator to find custom component for specified input type from `custom-component-map`. If left undefined then default will be 'text' and the custom component for 'text' will be picked from `custom-component-map` |
|value|any value that your component supports|optional| assigns default value to that component|
|props| Object | optional | provide props to the custom components that you use |
| show | Function that returns Boolean (form context is available as func parameter here) |optional| to dynamically hide or show the field based on anything you want, form context is available. it the field has show false then its not validated and its value is set to default(value property from its `field config`, If value was not provided in `field config` then empty string('') is assigned to it)|
|triggers|Function that returns object (form context available as parameter)| optional | adding custom events **example** `triggers: ctx => ({onSelect: function({ value }) {ctx.fields.gender = val;}})` the object returned by triggers is simply assigned to `v-on` |
|required|Boolean|optional|if value is false then component's value is not validated and validated if its true|
|disabled|Boolean (inside props)|optional| to diable your field you can use this |
|rules|Object|optional|is used for applying custom validation types(regex, minmax value .. etc) and constants to evaluate with. goto [Form Validation]() section to learn more|

# Helper Component/field
There can be a case where you might want a component whose sole purpose would be to assign value to another component. the feeder component in this case is the helper.

Imagine there is a amount field, where you can enter the amount on which you want to calculate interest. you might want to provide some amount option in form of chips, so if you click on a chip that is holding some amount then that amount gets filled into amount field on selection of that chip. And if  the amount field hold some value which reflects the same value held by one of the chips then that chip is selected by default. see this example:

```
computed: {
    function FORM_CONFIG  {
        return {
            fields: [
              {
                name: 'amount',
                type: 'number',
              },
              {
                name: 'amount_formHelper',
                type: 'select',
                required: false
              }
            ]
        }
    }
}
```

In the above example you can see the the field name `amount` and for adding helper field for this field you need to use its name and append `_formHelper` to it, like in the above example. Now the value of amount will be assigned to the amount_helper and vice versa. **Dont worry this wont go inside infinite loop of assignmet as** `watcher` **is being used**. which triggers on value change only. Read officail docs of vue watchers to know more .

setting `required` option to false is recommended for helper fields/component as form will not submit if its value is empty. Its also not an essential field/component.