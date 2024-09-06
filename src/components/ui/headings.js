import clsx from 'clsx'

export const Heading1 = ({ children, className }) => {
  return <h1 className={clsx('text-center text-2xl', className)}>{children}</h1>
}

export const Heading2 = ({ children }) => {
  return <h2 className="uppercase mb-4">{children}</h2>
}
