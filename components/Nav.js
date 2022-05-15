import { useRouter } from 'next/router'
import { urls } from '../lib/config'
import { isActiveLink } from '../lib/IsActiveLink'
import Link from 'next/link'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Nav = () => {
    const { locale } = useRouter()
    const router = useRouter()

    let i18n
    locale === 'es' ?
        i18n = langES.navigation :
        i18n = langEN.navigation

    return (
        <nav className='fixed left-0 right-0 bottom-0 z-20 flex items-center justify-between divide-x-2 divide-slate-200 dark:divide-slate-700'>
            {urls.map(url => (
                <Link href={url.url} key={url.name} >
                    <a className={`${isActiveLink(url.url, router.pathname) && `active-nav`} flex justify-center items-center w-full py-3 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-600 hover:text-white dark:hover:bg-slate-300 dark:hover:text-slate-900 transition-all divide-x`}>
                        {url.icon}
                    </a>
                </Link>
            ))}

        </nav>
    )
}

export default Nav
