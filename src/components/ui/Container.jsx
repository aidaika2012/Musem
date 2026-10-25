import { forwardRef } from 'react'

const Container = forwardRef(function Container({ as: Element = 'div', className = '', children, ...props }, ref) {
  return (
    <Element ref={ref} className={`mx-auto w-full max-w-[1400px] px-6 md:px-12 ${className}`.trim()} {...props}>
      {children}
    </Element>
  )
})

export default Container
