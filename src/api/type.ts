export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  sellerName: string;
  sellerId: string;
}

export interface UserData {
  userId: string | null;
  userName: string | null;
  email: string | null;
  userRole: string | null;
}

export interface UserState {
  isLogged: boolean;
  email: string | null;
  username: string | null;
  userId: string | null;
  userRole: string | null;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
