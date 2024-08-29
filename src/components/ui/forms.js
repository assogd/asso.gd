'use client'
import { useFormikContext, Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Input, Select, Textarea, Checkbox } from './fields'
import { motion, AnimatePresence } from 'framer-motion'

const FieldWithChildren = ({ field }) => {
  const { values } = useFormikContext()
  const hasChildren = field.children && field.children.length > 0

  return (
    <>
      {field.type === 'select' ? (
        <Select
          key={field.id}
          label={field.label}
          name={field.fieldId}
          options={field.options}
        />
      ) : field.type === 'textarea' ? (
        <Textarea
          key={field.id}
          label={field.label}
          name={field.fieldId}
          placeholder={field.placeholder}
        />
      ) : field.type === 'checkbox' ? (
        <>
          <Checkbox
            key={field.id}
            label={field.label}
            id={field.fieldId}
            name={field.fieldId}
            placeholder={field.placeholder}
          />
          {values[field.fieldId] &&
            hasChildren &&
            field.children.map((childField) => (
              <FieldWithChildren key={childField.id} field={childField} />
            ))}
        </>
      ) : (
        <Input
          key={field.id}
          label={field.label}
          id={field.fieldId}
          name={field.fieldId}
          type={field.type}
          placeholder={field.placeholder}
        />
      )}
    </>
  )
}

const generateInitialValues = (fields) => {
  return fields.reduce((acc, field) => {
    // Set initial value based on field type
    acc[field.fieldId] = field.type === 'checkbox' ? false : ''

    // If the field has children, recurse into them
    if (field.children && field.children.length > 0) {
      Object.assign(acc, generateInitialValues(field.children))
    }

    return acc
  }, {})
}

export const DynamicForm = ({
  fields: formData,
  openForApplicants,
  pageId,
  slug,
  title
}) => {
  const initialValues = generateInitialValues(formData)

  const validationSchema = Yup.object().shape(
    formData.reduce((acc, field) => {
      if (field.required) {
        let schema = Yup.string().required('Required')
        if (field.type === 'email') {
          schema = schema.email('Invalid')
        } else if (field.type === 'checkbox') {
          schema = Yup.boolean().oneOf([true], 'Must be checked')
        }
        acc[field.fieldId] = schema
      }
      return acc
    }, {})
  )

  const handleSubmit = async (
    values,
    { setSubmitting, setStatus, setErrors }
  ) => {
    const submissionData = {
      ...values,
      pageId,
      slug
    }
    try {
      const response = await fetch('/api/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      })

      const data = await response.json()
      console.log(response)
      if (response.ok) {
        setStatus({
          success: values.extraGuest
            ? 'You and your extra guest are now on the list.'
            : 'You are now on the list.'
        })
      } else {
        setErrors({
          submit:
            data.error ||
            'There was an error with your signup. Please try again or send us an email at kontoret@restaurangforma.se.'
        })
        setStatus({ success: false })
      }
    } catch (error) {
      console.error('Network error:', error)
      setErrors({ submit: 'Network error' })
      setStatus({ success: false })
    }
    setSubmitting(false)
  }

  return (
    <section className="form max-w-md mx-auto relative">
      <h2 className="text-center font-serif text-3xl mb-4 mt-4">RSVP</h2>
      {openForApplicants ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status, errors, touched }) => (
            <Form className="grid">
              {formData.map((field) => (
                <FieldWithChildren key={field.id} field={field} />
              ))}
              <button
                type="submit"
                disabled={isSubmitting}
                className="p-4 mt-8 transition-all bg-black border border-black text-white disabled:bg-transparent disabled:text-black disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending RSVP...' : 'RSVP Now'}
              </button>
              <AnimatePresence>
                {status && status.success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 bg-white text-center"
                  >
                    <div className="sticky top-16 inset-x-0">
                      <h2>Thank you!</h2>
                      <p>{status.success}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.submit && (
                <div className="text-red-500">{errors.submit}</div>
              )}
            </Form>
          )}
        </Formik>
      ) : (
        <p className="text-center leading-5">
          The registration form for <i>{title}</i> is closed. We appreciate your
          interest and look forward to welcoming you at our next event.
        </p>
      )}
    </section>
  )
}
