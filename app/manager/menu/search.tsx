"use client"

import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

type Props = {
    url: string
    search : string
}
const Search =  ({ url, search}: Props) => {
    const [keyword,setKeyword] = useState<string>(search)
    const router = useRouter()

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        router.push(`${url}?search=${keyword}`)
    }
    return (
        <div className=" rounded-md px-2 w-full bg-slate-50 border border-secondary focus:border-primary focus:outline-none flex gap-4 items-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input type="text" id="keyword" value={keyword} onChange={e => setKeyword(e.target.value)}
                className={`text-sm w-full rounded-md p-2 bg-slate-50  focus:border-primary focus:outline-none`}
                placeholder="Search" onKeyUp={handleSearch} />
        </div>
    )
} 
export default Search