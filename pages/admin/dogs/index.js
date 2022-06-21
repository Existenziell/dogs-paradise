import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Head from 'next/head'
import useApp from '../../../context/AppContext'
import Select from 'react-select'
import Link from 'next/link'
import Nav from '../../../components/admin/Nav'

const Dogs = ({ dogs, users }) => {
  const { notify } = useApp()

  const [fetchedDogs, setFetchedDogs] = useState()
  const [formData, setFormData] = useState()

  useEffect(() => {
    setFetchedDogs(dogs)
  }, [dogs])

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  function setSelectData(e) {
    setFormData({ ...formData, ...{ user: e.value } })
  }

  const openAdd = () => {
    const panel = document.getElementById('addDogForm')
    panel.classList.toggle('hidden')
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
      const panel = document.getElementById('addDogForm')
      panel.classList.toggle('hidden')
      setFormData({})
      const newEntry = data[0]
      setFetchedDogs([...fetchedDogs, newEntry])
    }
  }

  let ownerOptions = []
  users.forEach(u => {
    ownerOptions.push({ value: u.id, label: u.name ? u.name : u.username })
  })

  return (
    <>
      <Head>
        <title>Admin Dogs | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin Dogs | Dog&apos;s Paradise' />
      </Head>

      <div className='py-16 admin'>
        <Nav />
        <div className='py-8 px-8 text-left'>
          <h1 className='admin-table-title'>Dogs</h1>

          <table className='admin-table'>
            <thead>
              <tr className='admin-table-header'>
                <th className='ml-4 block'>Name</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>

              {!fetchedDogs?.length &&
                <tr className='p-4'><td>No dogs found.</td></tr>
              }

              {fetchedDogs?.map((dog, idx) => (
                <tr key={dog.id + dog.name} className={`relative anchor ${idx % 2 !== 0 && `bg-slate-100`}`}>
                  <td className='pl-6'>{dog.name}</td>
                  <td>{dog.status}</td>
                  <td>{dog.user?.name ? dog.user?.name : dog.user?.username}</td>
                  <td>
                    <Link href={`/admin/dogs/${dog.id}`}>
                      <a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-slate-500 hover:scale-110 transition-all cursor-pointer pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
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
          <button onClick={openAdd} className='my-4 link flex items-center' aria-label='Open Add Dog Form'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add dog
          </button>

          <form onSubmit={addDog} className='shadow max-w-max bg-slate-300 p-4 hidden' id='addDogForm' >
            Name <input type='text' name='name' id='name' placeholder='Lucy' onChange={setData} required className='block mb-2' />
            Status <input type='text' name='status' id='status' placeholder='Needs Deworming' onChange={setData} className='block mb-2' />
            Owner <Select options={ownerOptions} onChange={setSelectData} instanceId />

            <input type='submit' className='link cursor-pointer block mt-6' value='Save' />
          </form>
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
