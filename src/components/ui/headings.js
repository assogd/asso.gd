import clsx from 'clsx'

export const Heading1 = ({ children, className }) => {
  return <h1 className={clsx('text-center text-2xl', className)}>{children}</h1>
}

export const Heading2 = ({ children }) => {
  return <h2 className="uppercase mb-4">{children}</h2>
}

export const Heading3 = ({ children }) => {
  return (
    <h3 className="mb-1">
      {children.props.content[0].text.split('').map((char, index) => (
        <span
          key={index}
          className={clsx(index % 2 === 0 ? 'text-black' : 'text-red')}
        >
          {char}
        </span>
      ))}
    </h3>
  )
}
