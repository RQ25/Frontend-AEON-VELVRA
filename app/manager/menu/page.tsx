import { IMenu } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert"
import Image from "next/image"
import Search from "./search";
import AddMenu from "./addMenu";
import EditMenu from "./editMenu"
import DeleteMenu from "./deleteMenu"



const getMenu = async (search: string): Promise<IMenu[]> => {
    try {
        const TOKEN = await getCookies("token")
        const url = `${BASE_API_URL}/menu?search=${search}`
        const data = await get(url, TOKEN)
        let result: IMenu[] = []
        console.log(data)
        if (data?.status) result = [...data.data.data]
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}


const MenuPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const search = searchParams?.search ? String(searchParams.search) : "";

    const menu: IMenu[] = await getMenu(search);

    const category = (cat: string): React.ReactNode => {
        if (cat === "FOOD") {
            return <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                Food
            </span>;
        }
        if (cat === "DESSERT") {
            return <span className="bg-amber-100 text-amber-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-amber-900 dark:text-amber-300">
                Dessert
            </span>;
        }
        return <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
            Drink
        </span>;
    };

    return (
        <div>
            <div className="m-2 bg-white text-black rounded-lg p-3 border-t-4 border-t-primary shadow-md">
                <h4 className="text-xl font-bold mb-2">Menu Data</h4>
                <p className="text-sm text-secondary mb-4">
                    This page displays menu data, allowing menus to view details,
                    search, and manage menu items by adding, editing, or deleting them.
                </p>
                <div className="flex justify-between items-center mb-4">
                    {/* Search Bar */}
                    <div className="flex items-center w-full max-w-md flex-grow">
                        <Search url={`/manager/menu`} search={search} />
                    </div>
                    {/* Add Menu Button */}
                    <div className="ml-4">
                        <AddMenu />
                    </div>
                </div>
                {
                    menu.length === 0 ? (
                        <AlertInfo title="Informasi">
                            No data available
                        </AlertInfo>
                    ) : (
                        <div className="m-2">
                            {menu.map((data, index) => (
                                <div key={`keyPrestasi${index}`} className="flex flex-wrap shadow m-2">
                                    <div className="w-full md:w-1/12 p-2">
                                        <small className="text-sm font-bold text-primary">Picture</small><br />
                                        <Image width={40} height={40} src={`${BASE_IMAGE_MENU}/${data.picture}`} className="rounded-sm overflow-hidden" alt="preview" unoptimized />
                                    </div>
                                    <div className="w-full md:w-2/12 p-2">
                                        <small className="text-sm font-bold text-primary">Name</small> <br />
                                        {data.name}
                                    </div>
                                    <div className="w-full md:w-1/12 p-2">
                                        <small className="text-sm font-bold text-primary">Price</small> <br />
                                        {data.price}
                                    </div>
                                    <div className="w-full md:w-5/12 p-2">
                                        <small className="text-sm font-bold text-primary">Description</small> <br />
                                        {data.description}
                                    </div>
                                    <div className="w-full md:w-1/12 p-2">
                                        <small className="text-sm font-bold text-primary">Category</small> <br />
                                        {category(data.category)}
                                    </div>
                                    <div className="w-full md:w-2/12 p-2">
                                        <small className="text-sm font-bold text-primary">Action</small><br />
                                        <div className="flex gap-1">
                                            <EditMenu selectedMenu={data} />
                                            <DeleteMenu selectedMenu={data} />
                                        </div>
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default MenuPage;