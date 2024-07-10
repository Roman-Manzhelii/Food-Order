import {createContext, useReducer} from "react";

const CartContext = createContext({
    items: [],
    addItem: () => {},
    removeItem: () => {},
    clearCart: () => {},
});

export function CartContextProvider({children}) {
    function cartReducer(state, action) {
        switch (action.type) {
            case 'ADD_ITEM': {
                const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id);
                const updatedItems = [...state.items];
                if (existingCartItemIndex > -1) {
                    const existingItem = state.items[existingCartItemIndex];
                    updatedItems[existingCartItemIndex] = {
                        ...existingItem,
                        quantity: existingItem.quantity + 1,
                    };
                } else {
                    updatedItems.push({ ...action.item, quantity: 1 });
                }
                return { ...state, items: updatedItems };
            }
            case 'REMOVE_ITEM': {
                const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
                const existingCartItem = state.items[existingCartItemIndex];
                const updatedItems = [...state.items];
                if (existingCartItem.quantity === 1) {
                    updatedItems.splice(existingCartItemIndex, 1);
                } else {
                    updatedItems[existingCartItemIndex] = {
                        ...existingCartItem,
                        quantity: existingCartItem.quantity - 1,
                    };
                }

                return { ...state, items: updatedItems };
            }
            case 'CLEAR_CART': {
                return {...state, items: []};
            }
            default:
                return state;
        }
    }

    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });
    function addItem(item) {
        dispatchCartAction({ type: 'ADD_ITEM', item });
    }
    function removeItem(id) {
        dispatchCartAction({ type: 'REMOVE_ITEM', id });
    }

    function clearCart() {
        dispatchCartAction({ type: 'CLEAR_CART' });
    }

    const cartContext = {
        items: cart.items,
        addItem,
        removeItem,
        clearCart
    };

    return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
}

export default CartContext;