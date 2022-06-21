import Link from 'next/link'

const Nav = () => {
  return (
    <div className='text-left ml-8'>
      <Link href='/admin/dogs'><a className='button button-secondary mr-2'>Dogs</a></Link>
      <Link href='/admin/users'><a className='button button-secondary mr-2'>Users</a></Link>
      <Link href='/admin/appointments'><a className='button button-secondary'>Appointments</a></Link>
    </div>
  )
}
export default Nav
