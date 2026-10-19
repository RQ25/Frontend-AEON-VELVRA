import { useState, useEffect } from 'react';
import { BASE_API_URL } from '@/global';
import { IMenu } from '@/app/types';
import { get } from '@/lib/api-bridge';
import { GetCookie } from "@/lib/client-cookie";

const getMenu = async (search: string): Promise<IMenu[]> => {
  try {
    const TOKEN = await GetCookie("token") || "";
    const url = `${BASE_API_URL}/menu?search=${search}`;
    const { data } = await get(url, TOKEN);
    let result: IMenu[] = [];
    if (data?.status) result = [...data.data];
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const useMenuData = (search: string) => {
  const [menuData, setMenuData] = useState<IMenu[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMenu(search);
      setMenuData(data);
    };

    fetchData();
  }, [search]);

  return menuData;
};

export default useMenuData;