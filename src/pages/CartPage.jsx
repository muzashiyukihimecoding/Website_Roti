import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../redux/cartSlice';
import { Link } from 'react-router-dom';
import { Trash2, Edit3, ArrowLeft, ArrowRight, MinusCircle, PlusCircle, Check } from 'lucide-react';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);

  // State: menyimpan catatan per item (key = item.id)
  const [notes, setNotes] = useState({});
  // State: menyimpan item mana yang sedang tampilkan input note (key = item.id)
  const [activeNoteId, setActiveNoteId] = useState(null);
  // State: nilai sementara saat user mengetik
  const [draftNote, setDraftNote] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0
    }).format(price).replace(/\s/g, '.');
  };

  const handleQuantityUpdate = (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty >= 1) {
      dispatch(cartActions.updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleOpenNote = (itemId) => {
    setDraftNote(notes[itemId] || '');
    setActiveNoteId(itemId);
  };

  const handleSaveNote = (itemId) => {
    setNotes(prev => ({ ...prev, [itemId]: draftNote }));
    setActiveNoteId(null);
  };

  const handleCancelNote = () => {
    setActiveNoteId(null);
    setDraftNote('');
  };

  const handlePurchase = async () => {
    const phoneNumber = "6285742384630"; // Nomor WhatsApp Admin d'Bakery
    let message = "Halo d'Bakery, saya ingin memesan:\n\n";
    let orderDetailsText = "";
    
    cartItems.forEach((item, index) => {
      let line = `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${formatPrice(item.totalPrice)}`;
      message += line;
      orderDetailsText += line + "\n";
      // Tambahkan catatan jika ada
      if (notes[item.id] && notes[item.id].trim() !== '') {
        let noteLine = `   📝 Catatan: ${notes[item.id]}`;
        message += `\n${noteLine}`;
        orderDetailsText += `${noteLine}\n`;
      }
      message += '\n';
    });
    
    message += `\n*Total Pembayaran: Rp ${formatPrice(totalAmount)}*\n\nMohon informasi ketersediaan dan panduan pembayarannya. Terima kasih!`;
    
    // Simpan pesanan ke database
    try {
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_details: orderDetailsText.trim(),
          total_amount: totalAmount
        })
      });
      if (!res.ok) {
        console.error("Gagal menyimpan pesanan ke database.");
      }
    } catch (err) {
      console.error("Error saving order:", err);
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white min-h-[70vh] pb-20 pt-8 border-b-[8px] border-brand-primary">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <h1 className="text-[28px] text-[#985827] mb-2 font-medium">Cart</h1>
        <div className="text-[13px] text-gray-900 font-bold mb-8">
          <Link to="/" className="hover:text-brand-primary">Home</Link> <span className="font-normal text-gray-500 mx-1">/</span> <span className="font-normal">Cart</span>
        </div>

        {/* Promo Banner */}
        <div className="border-[1.5px] border-[#985827] p-5 text-center mb-10">
          <h2 className="text-[18px] text-[#985827] font-medium uppercase tracking-wide">DELIVERY HOUR</h2>
          <p className="text-[16px] text-[#985827] font-medium mt-1 tracking-wide">Monday - Sunday: 07.00 AM - 21.00 PM</p>
        </div>

        {/* Cart Table Area */}
        <div className="border border-gray-200">
          {cartItems.map((item, index) => (
            <div key={item.id} className={`flex flex-col md:flex-row ${index > 0 ? 'border-t border-gray-200' : ''}`}>
              {/* Product Info (Left) */}
              <div className="flex-1 flex p-4 gap-4">
                <img src={item.image} alt={item.name} className="w-[100px] h-[100px] object-cover flex-shrink-0" />
                <div className="flex flex-col justify-start w-full">
                  <h3 className="text-[#985827] text-[16px] font-medium leading-tight mb-2">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => handleQuantityUpdate(item.id, item.quantity, -1)} className="hover:scale-105 transition-transform">
                      <MinusCircle size={20} fill="#985827" color="white" />
                    </button>
                    <div className="w-[40px] h-[26px] border border-gray-300 flex items-center justify-center text-[13px] font-bold">
                      {item.quantity}
                    </div>
                    <button onClick={() => handleQuantityUpdate(item.id, item.quantity, 1)} className="hover:scale-105 transition-transform">
                      <PlusCircle size={20} fill="#985827" color="white" />
                    </button>
                    <span className="text-[12px] font-bold text-gray-900 ml-1">x Rp {formatPrice(item.price)}</span>
                  </div>

                  {/* Note Input Area */}
                  {activeNoteId === item.id ? (
                    <div className="flex items-center gap-2 mb-2 w-full max-w-sm">
                      <input
                        type="text"
                        autoFocus
                        value={draftNote}
                        onChange={(e) => setDraftNote(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveNote(item.id);
                          if (e.key === 'Escape') handleCancelNote();
                        }}
                        placeholder="Tulis catatan pesanan..."
                        className="flex-1 h-[32px] border border-[#985827] px-2 text-[12px] text-gray-700 outline-none focus:ring-1 focus:ring-[#985827]"
                      />
                      <button
                        onClick={() => handleSaveNote(item.id)}
                        className="text-[11px] font-bold text-[#985827] hover:opacity-80 uppercase tracking-wide flex items-center gap-1"
                      >
                        <Check size={12} strokeWidth={3} /> SAVE
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Tampilkan saved note jika ada */}
                      {notes[item.id] && notes[item.id].trim() !== '' && (
                        <div className="mb-2 flex items-start gap-1 max-w-sm">
                          <Edit3 size={11} className="text-gray-400 mt-[2px] flex-shrink-0" />
                          <p className="text-[11px] text-gray-500 italic leading-snug">{notes[item.id]}</p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex flex-col gap-[6px] items-start">
                    <button
                      onClick={() => handleOpenNote(item.id)}
                      className="flex items-center gap-1 text-[#985827] hover:opacity-80 text-[11px] font-bold uppercase tracking-wide"
                    >
                      <Edit3 size={12} strokeWidth={3} /> NOTE
                    </button>
                    <button onClick={() => dispatch(cartActions.removeFromCart(item.id))} className="flex items-center gap-1 text-[#985827] hover:opacity-80 text-[11px] font-bold uppercase tracking-wide">
                      <Trash2 size={12} strokeWidth={3} /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtotal (Right) */}
              <div className="md:w-[220px] p-4 border-t md:border-t-0 md:border-l border-gray-200 bg-[#fbfbfb]">
                <p className="text-[12px] text-gray-900 font-bold mb-1 line-clamp-1">Sub Total</p>
                <p className="text-[14px] font-normal text-gray-900">Rp {formatPrice(item.totalPrice)}</p>
              </div>
            </div>
          ))}

          {cartItems.length === 0 && (
            <div className="p-10 text-center text-gray-500 text-sm">
               Your cart is empty. Please add items from the menu.
            </div>
          )}

          {/* Table Footer (Total & Delete All) */}
          {cartItems.length > 0 && (
            <div className="flex flex-col md:flex-row border-t border-gray-200">
              <div className="flex-1 p-4 flex flex-col justify-center items-start pt-[10px]">
                 <span className="font-bold text-[13px] text-gray-900 mb-2">Total</span>
                 <button onClick={() => dispatch(cartActions.clearCart())} className="flex items-center gap-1 text-[#985827] hover:opacity-80 text-[11px] font-bold uppercase tracking-wide">
                   <Trash2 size={12} strokeWidth={3} /> Delete
                 </button>
              </div>
              <div className="md:w-[220px] p-4 border-t md:border-t-0 md:border-l border-gray-200 bg-[#fbfbfb] flex items-center">
                 <span className="text-[16px] text-gray-900">Rp {formatPrice(totalAmount)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-12 px-2">
          <Link
            to="/menu"
            className="group flex items-center gap-2 font-bold text-gray-700 hover:text-[#985827] hover:bg-gray-100 px-4 py-2 transition-all duration-300 text-[13px]"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              <ArrowLeft size={16} />
            </span>
            Go to shop
          </Link>
          {cartItems.length > 0 && (
            <button
              onClick={handlePurchase}
              className="group flex items-center gap-2 font-bold text-gray-800 border border-gray-300 bg-transparent px-8 py-3 text-[13px] transition-all duration-300 hover:bg-[#985827] hover:text-white hover:border-[#985827] hover:shadow-md active:scale-95"
            >
              <span>Purchase Now</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CartPage;

