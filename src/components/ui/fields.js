import { useField } from 'formik'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

export const Input = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const showError = meta.touched && meta.error
  return (
    <AnimatePresence>
      <motion.div
        className={clsx(
          'grid relative border-b border-t border-secondaryWhite hover:border-black hover:z-10 transition-all mb-[-1px]',
          showError && ''
        )}
      >
        <label className={'sr-only'} htmlFor={props.id || props.name}>
          {label}
        </label>
        <div className="flex items-center">
          <input
            {...field}
            {...props}
            className="appearance-none px-4 pt-4 pb-3 grow placeholder-black outline-none bg-transparent focus:border-secondaryWhite"
          />
          {showError ? (
            <div className="px-4 pt-4 pb-3">{meta.error}</div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export const Checkbox = ({ placeholder, label, ...props }) => {
  const [field, meta, helpers] = useField({ ...props, type: 'checkbox' })

  // Explicit control over checkbox state
  return (
    <>
      <div className="flex items-center leading-5 border-b border-t border-secondaryWhite hover:z-10 hover:border-black mb-[-1px]  px-4 pt-4 pb-3">
        <input
          id={props.id || props.name}
          type="checkbox"
          checked={field.value} // Ensure checked is controlled by Formik's field.value
          {...field}
          {...props} // Ensure this doesn't override necessary props
          className="sr-only"
          onChange={() => helpers.setValue(!field.value)} // Toggle the value on change
        />
        <label
          htmlFor={props.id || props.name}
          className="flex items-start cursor-pointer gap-4 grow"
        >
          <div
            className={clsx(
              'w-4 h-4 shrink-0 flex items-center justify-center border-black border-solid border-[.1em]',
              field.value ? 'bg-black' : 'bg-transparent'
            )}
            aria-hidden="true"
          >
            {field.value && (
              <svg
                className="fill-current text-white w-4 h-4"
                viewBox="0 0 21 18"
              >
                <path d="M16.7,5.3l-8.8,8.8l-4.4-4.4l1.4-1.4l3,3l7.4-7.4L16.7,5.3z" />
              </svg>
            )}
          </div>
          <div className={clsx('text-sm leading-4')}>
            {label}
            <br />
            <span className="opacity-40">{placeholder}</span>
            {meta.touched && meta.error ? <div>{meta.error}</div> : null}
          </div>
        </label>
      </div>
    </>
  )
}

export const Select = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </div>
  )
}

export const Textarea = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <textarea {...field} {...props}></textarea>
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </div>
  )
}
