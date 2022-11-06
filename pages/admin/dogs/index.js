import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { CheckIcon, PencilAltIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import useApp from '../../../context/AppContext'
import Link from 'next/link'
import Nav from '../../../components/admin/Nav'
import Auth from '../../../components/Auth'
import Search from '../../../components/admin/Search'
import Image from 'next/image'
import AddToHomeScreen from '../../../components/AddToHomeScreen'

const Dogs = ({ dogs }) => {
  const { session } = useApp()
  const [filteredDogs, setFilteredDogs] = useState(dogs)
  const [checking, setChecking] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (dogs) {
      const filtered = dogs.filter(d => (
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.status?.toLowerCase().includes(search.toLowerCase()) ||
        d.user.username.toLowerCase().includes(search.toLowerCase())
      ))
      setFilteredDogs(filtered)
    }
  }, [search])
  /* eslint-enable react-hooks/exhaustive-deps */

  const resetSearch = () => {
    setFilteredDogs(dogs)
    setSearch('')
  }

  const checkExpirationDates = async () => {
    setChecking(true)
    for (const dog of dogs) {
      let checkVaccine = true
      for (const s of dog.status_vaccine) {
        if (s.expires) {
          const today = new Date()
          const expireDate = new Date(s.expires.replaceAll('-', '/'))
          today.setHours(0, 0, 0, 0)
          expireDate.setHours(0, 0, 0, 0)
          // If expireDate today or in the past
          if (today.getTime() >= expireDate.getTime()) {
            checkVaccine = false
            s.status = false
            s.expires = ''
          }
        } else {
          checkVaccine = false
        }
      }

      let checkDeworming = true
      for (const s of dog.status_deworming) {
        if (s.expires) {
          const today = new Date()
          const expireDate = new Date(s.expires.replaceAll('-', '/'))
          today.setHours(0, 0, 0, 0)
          expireDate.setHours(0, 0, 0, 0)
          // If expireDate today or in the past
          if (today.getTime() >= expireDate.getTime()) {
            checkDeworming = false
            s.status = false
            s.product = ''
            s.expires = ''
          }
        } else {
          checkDeworming = false
        }
      }

      const { error } = await supabase
        .from('dogs')
        .update({
          status_vaccine: dog.status_vaccine,
          status_deworming: dog.status_deworming,
          fully_vaccinated: checkVaccine,
          fully_dewormed: checkDeworming
        })
        .eq('id', dog.id)

      if (!error) {
        router.reload()
      }
    }
  }

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>Admin | Dogs | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin Dogs | Dog&apos;s Paradise' />
      </Head>

      <div className='py-16 admin'>
        <div className='flex justify-between items-center w-full pr-8'>
          <Nav />
          <button className='button-secondary' onClick={checkExpirationDates}>Run Checks</button>
        </div>

        <div className='pt-8 px-8 pb-16 text-left'>
          <div className='flex justify-between items-center mb-1'>
            <h1 className='admin-table-title'>Dogs</h1>
            <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />
          </div>

          {checking ?
            <div className='flex justify-center my-12 w-full'><PulseLoader color={'var(--color-brand)'} size={10} /></div>
            :
            <table className='admin-table'>
              <thead>
                <tr className='admin-table-header'>
                  <th className='ml-6 block'>Picture</th>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Member?</th>
                  <th>Size</th>
                  <th>Hair</th>
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
                  const { id, name, fully_vaccinated, fully_dewormed, status_neuter, user, is_member, size, hairlength, avatar_url } = dog
                  return (
                    <tr key={id + name} className='relative'>
                      <td className='pl-8'>
                        <Link href={`/admin/dogs/${id}`}>
                          <a>
                            {avatar_url ?
                              <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}dogs/${avatar_url}`}
                                alt={name}
                                width={60}
                                height={60}
                                objectFit='cover'
                                placeholder='blur'
                                blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}dogs/${avatar_url}`}
                                className='rounded-sm'
                              />
                              :
                              <p className='text-xs'>No pic</p>
                            }
                          </a>
                        </Link>
                      </td>
                      <td>{name}</td>
                      <td>{user?.name ? user?.name : user?.username}</td>
                      <td>{is_member ? <CheckIcon className='w-5 text-brand' /> : `No`}</td>
                      <td>{size}</td>
                      <td>{hairlength}</td>
                      <td>{fully_vaccinated ? <CheckIcon className='w-5 text-brand' /> : `No`}</td>
                      <td>{fully_dewormed ? <CheckIcon className='w-5 text-brand' /> : `No`}</td>
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
          }
        </div>

        <div className='mb-12'>
          <AddToHomeScreen />
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
