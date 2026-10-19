import { IUser } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL } from "@/global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert"
import Search from "./search"
import AddUser from "./addUser"
import EditUser from "./editUser"
import DeleteUser from "./deleteUser"

const getUser = async (search: string): Promise<IUser[]> => {
  try {
    const TOKEN = await getCookies("token")
    const url = `${BASE_API_URL}/user?search=${encodeURIComponent(search)}`
    const data = await get(url, TOKEN)
    let result: IUser[] = []
    if (data?.status && Array.isArray(data.data?.data)) {
      result = [...data.data.data]
    }
    return result
  } catch (error) {
    console.error("Error fetching user data:", error)
    return []
  }
}

const RoleBadge = ({ role }: { role: string }) => {
  switch (role) {
    case "MANAGER":
      return (
        <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
          Manager
        </span>
      )
    case "CASHIER":
      return (
        <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
          Cashier
        </span>
      )
    default:
      return (
        <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
          {role}
        </span>
      )
  }
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const UserPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams?.search ? String(resolvedSearchParams.search) : ""

  const userList: IUser[] = await getUser(search)

  return (
    <div>
      <div className="m-2 bg-white text-black rounded-lg p-3 border-t-4 border-t-primary shadow-md">
        <h4 className="text-xl font-bold mb-2">User Data</h4>
        <p className="text-sm text-secondary mb-4">
          This page displays user data, allowing managers to view details,
          search, and manage user accounts by adding, editing, or deleting them.
        </p>
        
        <div className="flex justify-between items-center mb-4">
          {/* Search Bar */}
          <div className="flex items-center w-full max-w-md flex-grow">
            <Search url="/manager/user" search={search} />
          </div>
          {/* Add User Button */}
          <div className="ml-4">
            <AddUser />
          </div>
        </div>

        {userList.length === 0 ? (
          <AlertInfo title="Informasi">No data available</AlertInfo>
        ) : (
          <div className="m-2">
            {userList.map((data: any, index: number) => (
              <div
                key={data.id || data.id_user || `user-${index}`}
                className="flex flex-wrap shadow m-2 items-center bg-white p-2 rounded"
              >
                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Name</small>
                  {data.name}
                </div>

                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Email</small>
                  {data.email}
                </div>

                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Role</small>
                  <RoleBadge role={data.role} />
                </div>

                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Action</small>
                  <div className="flex gap-1">
                    <EditUser selectedUser={data} />
                    <DeleteUser selectedUser={data} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPage