
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const createOrderInDatabase = async (
  userId: string | undefined,
  orderId: string,
  orderDetails: {
    grandTotal: number;
    shippingAddress: string;
    paymentMethod: 'gpay' | 'cod';
  }
) => {
  if (!userId) return null;

  try {
    // Create the order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
        total: orderDetails.grandTotal,
        shipping_address: orderDetails.shippingAddress,
        payment_method: orderDetails.paymentMethod,
        status: orderDetails.paymentMethod === 'cod' ? 'pending' : 'processing'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }
    
    return order;
  } catch (dbError) {
    console.error('Database error creating order:', dbError);
    return null;
  }
};

export const createOrderItems = async (orderId: string, items: any[]) => {
  try {
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating order items:', error);
    return false;
  }
};

export const createPaymentTransaction = async (
  orderId: string,
  amount: number,
  paymentMethod: 'gpay' | 'cod'
) => {
  try {
    const { data: transaction, error } = await supabase
      .from('payment_transactions')
      .insert({
        order_id: orderId,
        amount: amount,
        payment_gateway: paymentMethod,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment transaction:', error);
      return null;
    }
    
    return transaction;
  } catch (error) {
    console.error('Error creating payment transaction:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};
