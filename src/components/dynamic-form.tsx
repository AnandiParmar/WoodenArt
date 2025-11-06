'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { DynamicFormProps, FieldErrors, FormField } from './form-types';

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function DynamicForm<TValues extends Record<string, unknown>>({
  fields,
  initialValues,
  onSubmit,
  onCancel,
  onChange,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  columns = 2,
  className = '',
}: DynamicFormProps<TValues>) {
  const [values, setValues] = useState<Partial<TValues>>(() => {
    const defaults: Partial<TValues> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        defaults[f.name as keyof TValues] = f.defaultValue as TValues[keyof TValues];
      }
    });
    return { ...defaults, ...(initialValues || {}) };
  });
  const [errors, setErrors] = useState<FieldErrors<TValues>>({});
  const [submitting, setSubmitting] = useState(false);

  const gridCols = useMemo(() => {
    const map: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-4',
    };
    return map[columns] || map[2];
  }, [columns]);

  const setFieldValue = useCallback(
    (name: keyof TValues & string, value: unknown) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value };
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  const validateAll = useCallback(() => {
    const nextErrors: FieldErrors<TValues> = {};
    fields.forEach((field) => {
      const value = values[field.name as keyof TValues];
      if (field.required && (value === undefined || value === '' || value === null)) {
        nextErrors[field.name] = `${field.label} is required`;
        return;
      }
      if (field.validate) {
        const msg = field.validate(value, values);
        if (msg) nextErrors[field.name] = msg;
      }
      if (field.type === 'number' && value !== undefined && value !== null && value !== '') {
        const num = Number(value);
        if (Number.isNaN(num)) {
          nextErrors[field.name] = `${field.label} must be a number`;
        }
      }
    });
    setErrors(nextErrors);
    return nextErrors;
  }, [fields, values]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAll();
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(values as TValues);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField<TValues>) => {
    const error = errors[field.name];
    const common = {
      id: field.name,
      name: field.name,
      className: classNames(
        'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-900 placeholder-gray-500',
        error && 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50'
      ),
      disabled: field.disabled,
      readOnly: field.readOnly,
      placeholder: field.placeholder,
      'aria-invalid': Boolean(error) || undefined,
      'aria-describedby': error ? `${field.name}-error` : undefined,
    } as const;

    const value = values[field.name as keyof TValues] as unknown;
    const colSpanClass = field.colSpan ? `md:col-span-${field.colSpan}` : '';

    return (
      <div key={field.name} className={classNames('space-y-1', colSpanClass, field.className)}>
        <label htmlFor={field.name} className="block text-sm font-semibold text-gray-800 mb-2">
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </label>
        {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
        {field.type === 'textarea' ? (
          <textarea
            {...common}
            rows={4}
            value={(value as string) ?? ''}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
          />
        ) : field.type === 'select' ? (
          <select
            {...common}
            value={String(value ?? '')}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
          >
            <option value="">Select {field.label}</option>
            {'options' in field &&
              field.options?.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <div className="flex items-center gap-2 py-2">
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              checked={Boolean(value)}
              onChange={(e) => setFieldValue(field.name, e.target.checked)}
            />
            <span className="text-sm text-gray-700">{field.label}</span>
          </div>
        ) : field.type === 'radio' ? (
          <div className="flex flex-wrap gap-3 py-1">
            {'options' in field &&
              field.options?.map((opt) => (
                <label key={String(opt.value)} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200">
                  <input
                    type="radio"
                    name={field.name}
                    value={String(opt.value)}
                    checked={String(value) === String(opt.value)}
                    onChange={(e) => setFieldValue(field.name, e.target.value)}
                    className="h-5 w-5 border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                </label>
              ))}
          </div>
        ) : field.type === 'file' ? (
          <div className="space-y-4">
            {field.multiple ? (
              <>
                {/* Existing gallery images display */}
                {field.existingImages && Array.isArray(field.existingImages) && field.existingImages.length > 0 ? (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-semibold text-gray-800">Current Gallery Images</p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {field.existingImages.length} image{field.existingImages.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {field.existingImages.map((imgUrl: string, idx: number) => (
                        <div key={`existing-${idx}`} className="relative aspect-square">
                          <div className="w-full h-full rounded-lg border-2 border-gray-300 shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200 overflow-hidden bg-white">
                            <img
                              src={imgUrl}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover"
                              style={{
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                console.error('Image failed to load:', imgUrl);
                                e.currentTarget.src = '/window.svg';
                              }}
                              onLoad={(e) => {
                                console.log('Gallery image loaded successfully:', imgUrl);
                              }}
                            />
                            <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                              {idx + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm font-semibold text-yellow-800">No Gallery Images</p>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">This product doesnt have any gallery images yet.</p>
                  </div>
                )}
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                  <label htmlFor={`${field.name}-file`} className="cursor-pointer block">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Add More Images</p>
                        <p className="text-xs text-gray-500">Click to select additional images</p>
                      </div>
                    </div>
                  </label>
                  <input
                    id={`${field.name}-file`}
                    name={field.name}
                    type="file"
                    accept={field.accept}
                    multiple
                    className="hidden"
                    onChange={(e) => setFieldValue(field.name, field.multiple ? Array.from(e.target.files || []) : e.target.files?.[0])}
                  />
                </div>
                
                {Array.isArray(value) && value.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm font-semibold text-green-800">New Images Selected</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {value.length} file{value.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {value.map((f: File, idx: number) => (
                        <div key={`${field.name}-f-${idx}`} className="flex items-center gap-2 text-sm text-green-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="truncate">{f.name}</span>
                          <span className="text-xs text-green-600">({Math.round(f.size / 1024)}KB)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {/* Existing feature image display */}
                {field.previewUrl && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-semibold text-gray-800">Current Feature Image</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={field.previewUrl as string}
                          alt="Current feature image"
                          className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          onError={(e) => {
                            console.error('Existing feature image failed to load:', field.previewUrl, e);
                          }}
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Current image is set</p>
                        <p className="text-xs">Click below to replace with a new image</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                  <label htmlFor={`${field.name}-file`} className="cursor-pointer block">
                    <div className="flex flex-col items-center space-y-3">
                      {value && value instanceof File && value.type.startsWith('image/') ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(value)}
                            alt="New image preview"
                            className="w-24 h-24 object-cover rounded-xl border-2 border-blue-300 shadow-lg"
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {value && value instanceof File ? 'New Image Selected' : 'Select Feature Image'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {value && value instanceof File ? String((value as File).name) : 'Click to choose an image file'}
                        </p>
                      </div>
                    </div>
                  </label>
                  <input
                    id={`${field.name}-file`}
                    name={field.name}
                    type="file"
                    accept={field.accept}
                    className="hidden"
                    onChange={(e) => setFieldValue(field.name, field.multiple ? Array.from(e.target.files || []) : e.target.files?.[0])}
                  />
                </div>
              </div>
            )}
          </div>
        ) : field.type === 'number' ? (
          <input
            {...common}
            type="number"
            value={(value as number | string | undefined) ?? ''}
            onChange={(e) => {
              const raw = e.target.value;
              const num = raw === '' ? '' : Number(raw);
              setFieldValue(field.name, num as unknown);
            }}
          />
        ) : (
          <input
            {...common}
            type={field.type === 'datetime' ? 'datetime-local' : field.type === 'date' ? 'date' : field.type || 'text'}
            value={String(value ?? '')}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            style={{ color: '#111827' }}
          />
        )}
        {error && (
          <div className="flex items-center gap-1 mt-2">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p id={`${field.name}-error`} className="text-sm text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={classNames('space-y-8', className)}>
      <div className={classNames('grid gap-6', gridCols)}>
        {fields.map((f) => renderField(f))}
      </div>
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{submitLabel}</span>
            </div>
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{cancelLabel}</span>
            </div>
          </button>
        )}
      </div>
    </form>
  );
}

export default DynamicForm;


