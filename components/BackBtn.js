import { ChevronLeftIcon } from "@heroicons/react/outline"
import Link from "next/link"

const BackBtn = ({ href }) => (
  <Link href={href}>
    <a>
      <ChevronLeftIcon className='h-10 w-10 md:h-12 md:w-12 absolute top-14 md:top-24 left-2 md:left-4 text-slate-400 dark:text-slate-400 hover:text-brand dark:hover:text-brand hover:scale-[101%] transition-all rounded' />
    </a>
  </Link>
)

export default BackBtn
