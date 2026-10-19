import { Suspense } from "react"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL } from "@/global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert"

export const dynamic = "force-dynamic"

const getHistory = async (search: string) => {
  try {
    const TOKEN = await getCookies("token")
    const url = `${BASE_API_URL}/transaksi?search=${encodeURIComponent(search)}`
    const data = await get(url, TOKEN)
    if (data?.status && Array.isArray(data.data?.data)) {
      return data.data.data
    }
    return []
  } catch (error) {
    console.error("Error fetching history:", error)
    return []
  }
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const HistoryPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams?.search ? String(resolvedSearchParams.search) : ""

  const historyList = await getHistory(search)

  return (
    <div>
      <div className="m-2 bg-white text-black rounded-lg p-3 border-t-4 border-t-primary shadow-md">
        <h4 className="text-xl font-bold mb-2">Transaction History</h4>
        <p className="text-sm text-secondary mb-4">
          View past transaction history and order details.
        </p>

        {historyList.length === 0 ? (
          <AlertInfo title="Informasi">No history available</AlertInfo>
        ) : (
          <div className="m-2 space-y-2">
            {historyList.map((item: any, index: number) => (
              <div
                key={item.id || item.id_transaksi || `history-${index}`}
                className="flex flex-wrap shadow p-3 rounded items-center bg-white"
              >
                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Customer Name</small>
                  {item.nama_pelanggan || item.customer_name || "-"}
                </div>
                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Table Number</small>
                  {item.nomor_meja || item.table_number || "-"}
                </div>
                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Status</small>
                  <span className="capitalize">{item.status || "Completed"}</span>
                </div>
                <div className="w-full md:w-3/12 p-2">
                  <small className="text-sm font-bold text-primary block">Total</small>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(item.total_harga || item.total || 0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage