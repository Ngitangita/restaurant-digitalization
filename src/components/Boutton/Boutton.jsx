
export default function Boutton(props) {
    const {children, ...rest} = props
  return (
    <button {...rest} >
      {children}
    </button>
  )
}
