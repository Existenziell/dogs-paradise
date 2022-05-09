import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const Dogs = ({ dogs }) => {
  const [fetchedDogs, setFetchedDogs] = useState()
  const [formData, setFormData] = useState({})
  const [showAddDog, setShowAddDog] = useState(false)
  const [currentElement, setCurrentElement] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [dogToDelete, setDogToDelete] = useState()

  useEffect(() => {
    setFetchedDogs(dogs)
  }, [dogs])

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const addDog = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('dogs')
      .insert([
        { name: formData.name, status: formData.status, user: parseInt(formData.user) }
      ])
    if (!error) {
      const newEntry = data[0]
      setShowAddDog(false)
      setFetchedDogs([...fetchedDogs, newEntry])
    }
  }

  const toggleEditDog = (dog) => {
    const element = document.getElementById(dog.id)
    element.classList.remove('hidden')
    setCurrentElement(element)
    setFormData(dog)
  }

  const cancelEditDog = (dog) => {
    const element = document.getElementById(dog.id)
    element.classList.add('hidden')
  }

  const editDog = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('dogs')
      .update({ name: formData.name, status: formData.status, user: formData.user })
      .eq('id', formData.id)

    if (!error) {
      const newEntry = data[0]
      const filteredDogs = fetchedDogs.filter(c => { return c.id !== formData.id })
      setFetchedDogs([...filteredDogs, newEntry])
      currentElement.classList.add('hidden')
    }
  }

  const toggleModal = (id) => {
    setDogToDelete(id)
    setShowDeleteModal(true)
  }

  const deleteDog = async () => {
    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', dogToDelete)

    if (!error) {
      setShowDeleteModal(false)
      const filteredDogs = fetchedDogs.filter(c => { return c.id !== dogToDelete })
      setFetchedDogs(filteredDogs)
    }
  }

  return (
    <div className='px-24 text-left'>
      <h1 className='text-xl mb-2'>Dogs:</h1>

      <table cellPadding={16} className='shadow-lg bg-white text-brand-dark table-auto w-full'>
        <thead>
          <tr className='bg-slate-200 font-bold'>
            <th>Name</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedDogs?.length &&
            <tr className='p-4'><td>No dogs found.</td></tr>
          }

          {fetchedDogs?.map((dog) => (
            <tr key={dog.id} className='relative anchor'>
              <td>{dog.name}</td>
              <td>{dog.status}</td>
              <td>{dog.users?.name}</td>
              <td>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => toggleEditDog(dog)} className="h-5 w-5 text-brand-dark hover:text-slate-500 transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
              </td>
              <td className='text-center align-middle'>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => toggleModal(dog.id)} className="h-5 w-5 text-brand-dark hover:text-brand transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </td>

              {/* Edit Dog */}
              <td className='hidden absolute top-0 left-0 w-full h-full bg-white p-2' id={dog.id}>
                <form onSubmit={editDog} className='flex items-center justify-between'>
                  <input type='text' name='name' id='name' placeholder='Name' onChange={setData} required className='mr-2 w-36' defaultValue={dog.name} />
                  <input type='text' name='status' id='status' placeholder='Status' onChange={setData} required className='mr-2 w-36' defaultValue={dog.status} />
                  <input type='text' name='user' id='user' placeholder='Owner' onChange={setData} required className='mr-2 w-36' defaultValue={dog.user} />
                  <input type='hidden' name='id' id='id' value={dog.id} />

                  <span className='cursor-pointer hover:underline hover:text-brand ml-16' onClick={() => cancelEditDog(dog)}>Cancel</span>
                  <input type='submit' className='cursor-pointer hover:underline hover:text-brand' value='Save' />
                </form>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddDog(!showAddDog)} className='my-4 link'>Add dog</button>
      {
        showAddDog &&
        <form onSubmit={addDog}>
          <input type='text' name='name' id='name' placeholder='Name' onChange={setData} required className='block mb-2' />
          <input type='text' name='status' id='status' placeholder='Status' onChange={setData} required className='block mb-2' />
          <input type='text' name='user' id='user' placeholder='Owner' onChange={setData} required className='block mb-2' />
          <input type='submit' className='link cursor-pointer block mt-6' value='Save' />

        </form>
      }

      {showDeleteModal &&
        <div className='absolute top-0 bottom-0 left-0 right-0 z-20 text text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white rounded p-8'>

              <p className='text-sm'>Deleting dog with {dogToDelete}</p>
              <p className='text-2xl mt-2'>Are you sure?</p>
              <div className='flex items-center gap-4 mt-6'>
                <button onClick={() => setShowDeleteModal(false)} className='hover:text-brand hover:underline'>Cancel</button>
                <button onClick={deleteDog} className='hover:text-brand hover:underline'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Dogs
