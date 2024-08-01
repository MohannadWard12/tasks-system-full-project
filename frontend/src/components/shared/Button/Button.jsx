/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */


const Button = ({ type = "button", text, onClick, bgColor = "bg-primary", textColor = "text-white", fullWidth = false, styles = {} }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-md ${bgColor} px-3 py-2 text-sm font-semibold textColor ${textColor} shadow-sm duration-300 mt-2 ${fullWidth && "w-full"}`}
      style={styles}
    >
      {text}
    </button>
  )
}

export default Button
