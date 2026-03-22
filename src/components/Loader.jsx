
 function Loader({ size = "small", text = "", customClasses = "" }) {
    const sizes = {
      small: "w-4 h-4",
      medium: "w-6 h-6",
      large: "w-8 h-8",
    };

    return (
      <span className={`flex items-center justify-center ${customClasses}`}>
        <span
          className={`${sizes[size]} animate-spin rounded-full border-2 border-slate-600 border-t-white`}
        />
        {text && <span className="ml-2">{text}...</span>}
      </span>
    );
  }
  export default Loader;