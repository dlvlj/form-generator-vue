With **form-generator-vue** you can create forms using the component library of your choice or the components that you have created. You get full control over the generated from wether its css styles or js. It comes with a easy to use and highly flexible validation engine.

### github: [https://github.com/divijhardwaj/form-generator-vue](https://github.com/divijhardwaj/form-generator-vue)

### [Demo (WIP)](https://github.com/divijhardwaj/form-generator-vue-demo)

### Installation
```
npm i form-generator-vue
```

# Versions
##### 1.0.3
****
* The property **name** is converted to **model** in `field-config`.
* In `custom-components-map` users can now add error prop that a component consumes to show error message.

##### 1.0.1
****
refactoring, readme update
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
```js
const COMPONENTS_MAP = [
  {
    type: ['number', 'password', 'text', 'email'],
    component: { name: 'v-text-field', errorProp: 'errorMessages' }
  },
  {
    type: 'select',
    component: { name: 'v-select', errorProp: 'errorMessages' }
  },
  {
    type: 'checkbox',
    component: { name: 'v-checkbox', errorProp: 'errorMessages' }
  },
];
```

##### **form-config:**
this prop requires an object containing the following options:

| options | type | required | purpose |
| ------ | ------ | ------ | ---- |
| fields | Array | true | contains information of each field |
| activeValidation | Boolean | Optional | enable/disable validations when user inputs. **false** by default |
| logs | Boolean | Optional | shows validation logs for easy debugging |

**example**:
```js
computed: {
    function FORM_CONFIG  {
        return {
            activeValidation: false,
            fields: [
              {
                model: 'firstName',
                type: 'number',
                props: {
                    // component props here
                }
              },
              {
                model: 'gender',
                type: 'select',
                props: {
            
                }
              }
            ]
        }
    }
}
```
In above example the `fields` property of `FORM_CONFIG` is an array of objects where each object is a `field config`. In the above example each object is rendered in a single column row. `fields` also supports multiple columns(components/fields) in same row.see the example below

eg: 
```js
computed: {
    function FORM_CONFIG  {
        return {
            activeValidation: false,
            fields: [
              {
                model: 'firstName',
                type: 'number',
                props: {
                    // component props here
                }
              },
              {
                model: 'gender',
                type: 'select',
                props: {
            
                }
              },
              [
                {
                    model:'countryCode',
                    type:'select'
                },
                {
                    model: 'mobile',
                    type: 'number'
                }
              ]
            ]
        }
    }
}
```

when the above `form-config` is passed to the `form-generator-vue` as a prop then the following data properties are created: 

```js
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

properties of `errors` are passed to their respective components as prop **errorMessage** by default unless error prop is explicitly specified in `custom-components-map` or `field-config`.

For each `field config` you can use the following **options**:

| options | type | required | purpose |
| ------ | ------ | ------ | ----- |
| model | String | true | it `v-model`'s with your custom component.|
| type | String | optional | Its input type and tells form generator to find custom component for specified input type from `custom-component-map`. If left undefined then default will be 'text' and the custom component for 'text' will be picked from `custom-component-map` |
|value| any |optional| assigns default value to that component|
|props| Object | optional | provide props to the custom components that you use |
| show | Function that returns Boolean (form context is available as func parameter here) |optional| to dynamically hide or show the field based on anything you want, form context is available. it the field has show false then its not validated and its value is set to default(value property from its `field config`, If value was not provided in `field config` then empty string('') is assigned to it)|
|triggers|Function that returns object (form context available as parameter)| optional | adding custom events **example** `triggers: ctx => ({onSelect: function({ value }) {ctx.fields.gender = val;}})` the object returned by triggers is simply assigned to `v-on` |
|required|Boolean|optional|if value is false then component's value is not validated and validated if its true|
|disabled|Boolean (inside props)|optional| to diable your field you can use this |
|rules|Object|optional|is used for applying custom validation types(regex, minmax value .. etc) and constants to evaluate with. goto **Validation section** to learn more|
|component|String|optional|If you want to use a component that is not present in `custom-component-map` then you can use this option. The component that you want to use must be globally registered and v-model'able|
|errorProp|String|optional|use this option to enter the name of the error prop that your component will use to show error message. `field-config` **errorProp** will be picked as error prop for the component even if that component already has **errorProp** in `custom-components-map`. By default 'errorMessage' prop is passed to the component|

# Helper Component/field
***
There can be a case where you might want a component whose sole purpose would be to assign value to another component. the feeder component in this case is the helper.

Imagine there is a amount field, where you can enter the amount on which you want to calculate interest. you might want to provide some amount option in form of chips, so if you click on a chip that is holding some amount then that amount gets filled into amount field on selection of that chip. And if  the amount field hold some value which reflects the same value held by one of the chips then that chip is selected by default. see this example:

```js
computed: {
    function FORM_CONFIG  {
        return {
            fields: [
              {
                model: 'amount',
                type: 'number',
              },
              {
                model: 'amount_formHelper',
                type: 'select',
                required: false
              }
            ]
        }
    }
}
```

In the above example you can see the the `field-config` with **model**:`amount` and for adding helper field for this field you need to use its **model** value and append `_formHelper` to it, like in the above example. Now the value of amount will be assigned to the amount_helper and vice versa. **Dont worry this wont go inside infinite loop of assignmet as** `watcher` **is being used**. which triggers on value change only. Read official docs of vue watchers to know more .

setting `required` option to false is recommended for helper fields/component as form will not submit if its value is empty. Its also not an essential field/component.

**slots like `before` & `after`** can also be used for adding helper components in case you dont want to add helpers to `form-config`. **goto Slots => Slots `before` and `after` a component** section

# Validation
***
form-generator-vue comes with a flexible validation engine.

In `form-config` you can set `activevalidations` property to true if you want validations and see error message while user inputs. Set it to false to perform validations on submit click only. Default is false.

The error prop(**errorMessage** is passed as default) which is passsed the component, it contains the error data that can be shown to user incase that component isnt validated in form.

By default `form-generator-vue` will check for non empty fields when validating. If encounter any empty field then it will set the error prop with String 'Required'.

check **field-config** for options like `required`(if you dont want validations on a specific field).

### For custom validation and error messages
`form-rules` prop must be passed to the form-generator-vue component.

example:
```
    <form-generator-vue
        :form-rules="FORM_RULES"
    >
    </form-generator-vue>
    <script>
        import FORM_RULES from 'form-rules.js';
        computed: {
            FORM_RULES: () => FORM_RULES
        }
    </script>
```

**form-rules.js**
```js
    export default {
    
          // will be applied to all fields ------------
          COMMON_VALIDATORS: {
            numberNotNegative: value => {
              if (typeof value === 'number') {
                return value >= 0 ? '' : 'cannot be negative';
              }
              return '';
            },
            numberLimit: value => {
                if (typeof value === 'number') {
                return value > 0 ? '': 'min value allowed is 1';
              }
              return '';
            }
          },
          
        // VALIDATION TYPES (common logic for multiple regex type validations)---------
        regex: function(value, rules, fields) {
            return regex.test(value)? '' : 'error message';
        },
        
        // VALIDATION FOR SPECIFIC FIELD -------------
        fullName: function(value) {
            return !!value ? '' : 'Please enter full name'
        }
    }
```

in **form-rules.js**, export an object in which all the properties are your validation functions, they return empty string(can say null) on validation success. when validation fails it returns error data(can be of any data type that your comonent can support).

If your `field-config` contains `model:'fullName'` and you want to write a validation function specifically for that field then your validation function name should be `fullName`, like in above example.

#### Validation types
You can also create **validation types** for using a common validation function for multiple fields. For that you can create a common validation function for lets say regex testing or for min-max limit. You can name your function whatever you want.
Lets say you name your function **'regex'** for validating multiple regex type fields then you need to add `type` property to your `field-config`, this property will contain the validation type that you want to use, 'regex' in this case. `field-config` will look like this.

```js
    {
        model: 'amount',
        rules: {
            type: 'regex'
        }
    }
```

In validation functions that you are using, you can use the following parameters for more control.
* **param 1:** `value` of the field you are writing validation function for.
* **param 2:** `rules` of the field. ('rules' inside field-config as shown here **Min Required Props => form-config => field-config => options**  ).
    * You can also pass validation constants here(values with which you want to compare or whatever you want to do to validate the value) and catch them inside your validation function.
* **param 3:** `fields` of the form. you can use this in case you want to validate the value of a field using value of some other field. `fields` is an object containing values of all the components used in the form.

#### Common validators (`COMMON_VALIDATORS`)
You can write your input sanitization functions here. **Example** For input type **number** you may not want nuser to enter some negative value. This validation will be applied to all 'number' type fields. Similarly you might want to exclude some values in 'text' type field. This might help you in avoiding code repetition. So keeping these things in mind `COMMON_VALIDATORS` was designed. see usage in **form-rules.js**(given above).

only one param is passed to this which is 'value', it does not need 'rules' and 'fields' params.

# Slots
***
#### [Click here](https://drive.google.com/file/d/1vq3KcNKR0CAHy8BYKi0FsNeieAwoSGpl/view?usp=sharing) to see generated form structure to know where the slots are located.
### v-slot:`header`
### v-slot:`sectionLabel`
This slot can be used to show one label for a row containing multiple columns. Example 'Enter full name' label for two fields side by side.

**available slot props** `fieldConfig`, `fieldsConfigFlat`.

In form config if you need two or more columns in single row then you need to enclose them in array.
The `form-config` will look like this.

```js
{
    fields: [
        [
            {
                model: 'fName'
            },
            {
                model: 'lName'
            }
        ],
        {
            model: 'age'
        }
    ]
}
```

In above example the fields **fName, lName** are two columns in a single row and **age** is in a column in another row.

## Slots `before` and `after` a component
you might want to add a 'copy text' button right next to your component/field but adding that to `form-config` would be unnecessary overhead. keeping that in mind a slot is added just before the coomponent/field and just after it.

#### v-slot:`<field-config.model>_before`
#### v-slot:`<field-config.model>_after`

replace `<field-config.model>` with the model property of `field-config`.

### v-slot:`disabled`

This slot is only visible when the `form-editable` prop of `form-generator-vue` is enabled. When this prop is enabled the body(containing all the components/fields) of the form is not visible and only this slot is visible.

This slot can be used to show disabled state of the form however you want.

**slot props availabel are:** `fieldsConfigFlat`.

### v-slot:`agreement`
This slot can be used to show terms and condition checkbox, policy checkbox, etc.

### v-slot:`actions`
You can use this slot to show **submit button** and **cancel button**

### v-slot:`footer`
For footer notes, etc.

## Styling:
***
**No default styling** or css is provided in form-generator-vue, you can write your own styles for the generated form.
The component library or custom created component you decide to use with this package might contain some css that can cause class conflict but dont worry about that the classes of form-generator-vue follow **BEM** methodology to ensure no class conflict happens.
#### classes
* form - **"generated-form"**
    * header - **"generated-form__header"**
    * body - **"generated-form__body"**
        * row - **"generated-form__body__row"**
            * col - **"generated-form__body__row__col**
            * col - **"col-`<field-config.model>`"** (dynamic class, to precisely identify col in wich component is rendered).
    * footer - **"generated-form__footer"**