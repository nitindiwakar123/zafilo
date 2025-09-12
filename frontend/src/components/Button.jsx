import React from 'react'

function Button({
    onClickHandler,
    className="",
    children,
    ...props
}) {
  return (
    <button className={`py-2 px-4 text-sm cursor-pointer ${className}`} onClick={onClickHandler} {...props}>{children}</button>
  )
}

export default Button