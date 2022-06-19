import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import useApp from '../../context/AppContext'
import Select from 'react-select'

const Dogs = ({ dogs, users }) => {
  const { notify } = useApp()

  const [fetchedDogs, setFetchedDogs] = useState()
  const [formData, setFormData] = useState({})
  const [showDelete, setShowDelete] = useState(false)
  const [DogToDelete, setDogToDelete] = useState()

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

  const openEdit = (id) => {
    const openBtn = document.getElementById(`${id}-openBtnDog`)
    const closeBtn = document.getElementById(`${id}-closeBtnDog`)
    const inputs = document.getElementsByClassName(`${id}-inputDog`)
    const openEditBtns = document.getElementsByClassName('openBtnDog')
    openBtn.style.display = "none"
    closeBtn.style.display = "block"
    Array.from(openEditBtns).forEach(el => (el.disabled = true))
    Array.from(inputs).forEach(el => (el.disabled = false))
  }

  const closeEdit = (dog) => {
    const openBtn = document.getElementById(`${dog.id}-openBtnDog`)
    const closeBtn = document.getElementById(`${dog.id}-closeBtnDog`)
    const inputs = document.getElementsByClassName(`${dog.id}-inputDog`)
    const openEditBtns = document.getElementsByClassName('openBtnDog')

    openBtn.style.display = "block"
    closeBtn.style.display = "none"
    Array.from(openEditBtns).forEach(el => (el.disabled = false))
    Array.from(inputs).forEach((el) => (el.disabled = true))
    setFormData({})
  }

  const editDog = async (id) => {
    const dog = fetchedDogs.filter(c => c.id === id)[0]
    const { error } = await supabase
      .from('dogs')
      .update({
        name: formData.name ? formData.name : dog.name,
        status: formData.status ? formData.status : dog.status,
      })
      .eq('id', id)

    if (!error) {
      notify("Dog updated successfully!")
      const openBtn = document.getElementById(`${id}-openBtnDog`)
      const closeBtn = document.getElementById(`${id}-closeBtnDog`)
      const inputs = document.getElementsByClassName(`${id}-inputDog`)
      const openEditBtns = document.getElementsByClassName('openBtnDog')

      openBtn.style.display = "block"
      closeBtn.style.display = "none"
      Array.from(openEditBtns).forEach(el => (el.disabled = false))
      Array.from(inputs).forEach(el => (el.disabled = true))
      setFormData({})
    }
  }

  const toggleDeleteModal = (id) => {
    setDogToDelete(id)
    setShowDelete(true)
  }

  const deleteDog = async () => {
    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', DogToDelete)

    if (!error) {
      notify("Dog deleted successfully!")
      setShowDelete(false)
      const filteredDogs = fetchedDogs.filter(c => { return c.id !== DogToDelete })
      setFetchedDogs(filteredDogs)
    }
  }

  let ownerOptions = []
  users.forEach(u => {
    ownerOptions.push({ value: u.id, label: u.name ? u.name : u.username })
  })

  return (
    <div className='py-8 px-8 text-left'>
      <h1 className='admin-table-title'>Dogs</h1>

      <table className='admin-table'>
        <thead>
          <tr className='admin-table-header'>
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

          {fetchedDogs?.map((dog, idx) => (
            <tr key={dog.id + dog.name} className={`relative anchor ${idx % 2 !== 0 && `bg-slate-100`}`}>
              <td>
                <input
                  type='text' name='name' id='name'
                  onChange={setData} disabled required
                  defaultValue={dog.name}
                  className={`mr-2 ${dog.id}-inputDog`}
                />
              </td>
              <td>
                <input
                  type='text' name='status' id='status'
                  onChange={setData} disabled
                  defaultValue={dog.status}
                  className={`mr-2 ${dog.id}-inputDog`}
                />
              </td>
              <td>{dog.user?.name ? dog.user?.name : dog.user?.username}</td>

              <td className='flex items-center justify-center gap-2 mt-2'>

                <div id={`${dog.id}-closeBtnDog`} className='hidden'>
                  <button onClick={() => editDog(dog.id)} aria-label='Edit Dog'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer hover:text-green-700 hover:scale-110 pointer-events-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={() => closeEdit(dog)} aria-label='Close Edit Dialog'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer hover:text-red-700 pointer-events-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <button onClick={() => openEdit(dog.id)} id={`${dog.id}-openBtnDog`} className='openBtn' aria-label='OpenEdit Dialog'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-slate-500 hover:scale-110 transition-all cursor-pointer pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>

              </td>
              <td className='text-center align-middle'>
                <button onClick={() => toggleDeleteModal(dog.id)} aria-label='Toggle Delete Modal'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-brand hover:scale-110 transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
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


      {/* Delete dog */}
      {showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button
                onClick={() => setShowDelete(false)}
                className='absolute top-0 right-0 px-2 py-0 rounded-sm hover:text-brand text-2xl hover:bg-gray-100'
                aria-label='Close Delete Modal'
              >
                &times;
              </button>
              <p className='text-sm'>Deleting dog with ID {DogToDelete}</p>
              <p className='text-2xl mt-2'>Are you sure?</p>
              <div className='flex items-center gap-4 mt-6'>
                <button onClick={() => setShowDelete(false)} className='hover:text-brand hover:underline' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteDog} className='hover:text-brand hover:underline' aria-label='Delete Dog'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Dogs
