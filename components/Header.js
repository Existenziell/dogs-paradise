const Header = ({ content }) => {

  return (
    <header className='fixed w-full z-10 mb-12 py-3 bg-white dark:bg-brand-dark shadow'>
      <span className='text-2xl md:text-3xl text-brand'>
        {content}
      </span>
    </header>
  )
}

export default Header
