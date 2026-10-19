"use client";
import { IMenu } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { post } from "@/lib/api-bridge";
import { GetCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ButtonSuccess, ButtonDanger, ButtonInfo, ButtonPrimary } from "@/components/button";
import { InputGroupComponent } from "@/components/inputComponents";
import Modal from "@/components/modal";
import Select from "@/components/Select";
import FileInput from "@/components/fileInput";

const AddMenu = () => {
  const [isShow, setIsShow] = useState<boolean>(false);

  const [menu, setMenu] = useState<IMenu>({
    menuId: 0,
    uuid: ``,
    name: ``,
    price: 0,
    description: ``,
    category: ``,
    picture: ``,
    createdAt: ``,
    updatedAt: ``,
  });
  const router = useRouter();
  const TOKEN = GetCookie("token") || "";

  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const openModal = () => {
    setMenu({
      menuId: 0,
      uuid: ``,
      name: ``,
      price: 0,
      description: ``,
      category: ``,
      picture: ``,
      createdAt: ``,
      updatedAt: ``,
    });
    setIsShow(true);
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const url = `${BASE_API_URL}/menu`;
      const { name, price, description, category } = menu;
      const payload = new FormData();
      payload.append("name", name || "");
      payload.append("price", price !== undefined ? price.toString() : "0");
      payload.append("category", category || "");
      payload.append("description", description || "");
      for (let pair of payload.entries()) {
        console.log(pair[0], pair[1]); // Log semua entri FormData
      }
      if (file !== null) payload.append("picture", file || "");
      console.log(payload);
      const { data } = await post(url, payload, TOKEN);
      if (data?.status) {
        setIsShow(false);
        toast(data?.message, {
          hideProgressBar: true,
          containerId: `toastMenu`,
          type: `success`
        });
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast(data?.message, {
          hideProgressBar: true,
          containerId: `toastMenu`,
          type: `warning`,
        });
      }
    } catch (error) {
      console.log(error);
      toast(`Something Wrong, { hideProgressBar: true, containerId: toastMenu, type: error,}`);
    }
  };

  return (
    <div>
      <ToastContainer containerId={`toastMenu`} />
      <ButtonSuccess type="button" onClick={() => openModal()}>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Menu
        </div>
      </ButtonSuccess>
      <Modal isShow={isShow} onClose={(state) => setIsShow(state)}>
        <form onSubmit={handleSubmit}>
          {/* modal header */}
          <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
            <div className="w-full flex items-center">
              <div className="flex flex-col">
                <strong className="font-bold text-black text-2xl">
                  Create New Menu
                </strong>
                <small className="text-slate-400 text-sm">
                  Managers can create menu items on this page.
                </small>
              </div>
              <div className="ml-auto">
                <button
                  type="button"
                  className="text-black"
                  onClick={() => setIsShow(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* end modal header */}

          {/* modal body */}
          <div className="p-5">
            <InputGroupComponent
              id={`name`}
              className="text-black"
              type="text"
              value={menu.name}
              onChange={(val) => setMenu({ ...menu, name: val })}
              required={true}
              label="Name"
            />

            <InputGroupComponent
              id={`price`}
              className="text-black"
              type="number"
              value={menu.price.toString()}
              onChange={(val) => setMenu({ ...menu, price: Number(val) })}
              required={true}
              label="Price"
            />

            <InputGroupComponent
              id={`description`}
              className="text-black"
              type="text"
              value={menu.description}
              onChange={(val) => setMenu({ ...menu, description: val })}
              required={true}
              label="Description"
            />

            <Select
              id={`category`}
              className="text-black"
              value={menu.category}
              label="Category"
              required={true}
              onChange={(val) => setMenu({ ...menu, category: val })}
            >
              <option value="">--- Select Category ---</option>
              <option value="food">Food</option>
              <option value="dessert">Dessert</option>
              <option value="drink">Drink</option>
            </Select>

            <FileInput
              acceptTypes={[
                "application/pdf",
                "image/png",
                "image/jpeg",
                "image/jpg",
              ]}
              id="profile_picture"
              className="text-black"
              label="Upload Picture (Max 2MB, PDF/JPG/JPEG/PNG)"
              onChange={(f) => setFile(f)}
              required={false}
            />
          </div>
          {/* end modal body */}

          {/* modal footer */}
          <div className="w-full p-5 flex rounded-b-2xl shadow">
            <div className="flex ml-auto gap-2">
              <ButtonDanger type="button" onClick={() => setIsShow(false)}>
                Cancel
              </ButtonDanger>
              <ButtonPrimary type="submit">Save</ButtonPrimary>
            </div>
          </div>
          {/* end modal footer */}
        </form>
      </Modal>
    </div>
  );
};
export default AddMenu;