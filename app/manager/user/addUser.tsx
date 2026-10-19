"use client";
import { IUser } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { post } from "@/lib/api-bridge";
import { GetCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ButtonSuccess, ButtonDanger, ButtonPrimary } from "@/components/button";
import { InputGroupComponent } from "@/components/inputComponents";
import Modal from "@/components/modal";
import Select from "@/components/Select";
import FileInput from "@/components/fileInput";

const AddUser = () => {
    const [isShow, setIsShow] = useState<boolean>(false);

    const [user, setUser] = useState<IUser>({
        userId: 0,
        uuid: "",
        name: "",
        email: "",
        role: "",
        password: "",
        profile_picture: "",
        createdAt: "",
        updatedAt: "",
    });
    const router = useRouter();
    const TOKEN = GetCookie("token") || "";

    const [file, setFile] = useState<File | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const openModal = () => {
        setUser({
            userId: 0,
            uuid: "",
            name: "",
            email: "",
            role: "",
            password: "",
            profile_picture: "",
            createdAt: "",
            updatedAt: "",
        });
        setIsShow(true);
        if (formRef.current) formRef.current.reset();
    };

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault();
            const url = `${BASE_API_URL}/user`;
            const { name, email, role, password } = user;
            const payload = new FormData();
            payload.append("name", name || "");
            payload.append("email", email || "");
            payload.append("role", role || "");
            payload.append("password", password || "");
            if (file !== null) payload.append("profile_picture", file || "");

            const { data } = await post(url, payload, TOKEN);
            if (data?.status) {
                setIsShow(false);
                toast(data?.message, { hideProgressBar: true, containerId: "toastUser", type: "success" });
                setTimeout(() => router.refresh(), 1000);
            } else {
                toast(data?.message, { hideProgressBar: true, containerId: "toastUser", type: "warning" });
            }
        } catch (error) {
            console.log(error);
            toast("Something went wrong", { hideProgressBar: true, containerId: "toastUser", type: "error" });
        }
    };

    return (
        <div>
            <ToastContainer containerId="toastUser" />
            <ButtonSuccess type="button" onClick={() => openModal()}>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add User
                </div>
            </ButtonSuccess>
            <Modal isShow={isShow} onClose={(state) => setIsShow(state)}>
                <form onSubmit={handleSubmit}>
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-black text-2xl">Create New User</strong>
                                <small className="text-slate-400 text-sm">Admins can create user accounts here.</small>
                            </div>
                            <div className="ml-auto">
                                <button type="button" className="text-black" onClick={() => setIsShow(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <InputGroupComponent id="name" className="text-black" type="text" value={user.name} onChange={(val) => setUser({ ...user, name: val })} required={true} label="Name" />
                        <InputGroupComponent id="email" className="text-black" type="email" value={user.email} onChange={(val) => setUser({ ...user, email: val })} required={true} label="Email" />
                        <InputGroupComponent id="password" className="text-black" type="password" value={user.password} onChange={(val) => setUser({ ...user, password: val })} required={true} label="Password" />
                        <Select id="role" className="text-black" value={user.role} label="Role" required={true} onChange={(val) => setUser({ ...user, role: val })}>
                            <option value="">--- Select Role ---</option>
                            <option value="CASHIER">Cashier</option>
                            <option value="MANAGER">Manager</option>
                        </Select>
                        <FileInput acceptTypes={["image/png", "image/jpeg", "image/jpg"]} id="profile_picture" className="text-black" label="Upload Profile Picture (JPG/PNG)" onChange={(f) => setFile(f)} required={false} />
                    </div>

                    <div className="w-full p-5 flex rounded-b-2xl shadow">
                        <div className="flex ml-auto gap-2">
                            <ButtonDanger type="button" onClick={() => setIsShow(false)}>Cancel</ButtonDanger>
                            <ButtonPrimary type="submit">Save</ButtonPrimary>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
export default AddUser;