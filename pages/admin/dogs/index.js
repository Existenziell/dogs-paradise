import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { CheckIcon, PencilAltIcon, XCircleIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import useApp from '../../../context/AppContext'
import Link from 'next/link'
import Nav from '../../../components/admin/Nav'
import Auth from '../../../components/Auth'

const Dogs = ({ dogs }) => {
  const { session } = useApp()
  const [fetchedDogs, setFetchedDogs] = useState()
  const [filteredDogs, setFilteredDogs] = useState()
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Check each dog if it is fully vaccinated
    for (let dog of dogs) {
      let check = true
      for (let s of dog.status_vaccine) {
        if (s.status === 'false') check = false
        dog.fullyVaccinated = check
      }
      for (let s of dog.status_deworming) {
        if (s.status === 'false') check = false
        dog.fullyDewormed = check
      }
    }
    setFetchedDogs(dogs)
    setFilteredDogs(dogs)
  }, [dogs])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (fetchedDogs) {
      if (search === '') resetSearch()
      let dogs = fetchedDogs.filter(d => (
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.user.username.toLowerCase().includes(search.toLowerCase())
      ))
      setFilteredDogs(dogs)
    }
  }, [search])
  /* eslint-enable react-hooks/exhaustive-deps */

  const resetSearch = () => {
    setFilteredDogs(fetchedDogs)
    setSearch('')
  }

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>Admin Dogs | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin Dogs | Dog&apos;s Paradise' />
      </Head>

      <div className='py-16 admin'>
        <Nav />
        <div className='pt-8 px-8 pb-16 text-left'>
          <div className='flex justify-between items-center mb-1'>
            <h1 className='admin-table-title'>Dogs</h1>
            <div className='relative'>
              <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search' name='search' className='ml-2' />
              <button onClick={resetSearch} className=' absolute top-3 right-2 hover:text-brand'>
                <XCircleIcon className='w-5' />
              </button>
            </div>
          </div>
          <table className='admin-table'>
            <thead>
              <tr className='admin-table-header'>
                <th className='ml-4 block'>Name</th>
                <th>Status</th>
                <th>Vaccinated</th>
                <th>Dewormed</th>
                <th>Owner</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>

              {!filteredDogs?.length &&
                <tr className='p-4'><td>No dogs found.</td></tr>
              }

              {filteredDogs?.map((dog) => {
                const { id, name, fullyVaccinated, fullyDewormed, status, user } = dog
                return (
                  <tr key={id + name} className={`${(fullyVaccinated && fullyDewormed) && `bg-green-50 dark:bg-brand-dark`} relative`}>
                    <td className='pl-6'>{name}</td>
                    <td>{status}</td>
                    <td>{fullyVaccinated ? <CheckIcon className='w-5 text-brand' /> : `No`}</td>
                    <td>{fullyDewormed ? <CheckIcon className='w-5 text-brand' /> : `No`}</td>
                    <td>{user?.name ? user?.name : user?.username}</td>
                    <td>
                      <Link href={`/admin/dogs/${id}`}>
                        <a>
                          <PencilAltIcon className='h-5 w-5 text-brand-dark hover:text-brand dark:hover:text-brand hover:scale-110 transition-all cursor-pointer dark:invert dark:hover:invert-0' />
                        </a>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}


export async function getServerSideProps() {
  const { data: dogs } = await supabase.from('dogs').select(`*, user(*)`).order('created_at', { ascending: false })

  return {
    props: { dogs },
  }
}

export default Dogs
