
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';

const Account = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/auth', { state: { from: '/account' } });
      return;
    }
    
    // Fetch user orders
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      processing: 'bg-blue-500/20 text-blue-300',
      paid: 'bg-green-500/20 text-green-300',
      shipped: 'bg-indigo-500/20 text-indigo-300',
      delivered: 'bg-green-500/20 text-green-300',
      cancelled: 'bg-red-500/20 text-red-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status] || 'bg-gray-500/20 text-gray-300'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </button>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 space-y-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <User size={24} className="text-white/70" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{profile?.full_name || user?.email}</h3>
                  <p className="text-white/60 text-sm">{user?.email}</p>
                </div>
              </div>
              
              <ul className="space-y-2">
                <li>
                  <button 
                    className="w-full text-left px-3 py-2 rounded-md text-white bg-white/10 flex items-center"
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    My Orders
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-white/70 hover:bg-white/5 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>
              
              {isLoading ? (
                <div className="text-white/60 text-center py-8">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                  <p>You haven't placed any orders yet.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 py-2 px-4 bg-[#F2A83B] text-black rounded-md font-medium hover:bg-[#F2A83B]/90 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/70">Order #</TableHead>
                        <TableHead className="text-white/70">Date</TableHead>
                        <TableHead className="text-white/70">Status</TableHead>
                        <TableHead className="text-white/70">Items</TableHead>
                        <TableHead className="text-white/70 text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map(order => {
                        const orderItems = order.order_items || [];
                        const itemCount = orderItems.length;
                        
                        // Extract the last 6 characters of the order ID to use as order number
                        const orderId = order.id.toString();
                        const orderNumber = orderId.substring(orderId.length - 6);
                        
                        return (
                          <TableRow key={order.id} className="border-white/10">
                            <TableCell className="text-white">{orderNumber}</TableCell>
                            <TableCell className="text-white/80">{formatDate(order.created_at)}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell className="text-white/80">
                              {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </TableCell>
                            <TableCell className="text-white font-medium text-right">
                              ₹{parseFloat(order.total).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
