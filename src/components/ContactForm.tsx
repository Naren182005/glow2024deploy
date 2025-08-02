
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      });
    }, 1500);
  };
  
  return (
    <section id="contact" className="section-padding bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h5 className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium tracking-wider text-white/90 mb-4">
              GET IN TOUCH
            </h5>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Have questions about our products or need personalized recommendations? 
              Fill out the form below and our team will reach out to you.
            </p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-white/90 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-white/90 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="address" className="block text-white/90 font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your street address"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-white/90 font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your city"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="state" className="block text-white/90 font-medium">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your state"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="pincode" className="block text-white/90 font-medium">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your pincode"
                  />
                </div>
              </div>
              
              <div className="text-center pt-4">
                <button 
                  type="submit" 
                  className="button-primary w-full md:w-auto min-w-[200px]"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
