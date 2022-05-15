import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useRouter } from 'next/router'
import { urls } from '../lib/config'
import Link from 'next/link'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Nav = () => {
    const appCtx = useContext(AppContext)
    const { locale } = useRouter()

    let i18n
    locale === 'es' ?
        i18n = langES.navigation :
        i18n = langEN.navigation

    return (
        <nav className='fixed left-0 right-0 bottom-0 text-slate-600  z-20'>
            <ul className='flex items-center justify-between w-full bg-slate-100 dark:bg-slate-600 dark:text-slate-300'>
                {urls.map(url => (
                    <li key={url.name} className='hover:bg-slate-600 hover:text-white dark:hover:bg-slate-300 dark:hover:text-slate-900 transition-all w-full'>
                        <Link href={url.url}>
                            <a className='flex justify-center items-center py-3'>
                                {url.icon}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Nav
