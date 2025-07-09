import { Ref } from "vue";
import { AnyFormValues, FieldShape, Form, FormLike, StringKey } from "./types";
import { useUnit, useVModel } from "effector-vue/composition";

export function useForm<
  F extends AnyFormValues,
  S extends readonly StringKey<F>[] | undefined = undefined
>(form: Form<F>, signals?: S) {
  type FieldKeys = S extends readonly any[] ? S[number] : StringKey<F>;

  const keys = (
    signals?.length ? signals : (Object.keys(form.fields) as StringKey<F>[])
  ) as readonly FieldKeys[];

  const models = {} as Record<FieldKeys, Ref<F[FieldKeys]>>;
  const fields = {} as Record<FieldKeys, ReturnType<typeof useUnit>>;

  keys.forEach((key) => {
    fields[key] = useUnit(form.fields[key]);
    models[key] = useVModel(form.fields[key].$value);
  });

  const submit = useUnit(form.submit);

  return {
    models: models as { [K in FieldKeys]: Ref<F[K]> },
    fields: fields as { [K in FieldKeys]: ReturnType<typeof useUnit> },
    submit,
  };
}

export function makeInputBinder<
  F extends AnyFormValues,
  K extends keyof F & string
>(form: FormLike<F>, name: K) {
  const modelRef = form.models[name];

  return {
    modelValue: modelRef.value as F[K],
    "onUpdate:modelValue": (v: F[K]) => {
      modelRef.value = v;
    },
    name,
    fields: form.fields,
  } as {
    modelValue: F[K];
    "onUpdate:modelValue": (v: F[K]) => void;
    name: K;
    fields: { [P in keyof F]: FieldShape<F[P]> };
  };
}
