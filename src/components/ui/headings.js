import { applyRandomFonts } from '@/lib/text'

export const Heading1 = ({ children }) => {
  const title = children?.props
    ? children.props.content.map((item) => item.text).join(' ')
    : children

  return <h1 className="text-center text-2xl">{applyRandomFonts(title, 4)}</h1>
}

export const Heading2 = ({ children }) => {
  return (
    <h2 className="font-expandedSans uppercase !text-[0.5em] tracking-wider mb-[.1em]">
      {children}
    </h2>
  )
}
