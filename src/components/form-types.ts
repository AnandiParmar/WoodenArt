'use client';

import React from 'react';

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'email'
  | 'password'
  | 'url'
  | 'tel'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file';

export interface FormOption {
  label: string;
  value: string | number | boolean;
}

export interface BaseField<TValues extends Record<string, unknown>> {
  name: keyof TValues & string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: unknown;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  className?: string;
  validate?: (value: unknown, values: Partial<TValues>) => string | null | undefined;
  // For file fields: optional preview URL (existing image in edit mode)
  previewUrl?: string;
}

export interface TextField<TValues extends Record<string, unknown>> extends BaseField<TValues> {
  type: 'text' | 'textarea' | 'email' | 'password' | 'url' | 'tel';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface NumberField<TValues extends Record<string, unknown>> extends BaseField<TValues> {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface SelectField<TValues extends Record<string, unknown>> extends BaseField<TValues> {
  type: 'select' | 'radio';
  options: FormOption[];
}

export interface BooleanField<TValues extends Record<string, unknown>> extends BaseField<TValues> {
  type: 'checkbox' | 'switch';
}

export interface DateTimeField<TValues extends Record<string, unknown>> extends BaseField<TValues> {
  type: 'date' | 'time' | 'datetime';
}

export interface FileField<TValues extends Record<string, unknown>> extends BaseField<TValues> {
  type: 'file';
  accept?: string;
  multiple?: boolean;
  existingImages?: string[]; // For gallery images in edit mode
}

export type FormField<TValues extends Record<string, unknown>> =
  | TextField<TValues>
  | NumberField<TValues>
  | SelectField<TValues>
  | BooleanField<TValues>
  | DateTimeField<TValues>
  | FileField<TValues>;

export interface DynamicFormProps<TValues extends Record<string, unknown>> {
  fields: FormField<TValues>[];
  initialValues?: Partial<TValues>;
  onSubmit: (values: TValues) => void | Promise<void>;
  onCancel?: () => void;
  onChange?: (values: Partial<TValues>) => void;
  submitLabel?: string;
  cancelLabel?: string;
  columns?: 1 | 2 | 3 | 4; // grid columns
  className?: string;
}

export type FieldErrors<TValues extends Record<string, unknown>> = Partial<Record<keyof TValues & string, string>>;


