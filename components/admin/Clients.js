import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const Clients = ({ clients }) => {
  const [fetchedClients, setFetchedClients] = useState()
  const [formData, setFormData] = useState({})
  const [showAddClient, setShowAddClient] = useState(false)
  const [currentElement, setCurrentElement] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clientToDelete, setClientToDelete] = useState()

  useEffect(() => {
    setFetchedClients(clients)
  }, [clients])

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const addClient = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('users')
      .insert([
        { name: formData.name, address: formData.address, is_premium: formData.is_premium }
      ])

    if (!error) {
      const newEntry = data[0]
      setShowAddClient(false)
      setFetchedClients([...fetchedClients, newEntry])
    }
  }

  const toggleEditClient = (client) => {
    const element = document.getElementById(client.id)
    element.classList.remove('hidden')
    setCurrentElement(element)
    setFormData(client)
  }

  const cancelEditClient = (client) => {
    const element = document.getElementById(client.id)
    element.classList.add('hidden')
  }

  const editClient = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('users')
      .update({ name: formData.name, address: formData.address, is_premium: formData.is_premium })
      .eq('id', formData.id)

    if (!error) {
      const newEntry = data[0]
      const filteredClients = fetchedClients.filter(c => { return c.id !== formData.id })
      setFetchedClients([...filteredClients, newEntry])
      currentElement.classList.add('hidden')
    }
  }

  const toggleModal = (id) => {
    setClientToDelete(id)
    setShowDeleteModal(true)
  }

  const deleteClient = async () => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', clientToDelete)

    if (!error) {
      setShowDeleteModal(false)
      const filteredClients = fetchedClients.filter(c => { return c.id !== clientToDelete })
      setFetchedClients(filteredClients)
    }
  }

  return (
    <div className='p-24 text-left'>
      <h1 className='text-xl mb-2'>Clients:</h1>

      <table cellPadding={16} className='shadow-lg bg-white text-brand-dark table-auto w-full'>
        <thead>
          <tr className='bg-slate-200 font-bold'>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Premium?</th>
            <th>Dogs</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedClients?.length &&
            <tr className='p-4'><td>No clients found.</td></tr>
          }

          {fetchedClients?.map((client) => (
            <tr key={client.id} className='relative anchor'>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.address}</td>
              <td>{client.is_premium ? `Yes` : `No`}</td>
              <td>{client.dogs.map(d => (<span className='mr-2'>{d.name}</span>))}</td>
              <td>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => toggleEditClient(client)} className="h-5 w-5 text-brand-dark hover:text-slate-500 transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
              </td>
              <td className='text-center align-middle'>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => toggleModal(client.id)} className="h-5 w-5 text-brand-dark hover:text-brand transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </td>

              {/* Edit Client */}
              <td className='hidden absolute top-0 left-0 w-full h-full bg-white p-2' id={client.id}>
                <form onSubmit={editClient} className='flex items-center justify-between'>
                  <input type='text' name='name' id='name' placeholder='Name' onChange={setData} required className='mr-2 w-36' defaultValue={client.name} />
                  <input type='text' name='address' id='address' placeholder='Address' onChange={setData} required className='mr-2 w-36' defaultValue={client.address} />
                  <input type='hidden' name='id' id='id' value={client.id} />
                  <div className='flex items-center bg-white rounded whitespace-nowrap text-sm'>
                    <span className='mr-4 block'>Is Premium?</span>
                    <div onChange={setData} className='block'>
                      <label htmlFor='isPremiumNo' className='cursor-pointer mr-2'>
                        <input type="radio" value="false" name="is_premium" id='isPremiumNo' required defaultChecked={!client.is_premium} /> No
                      </label>
                      <label htmlFor='isPremiumYes' className='cursor-pointer'>
                        <input type="radio" value="true" name="is_premium" id='isPremiumYes' defaultChecked={client.is_premium} /> Yes
                      </label>
                    </div>
                  </div>
                  <span className='cursor-pointer hover:underline hover:text-brand ml-16' onClick={() => cancelEditClient(client)}>Cancel</span>
                  <input type='submit' className='cursor-pointer hover:underline hover:text-brand' value='Save' />
                </form>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddClient(!showAddClient)} className='my-4 link'>Add client</button>
      {
        showAddClient &&
        <form onSubmit={addClient}>
          <input type='text' name='name' id='name' placeholder='Name' onChange={setData} required className='block mb-2' />
          <input type='text' name='address' id='address' placeholder='Address' onChange={setData} required className='block mb-2' />

          <div className='flex items-center bg-white max-w-min p-4 rounded whitespace-nowrap'>
            <span className='mr-4 inline-block'>Is Premium?</span>
            <div onChange={setData} className='inline-block'>
              <label htmlFor='isPremiumNo' className='cursor-pointer block'>
                <input type="radio" value="false" name="is_premium" id='isPremiumNo' required defaultChecked={true} /> No
              </label>
              <label htmlFor='isPremiumYes' className='cursor-pointer block'>
                <input type="radio" value="true" name="is_premium" id='isPremiumYes' /> Yes
              </label>
            </div>
          </div>

          <input type='submit' className='link cursor-pointer block mt-6' value='Save' />

        </form>
      }

      {showDeleteModal &&
        <div className='absolute top-0 bottom-0 left-0 right-0 z-20 text text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white rounded p-8'>

              <p className='text-sm'>Deleting client with {clientToDelete}</p>
              <p className='text-2xl mt-2'>Are you sure?</p>
              <div className='flex items-center gap-4 mt-6'>
                <button onClick={() => setShowDeleteModal(false)} className='hover:text-brand hover:underline'>Cancel</button>
                <button onClick={deleteClient} className='hover:text-brand hover:underline'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Clients
