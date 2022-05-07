const Quote = ({ text, classes }) => (
  <div className={`${classes} flex items-center`}>
    <span className='text-7xl leading-none font-serif text-white drop-shadow block -mr-4 -mb-2'>&bdquo;</span>
    <span className='bg-gray-700 bg-opacity-50 text-white text-xl px-6 py-4 rounded'>{text}</span>
    <span className='text-7xl leading-none font-serif text-white drop-shadow block -ml-4 -mt-5'>&rdquo;</span>
  </div>
)

export default Quote
