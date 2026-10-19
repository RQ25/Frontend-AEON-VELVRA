"use client"

import { IUser } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { put } from "@/lib/api-bridge"
import { GetCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { ButtonPrimary, ButtonDanger, ButtonInfo } from "@/components/button"
import { InputGroupComponent } from "@/components/inputComponents"
import Modal from "@/components/modal"
import Select from "@/components/Select"
import FileInput from "@/components/fileInput"



const EditUser = ({ selectedUser }: { selectedUser: IUser }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [user, setUser] = useState<IUser>({ ...selectedUser })
    const router = useRouter()
    const TOKEN = GetCookie("token") || ""
    const [file, setFile] = useState<File | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setUser({ ...selectedUser })
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/user/${selectedUser.userId}`
            const { name, email, role, password } = user
            const payload = new FormData()
            payload.append("name", name || "")
            payload.append("email", email || "")
            payload.append("password", password || "")
            payload.append("role", role || "")
            if (file !== null) payload.append("profile_picture", file || "")
            const { data } = await put(url, payload, TOKEN)
            if (data?.status) {
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, containerId: `toastMenu`, type: `success` })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, containerId: `toastMenu`, type: `warning` })
            }
        } catch (error) {
            console.log(error);
            toast(`Something went wrong`, { hideProgressBar: true, containerId: `toastMenu`, type: `error` })
        }
    }

    return (
        <div>
            <ToastContainer containerId={`toastMenu`} />
            <ButtonInfo type="button" onClick={() => openModal()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>

            </ButtonInfo>

            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <div className="p-5">
                        <InputGroupComponent id="name" type="text" value={user.name} onChange={val => setUser({ ...user, name: val })} required label="Name" />
                        <InputGroupComponent id="email" type="text" value={user.email} onChange={val => setUser({ ...user, email: val })} required label="Email" />
                        <Select id="category" value={user.role} label="Role" required onChange={val => setUser({ ...user, role: val })}>
                            <option value="">--- Select Category ---</option>
                            <option value="MANAGER">Manager</option>
                            <option value="CASHIER">Cashier</option>
                        </Select>
                        <FileInput acceptTypes={["application/pdf", "image/png", "image/jpeg", "image/jpg"]}
                            id="profile_picture"
                            label="Upload Image (Max 2MB)"
                            onChange={setFile}
                            required={false} />
                    </div>
                    <div className="flex justify-end p-5">
                        <ButtonDanger type="button" onClick={() => setIsShow(false)}>Cancel</ButtonDanger>
                        <ButtonPrimary type="submit">Save</ButtonPrimary>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default EditUser