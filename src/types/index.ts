/**
 * Global types and interfaces for NØVA Frontend
 * Organized by feature/domain
 */

// ============== AUTH ==============
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

// ============== PRODUCT ==============
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  imageUrl: string;
  category: Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  slug: string;
  description: string;
  price: number | null;
  imageUrl: string;
  categoryId: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}

// ============== SERVICE ==============
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateServiceDTO {
  title: string;
  slug: string;
  description: string;
  icon: string;
}

export interface UpdateServiceDTO extends Partial<CreateServiceDTO> {
  id: string;
}

// ============== CONTACT ==============
export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// ============== ORDER ==============
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

// ============== API RESPONSES ==============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  message?: string;
}

// ============== HOOK RESULTS ==============
export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export interface UseServicesResult {
  services: Service[];
  loading: boolean;
  error: string | null;
}

export interface UseProductBySlugResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export interface UseAuthResult {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

// ============== COMPONENT PROPS ==============
export interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
