import { Suspense } from "react"
import { IMenu } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert"
import Image from "next/image"
import Search from "./searchMenu"

export const dynamic = "force-dynamic"

const getMenu = async (search: string): Promise<IMenu[]> => {
  try {
    const TOKEN = await getCookies("token")
    const url = `${BASE_API_URL}/menu?search=${encodeURIComponent(search)}`
    const data = await get(url, TOKEN)
    let result: IMenu[] = []
    if (data?.status && Array.isArray(data.data?.data)) {
      result = [...data.data.data]
    }
    return result
  } catch (error) {
    console.error("Error fetching menu:", error)
    return []
  }
}

const CategoryBadge = ({ category }: { category: string }) => {
  if (category === "FOOD") {
    return (
      <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
        Food
      </span>
    )
  }
  if (category === "DESSERT") {
    return (
      <span className="bg-amber-100 text-amber-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-amber-900 dark:text-amber-300">
        Dessert
      </span>
    )
  }
  return (
    <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
      Drink
    </span>
  )
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const CashierMenuPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams?.search ? String(resolvedSearchParams.search) : ""

  const menu: IMenu[] = await getMenu(search)

  return (
    <div>
      <div className="m-2 bg-white text-black rounded-lg p-3 border-t-4 border-t-primary shadow-md">
        <h4 className="text-xl font-bold mb-2">Menu Catalog</h4>
        <p className="text-sm text-secondary mb-4">
          Browse through available menu items and select options for customer orders.
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center w-full max-w-md flex-grow">
            <Suspense fallback={<div className="text-sm text-gray-500">Loading search...</div>}>
              <Search url="/cashier/menu" search={search} />
            </Suspense>
          </div>
        </div>

        {menu.length === 0 ? (
          <AlertInfo title="Informasi">No data available</AlertInfo>
        ) : (
          <div className="m-2 space-y-2">
            {menu.map((data: any, index: number) => (
              <div
                key={data.id || data.id_menu || `menu-${index}`}
                className="flex flex-wrap shadow p-2 rounded items-center bg-white"
              >
                <div className="w-full md:w-2/12 p-2">
                  <small className="text-sm font-bold text-primary block">Picture</small>
                  <Image
                    width={40}
                    height={40}
                    src={`${BASE_IMAGE_MENU}/${data.picture}`}
                    className="rounded-sm overflow-hidden object-cover"
                    alt={data.name || "Menu item"}
                    unoptimized
                  />
                </div>

                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Name</small>
                  {data.name}
                </div>

                <div className="w-full md:w-2/12 p-2">
                  <small className="text-sm font-bold text-primary block">Price</small>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(data.price)}
                </div>

                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Description</small>
                  <p className="line-clamp-2 text-sm">{data.description}</p>
                </div>

                <div className="w-full md:w-2/12 p-2">
                  <small className="text-sm font-bold text-primary block">Category</small>
                  <CategoryBadge category={data.category} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CashierMenuPage