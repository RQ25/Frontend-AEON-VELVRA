import { ReactNode } from "react"
import Sidebar from "./sidebar"

export type MenuType = {
  id: string
  title?: string
  label: string
  path: string
  icon?: ReactNode
}

type ManagerTemplateProps = {
  children: ReactNode
  menuList: any[]
  title: string
  id: string
  user?: any
}

const ManagerTemplate = ({
  children,
  menuList,
  title,
  id,
  user = { name: "Manager", role: "MANAGER" },
}: ManagerTemplateProps) => {
  return (
    <div className="w-full min-h-dvh bg-slate-50">
      <Sidebar menuList={menuList} title={title} id={id} user={user}>
        {children}
      </Sidebar>
    </div>
  )
}

export default ManagerTemplate