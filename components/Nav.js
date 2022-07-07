import { useRouter } from 'next/router'
import { isActiveLink } from '../lib/IsActiveLink'
import Link from 'next/link'
// import langEN from '../i18n/en.json'
// import langES from '../i18n/es.json'

const Nav = () => {
    const router = useRouter()

    const urls = [
        {
            name: 'Home',
            href: '/',
            icon:
                <svg className='w-8' fill='currentColor' viewBox="0 0 63.445 63.445" stroke="currentColor" strokeWidth={1} xmlns="http://www.w3.org/2000/svg" >
                    <g>
                        <g>
                            <path d="M21.572,28.926c5.067,0,9.19-5.533,9.19-12.334s-4.123-12.334-9.19-12.334c-5.067,0-9.19,5.533-9.19,12.334 S16.504,28.926,21.572,28.926z M21.572,7.258c3.355,0,6.19,4.275,6.19,9.334s-2.834,9.334-6.19,9.334 c-3.356,0-6.19-4.275-6.19-9.334S18.216,7.258,21.572,7.258z" />
                            <path d="M48.83,40.922c-0.189-0.256-0.37-0.498-0.466-0.707c-2.054-4.398-7.689-9.584-16.813-9.713L31.2,30.5 c-8.985,0-14.576,4.912-16.813,9.51c-0.077,0.156-0.247,0.361-0.427,0.576c-0.212,0.254-0.423,0.512-0.604,0.793 c-1.89,2.941-2.853,6.25-2.711,9.318c0.15,3.26,1.512,5.877,3.835,7.369c0.937,0.604,1.95,0.907,3.011,0.907 c2.191,0,4.196-1.233,6.519-2.664c1.476-0.907,3.002-1.848,4.698-2.551c0.191-0.063,0.968-0.158,2.241-0.158 c1.515,0,2.6,0.134,2.833,0.216c1.653,0.729,3.106,1.688,4.513,2.612c2.154,1.418,4.188,2.759,6.395,2.759 c0.947,0,1.867-0.248,2.732-0.742c4.778-2.715,5.688-10.162,2.03-16.603C49.268,41.52,49.048,41.219,48.83,40.922z M45.939,55.838 c-0.422,0.238-0.818,0.35-1.25,0.35c-1.308,0-2.9-1.049-4.746-2.264c-1.438-0.947-3.066-2.02-4.949-2.852 c-0.926-0.41-2.934-0.472-4.046-0.472c-1.629,0-2.76,0.128-3.362,0.375c-1.943,0.808-3.646,1.854-5.149,2.779 c-1.934,1.188-3.604,2.219-4.946,2.219c-0.49,0-0.931-0.137-1.389-0.432c-1.483-0.953-2.356-2.724-2.461-4.984 c-0.113-2.45,0.682-5.135,2.238-7.557c0.113-0.177,0.25-0.334,0.383-0.492c0.274-0.328,0.586-0.701,0.823-1.188 c1.84-3.781,6.514-7.82,14.115-7.82l0.308,0.002c7.736,0.109,12.451,4.369,14.137,7.982c0.225,0.479,0.517,0.875,0.773,1.223 c0.146,0.199,0.301,0.4,0.426,0.619C49.684,48.326,49.279,53.939,45.939,55.838z" />
                            <path d="M41.111,28.926c5.068,0,9.191-5.533,9.191-12.334S46.18,4.258,41.111,4.258c-5.066,0-9.189,5.533-9.189,12.334 S36.044,28.926,41.111,28.926z M41.111,7.258c3.355,0,6.191,4.275,6.191,9.334s-2.834,9.334-6.191,9.334 c-3.355,0-6.189-4.275-6.189-9.334S37.756,7.258,41.111,7.258z" />
                            <path d="M56.205,22.592c-4.061,0-7.241,4.213-7.241,9.59c0,5.375,3.181,9.588,7.241,9.588s7.24-4.213,7.24-9.588 C63.445,26.805,60.266,22.592,56.205,22.592z M56.205,38.77c-2.299,0-4.241-3.018-4.241-6.588c0-3.572,1.942-6.59,4.241-6.59 s4.24,3.018,4.24,6.59C60.445,35.752,58.503,38.77,56.205,38.77z" />
                            <path d="M14.482,32.182c0-5.377-3.181-9.59-7.241-9.59S0,26.805,0,32.182c0,5.375,3.181,9.588,7.241,9.588 S14.482,37.557,14.482,32.182z M7.241,38.77C4.942,38.77,3,35.752,3,32.182c0-3.572,1.942-6.59,4.241-6.59 c2.299,0,4.241,3.018,4.241,6.59C11.482,35.752,9.54,38.77,7.241,38.77z" />
                        </g>
                    </g>
                </svg>
        },
        {
            name: 'Services',
            href: '/services',
            icon:
                <svg className="w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} xmlns="http://www.w3.org/2000/svg" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
        },
        {
            name: 'Appointments',
            href: '/appointments',
            icon:
                <svg className='w-8' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
        },
        {
            name: 'Profile',
            href: '/profile',
            icon:
                <svg className='w-8' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} xmlns="http://www.w3.org/2000/svg" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
        },
    ]

    return (
        <nav className='fixed left-0 right-0 bottom-0 z-20 flex items-center justify-between divide-x-2 divide-slate-200 dark:divide-dark'>
            {urls.map(url => (
                <Link href={url.href} key={url.name} >
                    <a name={url.name} className={`flex flex-col justify-center items-center w-full py-2 md:py-3 bg-white dark:bg-brand-dark  text-brand
                        hover:bg-brand hover:text-white dark:hover:bg-brand transition-all divide-x ${isActiveLink(url.href, router.pathname) && `active-nav`}`}>
                        <div className='flex items-center flex-col md:gap-1'>
                            {url.icon}
                            <span className='text-[10px] md:text-xs'>{url.name}</span>
                        </div>
                    </a>
                </Link>
            ))}

        </nav>
    )
}

export default Nav
