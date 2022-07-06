const Blob = ({ node, classes }) => {
  return (
    <div className={`${classes} relative`}>
      <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
      <div className='absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
      <div className='absolute -bottom-8 left-20 w-72 h-72 bg-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
      {node}
    </div>
  )
}

export default Blob
