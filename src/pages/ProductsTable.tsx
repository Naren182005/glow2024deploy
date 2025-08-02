
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProductsTable = () => {
  const { products, loading, error, isUsingFallback, retryFetch } = useProducts();
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      // Extract all unique keys from all products
      const allKeys = new Set<string>();
      products.forEach(product => {
        Object.keys(product).forEach(key => {
          if (key !== 'description' && key !== 'image') { // Skip certain fields
            allKeys.add(key);
          }
        });
      });
      setHeaders(Array.from(allKeys));
    }
  }, [products]);

  const handleRetry = () => {
    if (retryFetch) {
      retryFetch();
    } else {
      window.location.reload();
    }
  };

  const formatCellValue = (value: any): string => {
    if (value === undefined || value === null) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Products Database</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              View all products from our database with their details.
            </p>
            
            {isUsingFallback && (
              <div className="mt-6 max-w-xl mx-auto">
                <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/30 text-amber-200">
                  <WifiOff className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-300">Database Connection Issue</AlertTitle>
                  <AlertDescription className="text-amber-200">
                    <p className="mb-2">We're currently showing locally stored product data due to connection issues.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRetry} 
                      className="bg-amber-500/10 border-amber-500/30 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 mt-1"
                    >
                      <RefreshCw size={14} className="mr-1" /> Retry Connection
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {!isUsingFallback && !loading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                <Wifi size={16} />
                <span className="text-sm">Connected to product database</span>
              </div>
            )}
          </div>
          
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableCaption>A list of all products in our database</TableCaption>
                  <TableHeader>
                    <TableRow className="border-b border-white/10 bg-black/40">
                      {headers.map((header) => (
                        <TableHead key={header} className="text-white font-medium">
                          {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, i) => (
                      <TableRow 
                        key={product.id || i} 
                        className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-black/40' : 'bg-black/20'} hover:bg-white/5`}
                      >
                        {headers.map(header => (
                          <TableCell key={`${product.id || i}-${header}`} className="text-white/80">
                            {formatCellValue(product[header as keyof typeof product])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductsTable;
