import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { CheckIcon, PencilAltIcon } from '@heroicons/react/outline'
import { getPublicUrl } from '../../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import useApp from '../../../context/AppContext'
import Link from 'next/link'
import Nav from '../../../components/admin/Nav'
import Auth from '../../../components/Auth'
import Search from '../../../components/admin/Search'

const Dogs = ({ dogs }) => {
  const { session } = useApp()
  const [fetchedDogs, setFetchedDogs] = useState()
  const [filteredDogs, setFilteredDogs] = useState()
  const [search, setSearch] = useState('')

  const enrichDogs = async () => {
    // Check each dog if it is fully vaccinated and dewormed
    for (let dog of dogs) {
      let url
      if (dog.avatar_url) url = await getPublicUrl('dogs', dog.avatar_url)
      dog.public_url = url

      let checkVaccine = true
      for (let s of dog.status_vaccine) {
        if (!s.status) checkVaccine = false
      }
      dog.fullyVaccinated = checkVaccine

      let checkDeworming = true
      for (let s of dog.status_deworming) {
        if (!s.status) checkDeworming = false
      }
      dog.fullyDewormed = checkDeworming
    }
    setFetchedDogs(dogs)
    setFilteredDogs(dogs)
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    enrichDogs()
  }, [dogs])

  useEffect(() => {
    if (fetchedDogs) {
      let dogs = fetchedDogs.filter(d => (
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.status?.toLowerCase().includes(search.toLowerCase()) ||
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
        <title>Admin | Dogs | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin Dogs | Dog&apos;s Paradise' />
      </Head>

      <div className='py-16 admin'>
        <Nav />
        <div className='pt-8 px-8 pb-16 text-left'>
          <div className='flex justify-between items-center mb-1'>
            <h1 className='admin-table-title'>Dogs</h1>
            <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />
          </div>
          <table className='admin-table'>
            <thead>
              <tr className='admin-table-header'>
                <th>Picture</th>
                <th className='ml-4 block'>Name</th>
                <th>Owner</th>
                <th>Vaccinated</th>
                <th>Dewormed</th>
                <th>Neutered</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>

              {!filteredDogs?.length &&
                <tr className='p-4'><td>No dogs found.</td></tr>
              }

              {filteredDogs?.map((dog) => {
                const { id, name, fullyVaccinated, fullyDewormed, status_neuter, user, public_url } = dog
                return (
                  <tr key={id + name} className={`${(fullyVaccinated && fullyDewormed) && `bg-brand/20 dark:bg-brand-dark`} relative`}>
                    <td><img src={public_url} alt={name} className='max-h-[50px]' /></td>
                    <td>{name}</td>
                    <td>{user?.name ? user?.name : user?.username}</td>
                    <td>{fullyVaccinated ? <CheckIcon className='w-5 text-brand' /> : `No`}</td>
                    <td>{fullyDewormed ? <CheckIcon className='w-5 text-brand' /> : `No`}</td>
                    <td>{status_neuter ? <CheckIcon className='w-5 text-brand' /> : `No`}</td>
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
