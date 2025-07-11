import { EventCallable, StoreWritable, Domain, Store } from "effector";
import { Ref } from "vue";

type InitFieldValue<Value> = () => Value;

/**
 * Trigger that will be used to validate the form or field
 */
export type ValidationEvent = "submit" | "blur" | "change";

/**
 * See {@link Rule}
 */
export type ValidationResult = {
  isValid: boolean;
  errorText?: string;
};

/**
 * A function that takes a field value, a form value
 * and an external store.
 * Returns boolean or {@link ValidationResult | ValidationResult}
 */
export type Validator<Value, Form = any, Source = any> = (
  value: Value,
  form?: Form,
  source?: Source
) => boolean | ValidationResult;

export type ValidationError<Value = any> = {
  rule: string;
  value: Value;
  errorText?: string;
};

/**
 * Validation rule that is passed to the
 * {@link FieldConfig | field} configuration
 */
export type Rule<Value, Form = any, Source = any> = {
  /**
   * The name of the validation rule. Used to
   * determine which rule exactly threw an error.
   * For example required, email, etc.
   */
  name: string;
  /**
   * Optional field with the error text.
   * This text will also be passed to the
   * error {@link ValidationError object}
   */
  errorText?: string;
  /**
   * Optional field to which you can pass an external store
   * if it is needed to validate the field. This store is passed to
   * validator in the third argument
   */
  source?: Store<Source>;
  /**
   * A function that takes a field value, a form value
   * and an external store.
   * Returns boolean or {@link ValidationResult | ValidationResult}
   */
  validator: Validator<Value, Form, Source>;
};

export type FieldData<Value> = {
  value: Value;
  errors: ValidationError<Value>[];
  firstError: ValidationError<Value> | null;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
};

export type FieldUnitShape<Value> = {
  value: StoreWritable<Value>;
  initValue: StoreWritable<Value>;
  isValid: Store<boolean>;
  isDirty: Store<boolean>;
  touched: StoreWritable<boolean>;
  errors: StoreWritable<ValidationError<Value>[]>;
  firstError: Store<ValidationError<Value> | null>;
  errorText: Store<string>;
  onChange: EventCallable<Value>;
  onBlur: EventCallable<void>;
  addError: EventCallable<{ rule: string; errorText?: string }>;
  validate: EventCallable<void>;
  reset: EventCallable<void>;
  resetErrors: EventCallable<void>;
  resetValue: EventCallable<void>;
};

export type Field<Value> = {
  name: string;
  $initValue: StoreWritable<Value>;
  $value: StoreWritable<Value>;
  $errors: StoreWritable<ValidationError<Value>[]>;
  $firstError: Store<ValidationError<Value> | null>;
  $errorText: Store<string>;
  $isValid: Store<boolean>;
  $isDirty: Store<boolean>;
  $isTouched: StoreWritable<boolean>;
  $touched: StoreWritable<boolean>;
  $field: Store<FieldData<Value>>;
  onChange: EventCallable<Value>;
  changed: EventCallable<Value>;
  onBlur: EventCallable<void>;
  addError: EventCallable<{ rule: string; errorText?: string }>;
  validate: EventCallable<void>;
  reset: EventCallable<void>;
  set: EventCallable<Value>;
  resetErrors: EventCallable<void>;
  resetValue: EventCallable<void>;
  filter?: StoreWritable<boolean> | Store<boolean> | FilterFunc<Value>;
  "@@unitShape": () => FieldUnitShape<Value>;
};

type FilterFunc<Value> = (value: Value) => boolean;

export type RuleResolver<Value = any, Form = any> = (
  value: Value,
  form: Form
) => Rule<Value, Form, void>[];

/**
 * External units KV. By default,
 * each field unit is created when the {@link createForm | factory} is
 * called. If you pass a unit here, it will be used
 * instead of creating a new unit
 */
export type ExternalFieldUnits<Value> = {
  $value?: StoreWritable<Value>;
  $errors?: StoreWritable<ValidationError<Value>[]>;
  $isTouched?: StoreWritable<boolean>;
  $initValue?: StoreWritable<Value>;
  onChange?: EventCallable<Value>;
  changed?: EventCallable<Value>;
  onBlur?: EventCallable<void>;
  addError?: EventCallable<{ rule: string; errorText?: string }>;
  validate?: EventCallable<void>;
  resetValue?: EventCallable<void>;
  reset?: EventCallable<void>;
  resetErrors?: EventCallable<void>;
};

/**
 * field configuration object
 *
 */
export type FieldConfig<Value> = {
  /**
   * initial value. The type of this value is used to
   * infer the type of the field. You can pass a function
   * that returns an initial value. This function will be called
   * once when the form is created
   */
  init: Value | InitFieldValue<Value>;
  /**
   * An array of validation rules.
   * You can also pass a function instead of
   * an array and define validation rules dynamically.
   * This function will be called at the moment of validation
   * and will take a field value and form value
   */
  rules?: Rule<Value>[] | RuleResolver<Value, any>;
  /**
   * A store or function that filters a field change
   * when the onChange event is called.
   * The value of the field changes only
   * if the function returns true
   */
  filter?: StoreWritable<boolean> | Store<boolean> | FilterFunc<Value>;
  /**
   * Array of field-specific validation triggers
   */
  validateOn?: ValidationEvent[];
  /**
   * External units KV.
   */
  units?: ExternalFieldUnits<Value>;
};

export type AnyFields = {
  [key: string]: Field<any>;
};

export type AnyFieldsConfigs = {
  [key: string]: FieldConfig<any>;
};

/**
 * KV containing form values
 */
export type AnyFormValues = {
  [key: string]: any;
};

export type FormValues<Fields extends AnyFields> = {
  [K in keyof Fields]: Fields[K] extends Field<infer U> ? U : never;
};

export type FormFieldConfigs<Values extends AnyFormValues> = {
  [K in keyof Values]: FieldConfig<Values[K]>;
};

export type FormFields<Values extends AnyFormValues> = {
  [K in keyof Values]: Field<Values[K]>;
};

export type AddErrorPayload = {
  field: string;
  rule: string;
  errorText?: string;
};

/**
 * External units KV. By default,
 * each form unit is created when the {@link createForm | factory} is
 * called. If you pass a unit here, it will be used
 * instead of creating a new unit
 */
export type ExternalFormUnits<Values extends AnyFormValues> = {
  submit?: EventCallable<void>;
  validate?: EventCallable<void>;
  addErrors?: EventCallable<AddErrorPayload[]>;
  reset?: EventCallable<void>;
  resetValues?: EventCallable<void>;
  resetTouched?: EventCallable<void>;
  resetErrors?: EventCallable<void>;
  formValidated?: EventCallable<Values>;
  setInitialForm?: EventCallable<Partial<AnyFormValues>>;
  setForm?: EventCallable<Partial<AnyFormValues>>;
};

/**
 * The object that is passed to the {@link createForm | createForm} factory
 *
 * @example
 *
 * ```ts
 * const $passwordMinLength = createStore(3)
 *
 * form = createForm({
 *    fields: {
 *      username: {
 *         init: "",
 *         rules: [
 *            {
 *              name: "required",
 *              validator: (value) => Boolean(value),
 *            }
 *         ],
 *      },
 *      password: {
 *         init: "",
 *         validateOn: ["change"],
 *         rules: [
 *            {
 *               name: "required",
 *               validator: (value) => Boolean(value),
 *            },
 *            {
 *               name: "minLength",
 *               source: $passwordMinLength,
 *               validator: (password, form, minLength) => ({
 *                  isValid: password.length > minLength,
 *                  errorText: `The password field must be longer than ${minLength} characters`
 *               })
 *            }
 *         ]
 *      },
 *      confirm: {
 *         init: "",
 *         validateOn: ["change"],
 *         rules: [
 *            {
 *              name: "required",
 *              validator: (value) => Boolean(value),
 *            },
 *            {
 *              name: "matchPassword",
 *              validator: (confirm, { password }) => ({
 *                 isValid: confirm === password,
 *                 errorText: "Doesn't match the password"
 *              }),
 *            }
 *         ]
 *      }
 *    },
 *    validateOn: ["submit"]
 * })
 * ```
 */
export type FormConfig<Values extends AnyFormValues> = {
  /**
   * The keys of the object are the names of the fields,
   * and the values are the {@link FieldConfig | FieldConfig}
   */
  fields: FormFieldConfigs<Values>;
  /**
   * If you pass a domain into this field,
   * all units of the form will be in this domain
   */
  domain?: Domain;
  /**
   * If store is passed the `formValidated` event will be called
   * then the value of store will be true
   */
  filter?: StoreWritable<boolean> | Store<boolean>;
  /**
   * Trigger that will be used to validate the form.
   */
  validateOn?: ValidationEvent[];
  /**
   * External units KV.
   */
  units?: ExternalFormUnits<Values>;
};

export type FormUnitShape<Values extends AnyFormValues> = {
  isValid: Store<boolean>;
  isDirty: Store<boolean>;
  touched: Store<boolean>;
  submit: EventCallable<void>;
  validate: EventCallable<void>;
  reset: EventCallable<void>;
  addErrors: EventCallable<AddErrorPayload[]>;
  setForm: EventCallable<Partial<Values>>;
  setInitialForm: EventCallable<Partial<Values>>;
  resetTouched: EventCallable<void>;
  resetValues: EventCallable<void>;
  resetErrors: EventCallable<void>;
  formValidated: EventCallable<Values>;
};

export type Form<Values extends AnyFormValues> = {
  fields: FormFields<Values>;
  $values: StoreWritable<Values>;
  $eachValid: StoreWritable<boolean>;
  $isValid: StoreWritable<boolean>;
  $isDirty: StoreWritable<boolean>;
  $touched: StoreWritable<boolean>;
  $meta: StoreWritable<{
    isValid: boolean;
    isDirty: boolean;
    touched: boolean;
  }>;
  submit: EventCallable<void>;
  validate: EventCallable<void>;
  reset: EventCallable<void>;
  addErrors: EventCallable<AddErrorPayload[]>;
  set: EventCallable<Partial<Values>>;
  setForm: EventCallable<Partial<Values>>;
  setInitialForm: EventCallable<Partial<Values>>;
  resetTouched: EventCallable<void>;
  resetValues: EventCallable<void>;
  resetErrors: EventCallable<void>;
  formValidated: EventCallable<Values>;
  "@@unitShape": () => FormUnitShape<Values>;
};

export type FieldShape<V> = {
  value: Ref<V>;
  firstError: Ref<{ errorText?: string } | null>;
};

export type FormLike<F extends AnyFormValues> = {
  models: { [K in keyof F]: { value: F[K] } };
  fields: { [K in keyof F]: FieldShape<F[K]> };
};

export type StringKey<T> = Extract<keyof T, string>;
