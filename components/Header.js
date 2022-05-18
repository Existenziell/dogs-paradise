const Header = ({ content }) => {

  return (
    <header className='fixed w-full z-10 mb-12 py-3 bg-slate-100 dark:bg-slate-600 shadow'>
      <span className='text-3xl text-slate-600 dark:text-slate-300'>
        {content}
      </span>
    </header>
  )
}

export default Header
