import { XCircleIcon } from "@heroicons/react/outline"

export default function Search({ search, setSearch, resetSearch }) {
  return (
    <div className='relative'>
      <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search' name='search' className='ml-2 dark:border-brand-dark focus:ring-1 focus:ring-brand' />
      <button onClick={resetSearch} className='absolute top-3 right-2 hover:text-brand'>
        <XCircleIcon className='w-5' />
      </button>
    </div>
  )
}
