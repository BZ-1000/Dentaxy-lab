import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, PieChart, TrendingUp, Zap, Star, User, Mountain, Gamepad2, ShoppingCart, Truck, Plane } from "lucide-react"

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
}

interface DockWithContentProps {
  className?: string;
}

const DockWithContent = React.forwardRef<HTMLDivElement, DockWithContentProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className="w-full min-h-screen bg-gray-50 p-6">
        {/* Dock */}
        <div className="w-full flex items-center justify-center mb-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={floatingAnimation}
            className="flex items-center gap-2 p-3 rounded-2xl bg-white shadow-lg border"
          >
            <div className="p-2 rounded-lg bg-blue-100">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-100">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-100">
              <PieChart className="w-5 h-5 text-gray-600" />
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-100">
              <Zap className="w-5 h-5 text-gray-600" />
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-100">
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
          </motion.div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Estadísticas</h1>
          <p className="text-blue-500">
            Hello <span className="font-medium">(colocar nombre de usuario)</span>, welcome back!
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          
          {/* Section 1: Mi Productividad */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">1</span>
                  <h3 className="text-sm font-medium text-gray-700">Tiempo de actividad</h3>
                </div>
                <h2 className="text-xl font-semibold">Mi Productividad</h2>
                <p className="text-xs text-gray-500">Si aún no inicias sesión no podrás ver tu progreso</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">March 2020</div>
                <div className="text-2xl font-bold text-purple-600">17 min</div>
                <div className="text-xs text-gray-500">May</div>
              </div>
            </div>
            
            <div className="h-48 relative">
              <svg className="w-full h-full" viewBox="0 0 400 150">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M 20 120 Q 80 80 120 90 T 200 70 T 280 85 T 350 75 L 350 140 L 20 140 Z" 
                  fill="url(#gradient)" 
                  stroke="#8B5CF6" 
                  strokeWidth="2"
                />
                <path 
                  d="M 20 120 Q 80 80 120 90 T 200 70 T 280 85 T 350 75" 
                  fill="none" 
                  stroke="#8B5CF6" 
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute bottom-2 left-0 right-0 flex justify-between text-xs text-gray-400 px-4">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
              </div>
            </div>
          </div>

          {/* Section 2: Goals */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">2</span>
              <h3 className="text-lg font-semibold">Goals</h3>
              <button className="ml-auto w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">+</button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="text-2xl font-bold mb-1">$550</div>
                <div className="text-xs text-gray-500 mb-2">12/20/20</div>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <Mountain className="w-4 h-4 text-blue-500" />
                  Holidays
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="text-2xl font-bold mb-1">$200</div>
                <div className="text-xs text-gray-500 mb-2">12/20/20</div>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  Renovation
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="text-2xl font-bold mb-1">$820</div>
                <div className="text-xs text-gray-500 mb-2">12/15/20</div>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <Gamepad2 className="w-4 h-4 text-green-500" />
                  Xbox
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Transaction History */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">3</span>
              <h3 className="text-lg font-semibold">Transaction history</h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-4 text-xs text-gray-500 border-b pb-2">
                <span>Receiver</span>
                <span>Type</span>
                <span>Date</span>
                <span>Amount</span>
              </div>
              
              <div className="grid grid-cols-4 items-center py-2 text-sm">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Tesco Market</span>
                </div>
                <span className="text-gray-500">Shopping</span>
                <span className="text-gray-500">13 Dec 2020</span>
                <span className="font-medium">$75.67</span>
              </div>
              
              <div className="grid grid-cols-4 items-center py-2 text-sm">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>ElectroMen Market</span>
                </div>
                <span className="text-gray-500">Shopping</span>
                <span className="text-gray-500">14 Dec 2020</span>
                <span className="font-medium">$250.00</span>
              </div>
              
              <div className="grid grid-cols-4 items-center py-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Fiorgio Restaurant</span>
                </div>
                <span className="text-gray-500">Food</span>
                <span className="text-gray-500">07 Dec 2020</span>
                <span className="font-medium">$19.50</span>
              </div>
              
              <div className="grid grid-cols-4 items-center py-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>John Mathew Kayne</span>
                </div>
                <span className="text-gray-500">Sport</span>
                <span className="text-gray-500">06 Dec 2020</span>
                <span className="font-medium">$350</span>
              </div>
              
              <div className="grid grid-cols-4 items-center py-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Ann Martin</span>
                </div>
                <span className="text-gray-500">Shopping</span>
                <span className="text-gray-500">31 Nov 2020</span>
                <span className="font-medium">$430</span>
              </div>
            </div>
          </div>

          {/* Section 4: Outcome Statistics */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">4</span>
              <h3 className="text-lg font-semibold">Outcome Statistics</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Shopping</span>
                  <span className="ml-auto text-sm font-medium">52%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full" style={{width: '52%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Electronics</span>
                  <span className="ml-auto text-sm font-medium">21%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '21%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Travels</span>
                  <span className="ml-auto text-sm font-medium">74%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '74%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Rating Modal */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">5</span>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">How would you rate the overall user experience of our App?</h3>
              <p className="text-sm text-gray-500 mb-4">Do you find the app easy to use?</p>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-gray-300" />
                ))}
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 text-gray-600 border rounded-lg text-sm">Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Submit</button>
              </div>
            </div>
          </div>

          {/* Section 6: Get Great Loan */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl shadow-sm text-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">6</span>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Get great loan!</h3>
            <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              <span>→</span>
            </button>
          </div>

          {/* Section 7: Eventos y actualizaciones */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">7</span>
              <h3 className="text-lg font-semibold text-blue-600">Eventos y actualizaciones</h3>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">20 September</div>
              <div className="text-sm text-gray-500">Sunday</div>
              <div className="flex gap-2 mt-2">
                <button className="text-xs bg-gray-100 px-2 py-1 rounded">All day</button>
                <button className="text-xs text-gray-500">→</button>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Members</div>
              <div className="flex -space-x-2">
                {[1,2,3,4,5,6,7,8].map((i) => (
                  <div key={i} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <button className="text-xs text-gray-500 mt-2">→</button>
            </div>
          </div>

        </div>
      </div>
    )
  }
)
DockWithContent.displayName = "DockWithContent"

export { DockWithContent }