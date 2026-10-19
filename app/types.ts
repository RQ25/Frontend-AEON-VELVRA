export interface IMenu {
    menuId: number,
    uuid: string,
    name: string,
    price: number,
    picture: string,
    description : string,
    category: string,
    createdAt: string,
    updatedAt: string
}

export interface IUser {
    userId: number,
    uuid: string,
    name: string,
    email: string,
    password: string,
    profile_picture: string,
    role: string
    createdAt: string,
    updatedAt: string
}

export interface ICart {
    menuId: number;
    name: string;
    price: number;
    quantity: number;
    note: string;
  }