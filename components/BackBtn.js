import { ChevronLeftIcon } from "@heroicons/react/outline"
import Link from "next/link"

const BackBtn = ({ href }) => (
  <Link href={href}>
    <a>
      <ChevronLeftIcon className='h-12 w-12 absolute top-24 left-4 text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand hover:scale-105 transition-all rounded' />
    </a>
  </Link>
)


export default BackBtn
