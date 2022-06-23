import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { XCircleIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import useApp from '../../../context/AppContext'
import Select from 'react-select'
import selectStyles from '../../../lib/selectStyles'
import Link from 'next/link'
import Nav from '../../../components/admin/Nav'
import Auth from '../../../components/Auth'
import { XIcon, PlusIcon } from '@heroicons/react/solid'

const Dogs = ({ dogs, users }) => {
  const { notify, session, darkmode } = useApp()
  const [fetchedDogs, setFetchedDogs] = useState()
  const [filteredDogs, setFilteredDogs] = useState()
  const [formData, setFormData] = useState()
  const [search, setSearch] = useState('')
  const [styles, setStyles] = useState()
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    // Check each dog if it is fully vaccinated
    for (let dog of dogs) {
      let check = true
      for (let s of dog.status_vaccine) {
        if (s.status === 'false') check = false
        dog.fullyVaccinated = check
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

  useEffect(() => {
    let tempStyles = selectStyles(darkmode)
    setStyles(tempStyles)
  }, [darkmode])

  const resetSearch = () => {
    setFilteredDogs(fetchedDogs)
    setSearch('')
  }

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  function setSelectData(e) {
    setFormData({ ...formData, ...{ user: e.value } })
  }

  const addDog = async (e) => {
    e.preventDefault()
    let query

    formData.user ?
      query = { name: formData.name, status: formData.status, user: formData.user }
      :
      query = { name: formData.name, status: formData.status, }

    const { data, error } = await supabase
      .from('dogs')
      .insert([query])

    if (!error) {
      notify("Dog added successfully!")
      setShowAdd(false)
      setFormData({})
      const newEntry = data[0]
      setFetchedDogs([...fetchedDogs, newEntry])
    }
  }

  let ownerOptions = []
  users.forEach(u => {
    ownerOptions.push({ value: u.id, label: u.name ? u.name : u.username })
  })

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
              <span>Search:</span>
              <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} name='search' className='ml-2' />
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
                <th>Owner</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>

              {!filteredDogs?.length &&
                <tr className='p-4'><td>No dogs found.</td></tr>
              }

              {filteredDogs?.map((dog) => (
                <tr key={dog.id + dog.name} className='relative'>
                  <td className='pl-6'>{dog.name}</td>
                  <td>{dog.status}</td>
                  <td>{dog.fullyVaccinated ? `Yes` : `No`}</td>
                  <td>{dog.user?.name ? dog.user?.name : dog.user?.username}</td>
                  <td>
                    <Link href={`/admin/dogs/${dog.id}`}>
                      <a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-slate-500 hover:scale-110 transition-all cursor-pointer pointer-events-none dark:invert" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add dog */}
          <button onClick={() => setShowAdd(!showAdd)} className='my-4 flex items-center justify-center' aria-label='Open Add Dog Form'>
            {showAdd ?
              <><XIcon className='w-4' />Close</>
              :
              <><PlusIcon className='w-4' />Add Dog</>
            }
          </button>

          {showAdd &&
            <form onSubmit={addDog} className='shadow max-w-max p-4' id='addDogForm' >
              Name <input type='text' name='name' id='name' placeholder='Lucy' onChange={setData} required className='block mb-2' />
              Status <input type='text' name='status' id='status' placeholder='Needs Deworming' onChange={setData} className='block mb-2' />
              Owner <Select options={ownerOptions} onChange={setSelectData} styles={styles} instanceId />

              <input type='submit' className='button-secondary cursor-pointer block mt-6' value='Save' />
            </form>
          }
        </div>
      </div>
    </>
  )
}


export async function getServerSideProps() {
  const { data: users } = await supabase.from('users').select(`*, roles(*)`).order('id', { ascending: true })
  const { data: dogs } = await supabase.from('dogs').select(`*, user(*)`).order('id', { ascending: true })

  // Gather dogs for each user
  for (const user of users) {
    const { data: userDogs } = await supabase.from('dogs').select(`*`).eq('user', user.id)
    user.dogs = userDogs
  }

  return {
    props: { users, dogs },
  }
}

export default Dogs
