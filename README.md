# Адаптированная библиотека effector-forms от 42-px для использования совместно с VueJS.

## Установка

`yarn add effector-forms-vue` or `npm install effector-forms-vue`

- [Подробное описание можно найти в оригинальном репозитории 42-px](https://github.com/42-px/effector-forms)

## Hook useForm для VueJS

```js
import { useForm, createForm } from "effector-forms-vue";

export const userForm = createForm({
  fields: {
    [FORM_PAGE_FIELDS.NAME]: {
      rules: [rules.required()],
      init: "",
    },
    [FORM_PAGE_FIELDS.EMAIL]: {
      rules: [rules.required()],
      init: "",
    },
  },
  validateOn: ["submit"],
  domain: formPageDomain,
});
```

```vue
<script setup lang="ts">
import { makeInputBinder, useForm } from "effector-forms-vue";
import { userForm } from "./model";

const form = useForm(userForm);
</script>

<template>
  <form @submit.prevent="form.submit">
    <my-input v-bind="makeInputBinder(form, 'name')" />
    <my-input v-bind="makeInputBinder(form, 'email')" />

    <button type="submit">submit</button>
  </form>
</template>
```

```vue
<script setup lang="ts">
import type { Ref } from "vue";
import { computed } from "vue";

defineOptions({ name: "my-input" });

type Fields = Record<
  string,
  {
    value: Ref<any>;
    firstError: Ref<{ errorText?: string } | null>;
  }
>;

const props = defineProps<{
  fields: Fields;
  name: keyof Record<string, Ref<any>> & keyof Fields;
}>();

const model = defineModel("modelValue", { required: true });

const errorText = computed(
  () => props.fields[props.name].firstError.value?.errorText ?? ""
);
</script>

<template>
  <div class="my-input">
    <input v-model="model" />
    <span v-if="errorText" class="error">{{ errorText }}</span>
  </div>
</template>
```
