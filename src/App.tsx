
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import CashOnDelivery from "./pages/CashOnDelivery";
import PaymentCallback from "./pages/PaymentCallback";
import PaymentRedirect from "./pages/PaymentRedirect";
import OrderConfirmation from "./pages/OrderConfirmation";
import Cart from "./components/Cart";
import HairCare from "./pages/HairCare";
import LipCare from "./pages/LipCare";
import ProductsTable from "./pages/ProductsTable";
import Auth from "./pages/Auth";
import Account from "./pages/Account";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <Cart />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/hair-care" element={<HairCare />} />
              <Route path="/lip-care" element={<LipCare />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/cash-on-delivery" element={<CashOnDelivery />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />
              <Route path="/payment/redirect" element={<PaymentRedirect />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/products-table" element={<ProductsTable />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
