import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  image: string;
  uploaderId: string;
  uploaderName: string;
  status: 'available' | 'swapped';
  isApproved: boolean;
  createdAt: Date;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  requestedItemId: string;
  offeredItemId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  requestedItem: Item;
  offeredItem: Item;
}

interface ItemContextType {
  items: Item[];
  swapRequests: SwapRequest[];
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  createSwapRequest: (requestedItemId: string, offeredItemId: string, fromUserId: string, toUserId: string) => void;
  updateSwapRequest: (id: string, status: 'accepted' | 'rejected') => void;
  getItemsByUser: (userId: string) => Item[];
  getSwapRequestsByUser: (userId: string) => { incoming: SwapRequest[]; outgoing: SwapRequest[] };
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};

// Mock data for demonstration
const mockItems: Item[] = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket in excellent condition. Perfect for layering.',
    category: 'Outerwear',
    type: 'Jacket',
    size: 'M',
    condition: 'Excellent',
    tags: ['vintage', 'denim', 'casual'],
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    uploaderId: '2',
    uploaderName: 'Sarah',
    status: 'available',
    isApproved: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Summer Floral Dress',
    description: 'Beautiful floral pattern dress, perfect for summer occasions.',
    category: 'Dresses',
    type: 'Casual Dress',
    size: 'S',
    condition: 'Good',
    tags: ['floral', 'summer', 'feminine'],
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    uploaderId: '3',
    uploaderName: 'Emily',
    status: 'available',
    isApproved: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Leather Boots',
    description: 'Genuine leather boots with minimal wear. Great for autumn/winter.',
    category: 'Shoes',
    type: 'Boots',
    size: '8',
    condition: 'Very Good',
    tags: ['leather', 'boots', 'winter'],
    image: 'https://images.pexels.com/photos/1566909/pexels-photo-1566909.jpeg',
    uploaderId: '4',
    uploaderName: 'Alex',
    status: 'available',
    isApproved: true,
    createdAt: new Date('2024-01-25'),
  },
];

interface ItemProviderProps {
  children: ReactNode;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);

  const addItem = (newItem: Omit<Item, 'id' | 'createdAt'>) => {
    const item: Item = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setItems(prev => [...prev, item]);
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const createSwapRequest = (requestedItemId: string, offeredItemId: string, fromUserId: string, toUserId: string) => {
    const requestedItem = items.find(item => item.id === requestedItemId);
    const offeredItem = items.find(item => item.id === offeredItemId);
    
    if (requestedItem && offeredItem) {
      const swapRequest: SwapRequest = {
        id: Date.now().toString(),
        fromUserId,
        toUserId,
        requestedItemId,
        offeredItemId,
        status: 'pending',
        createdAt: new Date(),
        requestedItem,
        offeredItem,
      };
      setSwapRequests(prev => [...prev, swapRequest]);
    }
  };

  const updateSwapRequest = (id: string, status: 'accepted' | 'rejected') => {
    setSwapRequests(prev => prev.map(request => 
      request.id === id ? { ...request, status } : request
    ));
    
    if (status === 'accepted') {
      const request = swapRequests.find(r => r.id === id);
      if (request) {
        updateItem(request.requestedItemId, { status: 'swapped' });
        updateItem(request.offeredItemId, { status: 'swapped' });
      }
    }
  };

  const getItemsByUser = (userId: string) => {
    return items.filter(item => item.uploaderId === userId);
  };

  const getSwapRequestsByUser = (userId: string) => {
    const incoming = swapRequests.filter(request => request.toUserId === userId);
    const outgoing = swapRequests.filter(request => request.fromUserId === userId);
    return { incoming, outgoing };
  };

  const value = {
    items,
    swapRequests,
    addItem,
    updateItem,
    deleteItem,
    createSwapRequest,
    updateSwapRequest,
    getItemsByUser,
    getSwapRequestsByUser,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};