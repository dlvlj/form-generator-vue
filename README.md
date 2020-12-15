Create beautiful forms using any component library for vue.
## Features
* reactive schema based form.
* compatible with third party component libraries and custom components.
* comes with a validation engine.
* customizable styles.

## Demo
[https://divijbhardwaj.github.io/form-generator-vue-demo/](https://divijbhardwaj.github.io/form-generator-vue-demo/)

### Install
```
npm install form-generator-vue
```
## How to use
```vue
<template>
    <form-generator-vue v-model="fields"/>
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
    }
}
</script>
```
## Props
|props|type|description|
|----|---|----|
|form-config| obj | Form schema |
|form-components| obj |Fom Components map|
|submit-handler| (values) => {} |submit success `function`.|
|handle-submit-fail|(values) => {}| handle submit fail `function`.|
|form-rules| obj | For user defined validations|
|form-editable|bool |Sets the editable state of the form. `Default is true`, if `disabled` then form body containing all the fields will be hidden from view. `v-slot:disabled` can be used to show the disabled state.|
|classes|obj |Used to add classes to all the rows and columns inside form body. Eg - `{row: 'className', col: 'className'}`  |

## Min Required Props
It needs **two essential props** `form-components` and `form-config` to render a form.
```vue
    <template>
        <form-generator-vue
            v-model="fields"
            :form-components="formComponents"
            :form-config="formConfig"
        />
    </template>
```
##### **form-components:**
This prop requires a map of components to know which component will be used for which input type or types.
**IMPORTANT - The components that you want to use must be globally registered. Follow [Official Doc](https://vuejs.org/v2/guide/components-registration.html) to learn how to register component.**.
```js
const formComponents = [
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

##### **form-config**
| options | type | required | description |
| ------ | ------ | ------ | ---- |
| fields | Array | yes | contains `field-config` for every field |
| activeValidation | bool | Optional | enable/disable validations on input. Default is `false` |
| logs | bool | Optional | console logs for easy debugging |

```js
computed: {
    function formConfig  {
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
              }
            ]
        }
    }
}
```
In above example the `fields` property of `form-config` is an array of objects where each object is a `field-config`. In the above example each object is rendered in a single column row. `fields` also supports multiple columns(components/fields) in same row.see the example below.
```js
computed: {
    function FORM_CONFIG  {
        return {
            activeValidation: false,
            fields: [
              {
                model: 'firstName',
                value: 'divij',
                type: 'number',
                props: {
                    // component props here
                }
              },
              {
                model: 'gender',
                type: 'select',
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
#### `field-config` Options

| options | type | required | purpose |
| ------ | ------ | ------ | ----- |
| model | String | true | `v-model`s with component.|
| type | String | optional |`Input type`. Component for it is loaded from `form-components`. If not provided then `text` is set as default and the component for `text` will be picked from `form-components` |
|value| any |optional| Default value to be passed|
|props| obj | optional | Component props |
| show | bool/(ctx) => bool |optional| To dynamically hide or show the field. Field is not validated if hidden. When its visible again `field-config` `value` is assigned else empty is assigned.|
|triggers|(ctx) => ({})| optional |For adding events to a component. Assigned to `v-on`.|
|props.required|bool/(ctx) => bool|optional|Field is not validated if false, validations will run if `activeValidation` is enabled and `rules` are  provided but will not validate onSubmit|
|props.disabled|bool/(ctx) => bool|optional| To disable or enable field.|
|rules|obj|optional| For validations.|
|component|String|optional| For rendering component which is not in `form-components`.|
|errorProp|String|optional|Error prop that component will use to show error message.|

## Get form context
When the form-generator-vue component is loaded then an event is emited to the parent at `created` lifecycle hook. To get the form context you can use the event `setFormContext`.
```vue
<template>
    <form-generator-vue
        @setFormContext = "ctx => formCtx = ctx"
    />
</template>
<script>
    export default{
        data() {
            return {
                formCtx: null
            }
        }
    }
</script>
```

## Helper Component/field
Helper components can be added to form to assist a component. The helper component can be any component whose sole purpose is to asign value to the host component.

There are **two ways of adding helper components**
    * Adding helper components through `form-config`.
    * Slots `before` and `after` a component

**Adding helper component using `form-config`**
```vue
<script>
    export default {
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
                        props: {
                          required: false
                        }
                    }
                    ]
                }
            }
        }
    }
</script>
```

In the above example the `amount_formHelper` is helper field for the `amount` field. The value of `amount` will be assigned to the `amount_helper` and vice versa. This wont go inside infinite loop of assignmet as `watcher` is being used.

**Helper components are required by default, it is recommended to set required false for helper fields/component as form will not submit if its value is empty.**

## Validation
form-generator-vue comes with a flexible validation engine where user can write their own vaidators for each field, validation types for regex and common validators for multiple fields.

The error prop `errorMessage` is passed as default prop to every component, it contains the error data that can be passed to the componet if the validation fails.

During validation of form if any required field is empty its error prop will be set to 'Required'(**will be user controlled soon**) string.

To turn off validation on a field set "required: false" in field-config.

### Adding validators
`form-rules` prop should be passed to the form-generator-vue component for adding your validators.
```vue
    <template>
        <form-generator-vue
            v-model="fields"
            :form-rules="FORM_RULES"
        />
    </template>
    <script>
        import FORM_RULES from 'form-rules.js';
        export default {
            data() {
                return {
                    fields: {}
                }  
            },
            computed: {
                FORM_RULES: () => FORM_RULES,
            }
        }
    </script>
```
**NOTE -** validation functions should return empty string on validation success. In case validation fails it should return error data(any data type that your component supports array, string, obj).

##### For field specific validator
**field-config**
```js
    {
      model: "confirmPassword",
      type: "password",
      props: {
        "append-icon": this.showPassword ? "mdi-eye" : "mdi-eye-off",
        label: "Confirm",
        outlined: true,
        dense: true,
      },
      rules:{
        errorMsg: 'Confirm your password'
      },
      triggers: (ctx) => ({
        "click:append": () =>
          (this.showPassword = !this.showPassword),
      }),
    },
```

**form-rules.js**
```js
    export default {
        confirmPassword: function (value, rules = {}, fields) {
            const {password} = fields;
            const {errorMsg} = rules;
            const success = '';
            const findMatch = () => {
              return password == value ? success : errorMsg;
            }
            return password ? findMatch() : success;
        }
    }
```

##### Validation types
Validation types can be used to handle validation on multiple regex or bool condition type fields using a common function.
**field-config**
```js
    {
        model: 'password',
        rules: {
            type: 'regex',
            rules:{
                regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                errorMsg: `Password must be a combination of at least 6 alphanumeric 
                and special character(s) (e.g. '~','!','@','#','$','%', etc.)`
            },
        }
    }
```
**form-rules.js**
```js
    export default {
        //for regex
        regex: function (value, rules = {}, fields) {
            const {regex, errorMsg} = rules;
            if (!regex || !regex.constructor == RegExp) {
              console.error(`${regex} is not a valid RegExp`);
              return '';
            }
            return regex.test(value) ? '' : errMsg || 'Invalid Input!';
        },
        //for functions
        function: function (value, rules = {}, fields) {
            const { func, errorMsg } = rules || { condtion: undefined };
            if (typeof func !== 'function') {
              console.error(`condition should be a function returning boolean`);
              return '';
            }
            const result = func();
            return result ? '' : errorMsg || 'Invalid input';
        },
    }
```

##### Common validators (`COMMON_VALIDATORS`)
Input sanitization functions can be written here for different input types. All functions under common validators will be called for each field.

**form-rules.js** (from demo)
```js
export default {
  // will be applied to all fields ------------
  COMMON_VALIDATORS: {
    number: (value, rules, fields) => {
      if (typeof value === 'number') {
        if (value < 0) {
          return 'Cannot be negative';
        }
      }
      return '';
    },
    string: (value, rules, fields) => {
        if(typeof value === "string") {
            if(value === '') {
                return 'Cannot leave empty'
            }
        }
        return '';
    }
  }
}
```

**Following params are available in validators/functions.**
* **param 1:** `value`, value of the field.
* **param 2:** `rules`, rules specified in `field-config`.
* **param 3:** `fields`, value of all the fields.

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