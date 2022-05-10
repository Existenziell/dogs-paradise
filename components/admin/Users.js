import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Select from 'react-select'

const Users = ({ users, roles }) => {
  const [fetchedUsers, setFetchedUsers] = useState()
  const [formData, setFormData] = useState({})
  const [showDelete, setShowDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState()
  const [notificationMsg, setNotificationMsg] = useState('')

  useEffect(() => {
    setFetchedUsers(users)
  }, [users])

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  function setSelectData(e) {
    setFormData({ ...formData, ...{ role: e.value } })
  }

  const openAdd = () => {
    const panel = document.getElementById('addUserForm')
    panel.classList.toggle('hidden')
  }

  const addUser = async (e) => {
    e.preventDefault()
    let query
    formData.role ?
      query = { name: formData.name, address: formData.address, is_premium: formData.is_premium, role: formData.role }
      :
      query = { name: formData.name, address: formData.address, is_premium: formData.is_premium }

    const { data, error } = await supabase
      .from('users')
      .insert([query])

    if (!error) {
      notify("User added successfully!")
      const panel = document.getElementById('addUserForm')
      panel.classList.toggle('hidden')
      setFormData({})
      const newEntry = data[0]
      setFetchedUsers([...fetchedUsers, newEntry])
    }
  }

  const openEdit = (id) => {
    const openBtn = document.getElementById(`${id}-openBtn`)
    const closeBtn = document.getElementById(`${id}-closeBtn`)
    const inputs = document.getElementsByClassName(`${id}-input`)
    const openEditBtns = document.getElementsByClassName('openBtn')
    openBtn.style.display = "none"
    closeBtn.style.display = "block"
    Array.from(openEditBtns).forEach(el => (el.disabled = true))
    Array.from(inputs).forEach(el => (el.disabled = false))
  }

  const closeEdit = (user) => {
    const openBtn = document.getElementById(`${user.id}-openBtn`)
    const closeBtn = document.getElementById(`${user.id}-closeBtn`)
    const inputs = document.getElementsByClassName(`${user.id}-input`)
    const openEditBtns = document.getElementsByClassName('openBtn')

    openBtn.style.display = "block"
    closeBtn.style.display = "none"
    Array.from(openEditBtns).forEach(el => (el.disabled = false))

    // We need to reset the values if canceled
    let cleanUser = { ...user }
    delete cleanUser.id
    delete cleanUser.created_at
    const userArray = Object.values(cleanUser)
    userArray.pop()
    const lastEl = userArray.pop()

    if (lastEl === true) {
      userArray[2] = false
      userArray[3] = true
    } else {
      userArray[2] = true
      userArray[3] = false
    }
    Array.from(inputs).forEach((el, i) => {
      el.disabled = true
      i === 0 || i === 1 ?
        el.value = userArray[i]
        :
        el.checked = userArray[i]
    })
    setFormData({})
  }

  const editUser = async (id) => {
    const user = fetchedUsers.filter(c => c.id === id)[0]
    const { data, error } = await supabase
      .from('users')
      .update({
        name: formData.name ? formData.name : user.name,
        address: formData.address ? formData.address : user.address,
        is_premium: formData[`${id}-isPremium`] ? formData[`${id}-isPremium`] : user.is_premium,
      })
      .eq('id', id)

    if (!error) {
      notify("User updated successfully!")
      const openBtn = document.getElementById(`${id}-openBtn`)
      const closeBtn = document.getElementById(`${id}-closeBtn`)
      const inputs = document.getElementsByClassName(`${id}-input`)
      const openEditBtns = document.getElementsByClassName('openBtn')

      openBtn.style.display = "block"
      closeBtn.style.display = "none"
      Array.from(openEditBtns).forEach(el => (el.disabled = false))
      Array.from(inputs).forEach(el => (el.disabled = true))
      setFormData({})
    }
  }

  const toggleDeleteModal = (id) => {
    setUserToDelete(id)
    setShowDelete(true)
  }

  const deleteUser = async () => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userToDelete)

    if (!error) {
      notify("User deleted successfully!")
      setShowDelete(false)
      const filteredUsers = fetchedUsers.filter(c => { return c.id !== userToDelete })
      setFetchedUsers(filteredUsers)
    } else {
      notify("User cannot be deleted, because they have active dogs")
    }
  }

  let roleOptions = []
  roles.forEach(r => {
    roleOptions.push({ value: r.id, label: r.name })
  })

  const notify = (msg) => {
    const notification = document.querySelector('.notification')
    notification.classList.remove('-translate-y-20')
    setNotificationMsg(msg)
    setTimeout(() => {
      notification.classList.add('-translate-y-20')
    }, 3000)
  }

  return (
    <div className='py-8 px-8 text-left'>
      <div className="fixed top-0 left-0 right-0 w-full notification -translate-y-20 transition-all duration-500 z-30">
        <div className='bg-brand-dark text-white flex items-center justify-center py-6 '>
          {notificationMsg}
        </div>
      </div>

      <h1 className='text-xl bg-slate-700 max-w-max text-white px-4 py-2 mb-1'>Users</h1>

      <table cellPadding={12} className='shadow-lg bg-white text-brand-dark table-auto w-full'>
        <thead>
          <tr className='bg-slate-700 text-white font-bold'>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Premium?</th>
            <th>Dogs</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedUsers?.length &&
            <tr className='p-4'><td>No users found.</td></tr>
          }

          {fetchedUsers?.map((user) => (
            <tr key={user.id + user.name} className='relative anchor'>
              <td>{user.id}</td>
              <td>
                <input
                  type='text' name='name' id='name' placeholder='Name'
                  onChange={setData} disabled required
                  defaultValue={user.name}
                  className={`mr-2 w-36 ${user.id}-input`}
                />
              </td>
              <td>
                <input
                  type='text' name='address' id='address' placeholder='Address'
                  onChange={setData} disabled required
                  defaultValue={user.address}
                  className={`mr-2 w-36 ${user.id}-input`}
                />
              </td>
              <td>
                <div onChange={setData} className='block'>
                  <label htmlFor={`${user.id}-isPremiumNo`} className='cursor-pointer block'>
                    <input
                      type="radio" value="false" disabled required
                      name={`${user.id}-isPremium`}
                      id={`${user.id}-isPremiumNo`}
                      defaultChecked={!user.is_premium}
                      className={`${user.id}-input`}
                    /> No
                  </label>
                  <label htmlFor={`${user.id}-isPremiumYes`} className='cursor-pointer'>
                    <input
                      type="radio" value="true" disabled
                      name={`${user.id}-isPremium`}
                      id={`${user.id}-isPremiumYes`}
                      defaultChecked={user.is_premium}
                      className={`${user.id}-input`}
                    /> Yes
                  </label>
                </div>
              </td>
              <td>
                {user?.dogs?.map(d => (
                  <span key={`${d.name}-${user.id}`} className='mr-2'>{d.name}</span>
                ))}
              </td>
              <td>
                {user?.roles?.name}
              </td>
              <td className='flex items-center justify-center gap-2 mt-3'>

                <div id={`${user.id}-closeBtn`} className='hidden'>
                  <button onClick={() => editUser(user.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer hover:text-green-700 hover:scale-110 pointer-events-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={() => closeEdit(user)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer hover:text-red-700 pointer-events-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <button onClick={() => openEdit(user.id)} id={`${user.id}-openBtn`} className='openBtn'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-slate-500 hover:scale-110 transition-all cursor-pointer pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>

              </td>
              <td className='text-center align-middle'>
                <button onClick={() => toggleDeleteModal(user.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-brand hover:scale-110 transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add user */}
      <button onClick={openAdd} className='my-4 link flex items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add user
      </button>

      <form onSubmit={addUser} className='shadow max-w-max bg-slate-300 p-4 hidden' id='addUserForm' >
        <input type='text' name='name' id='name' placeholder='Name' onChange={setData} required className='block mb-2' />
        <input type='text' name='address' id='address' placeholder='Address' onChange={setData} required className='block mb-2' />
        <div className='flex items-center  justify-between bg-white p-4 rounded whitespace-nowrap mb-2 w-full'>
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
        <div>
          <Select options={roleOptions} onChange={setSelectData} instanceId />
        </div>
        <input type='submit' className='link cursor-pointer block mt-6 dark:text-brand-dark' value='Save' />
      </form>


      {/* Delete user */}
      {showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button onClick={() => setShowDelete(false)} className='absolute top-0 right-0 px-2 py-0 rounded-sm hover:text-brand text-2xl hover:bg-gray-100'>
                &times;
              </button>
              <p className='text-sm'>Deleting user with ID {userToDelete}</p>
              <p className='text-2xl mt-2'>Are you sure?</p>
              <div className='flex items-center gap-4 mt-6'>
                <button onClick={() => setShowDelete(false)} className='hover:text-brand hover:underline'>Cancel</button>
                <button onClick={deleteUser} className='hover:text-brand hover:underline'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Users
