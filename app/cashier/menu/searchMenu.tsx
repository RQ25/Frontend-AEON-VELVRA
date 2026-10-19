"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaSearch } from "react-icons/fa"

type Props = {
  url: string,
  search: string
}

const Search = ({ url, search }: Props) => {
  const [keyword, setKeyword] = useState<string>(search)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`${url}?search=${keyword}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input 
        type="text" 
        id="keyword" 
        value={keyword} 
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full text-sm rounded-xl py-2.5 pl-10 pr-4 bg-black/40 border border-white/10 text-white placeholder-slate-400 focus:border-orange-500/60 focus:outline-none transition backdrop-blur-md"
        placeholder="Search menu name..." 
      />
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <FaSearch size={14} />
      </div>
    </form>
  )
}

export default Search