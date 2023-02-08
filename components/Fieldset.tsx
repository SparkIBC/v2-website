import type { ReactNode } from 'react'
import { classNames } from 'util/css'

export type FieldsetBaseType = {
  /**
   * The input's required id, used to link the label and input, as well as the error message.
   */
  id: string
  /**
   * Error message to show input validation.
   */
  error?: string
  /**
   * Label to describe the input.
   */
  label?: string | ReactNode
  /**
   * Label style.
   */
  labelStyle?: any
}

type FieldsetType = FieldsetBaseType & {
  children: ReactNode
}

/**
 * @name Fieldset
 * @description A fieldset component, used to share markup for labels, hints, and errors for Input components.
 *
 * @example
 * <Fieldset error={error} id={id} label={label}>
 *   <input id={id} {...props} />
 * </Fieldset>
 */
export default function Fieldset({
  label,
  labelStyle,
  id,
  children,
  error,
}: FieldsetType) {
  return (
    <div>
      {!!label && (
        <div className="flex justify-between mb-1 font-inter">
          <label
            htmlFor={id}
            style={labelStyle}
            className="block text-sm font-medium"
          >
            {label}
          </label>
        </div>
      )}

      {children}

      {error && (
        <div className="mt-2">
          <p
            className="text-sm text-red-600 dark:text-red-500"
            id={`${id}-error`}
          >
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
