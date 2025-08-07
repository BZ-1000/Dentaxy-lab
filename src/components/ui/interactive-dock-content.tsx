import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, PieChart, TrendingUp, Zap, Star, User, Gamepad2, ShoppingCart, Paintbrush, Home, ChevronRight, Cloud, Laptop, Shirt } from "lucide-react"

// Un componente simple para los avatares de los miembros
const MemberAvatar = () => (
  <img
    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
    src={`https://i.pravatar.cc/32?u=${Math.random()}`}
    alt="Member"
  />
);

const DockWithContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8", className)} {...props}>
        
        {/* Dock Flotante de Iconos (Barra Superior) */}
        <div className="w-full flex items-center justify-center mb-8">
          <div className="flex items-center gap-1 p-2 rounded-2xl bg-white shadow-md border border-gray-100">
            <div className="p-2 rounded-lg bg-indigo-100">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <PieChart className="w-5 h-5 text-gray-500" />
            </div>
             <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <TrendingUp className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Estadísticas</h1>
          <p className="text-blue-500">
            Hello <span className="font-medium">(colocar nombre de usuario)</span>, welcome back!
          </p>
        </div>

        {/* Layout Principal: Flexbox para Sidebar y Contenido */}
        <div className="flex flex-col lg:flex-row gap-6 max-w-screen-2xl mx-auto">
          
          {/* --- Columna Izquierda (Sidebar) --- */}
          <div className="w-full lg:w-[300px] lg:flex-shrink-0">
            {/* Section 7: Eventos y actualizaciones */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                {/* Placeholder para el logo */}
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">DA</div>
                <h3 className="font-semibold text-gray-800">Dental Basics Academy</h3>
              </div>

              <div className="flex items-center gap-2 mb-1">
                 <span className="bg-gray-100 text-gray-600 text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">7</span>
                 <h3 className="font-semibold text-gray-800">Eventos y actualizaciones</h3>
              </div>
              
              <div className="mt-4 space-y-6">
                <div>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-bold text-gray-800">20 September</div>
                      <div className="text-gray-400">Sunday</div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-md">All day</span>
                       <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                   <div className="font-medium text-gray-800 text-sm mb-2">Members</div>
                   <div className="flex items-center justify-between">
                     <div className="flex -space-x-2 overflow-hidden">
                       <MemberAvatar />
                       <MemberAvatar />
                       <MemberAvatar />
                       <MemberAvatar />
                       <MemberAvatar />
                       <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 text-xs font-semibold text-gray-600">
                         +8
                       </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-gray-400" />
                   </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                  <button className="w-full text-center py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100">Cancel</button>
                  <button className="w-full text-center py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">More</button>
              </div>
            </div>
          </div>

          {/* --- Columna Derecha (Contenido Principal) --- */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Section 1: Mi Productividad */}
              <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Mi Productividad</h2>
                    <p className="text-xs text-gray-400">Si aún no inicias sesión no podrás ver tu progreso</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">March 2020</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex gap-6">
                    <div className="flex flex-col justify-between text-right text-xs text-gray-400 py-4 h-48">
                      <span>260 M</span>
                      <span>220 M</span>
                      <span>180 M</span>
                      <span>140 M</span>
                    </div>
                    <div className="w-full h-48 relative">
                      <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="productivityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path 
                          d="M 0 100 C 50 120, 100 60, 150 80 S 250 50, 300 70 S 400 110, 450 90 L 500 100" 
                          fill="none" 
                          stroke="#6366F1" 
                          strokeWidth="2.5"
                        />
                        <path 
                          d="M 0 100 C 50 120, 100 60, 150 80 S 250 50, 300 70 S 400 110, 450 90 L 500 100 V 150 H 0 Z" 
                          fill="url(#productivityGradient)"
                          stroke="none"
                        />
                      </svg>
                      {/* Indicador de 17 min */}
                      <div className="absolute top-0 bottom-0" style={{left: '42%'}}>
                          <div className="relative w-full h-full flex flex-col items-center">
                            <div className="bg-white px-3 py-1 rounded-md shadow-lg text-sm font-bold text-gray-800 z-10">17 min</div>
                            <div className="w-px h-full border-l border-dashed border-indigo-400 -mt-2"></div>
                            <div className="absolute w-3 h-3 bg-indigo-600 border-2 border-white rounded-full" style={{top: '35%'}}></div>
                          </div>
                      </div>
                      <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
                        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                      </div>
                    </div>
                </div>
              </div>

              {/* Section 2: Goals */}
              <div className="md:col-span-3">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-600 text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">2</span>
                  <h3 className="text-lg font-semibold text-gray-800">Goals</h3>
                  <button className="ml-auto w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-white text-xl font-light hover:bg-yellow-500">+</button>
                </div>
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center">
                      <div className="text-2xl font-bold mb-1">$550</div>
                      <div className="text-xs text-gray-400 mb-3">12/20/20</div>
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mb-2">
                        <Home className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-sm font-medium text-gray-700">Holidays</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center">
                      <div className="text-2xl font-bold mb-1">$200</div>
                      <div className="text-xs text-gray-400 mb-3">12/20/20</div>
                      <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mb-2">
                        <Paintbrush className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="text-sm font-medium text-gray-700">Renovation</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center">
                      <div className="text-2xl font-bold mb-1">$820</div>
                      <div className="text-xs text-gray-400 mb-3">12/20/20</div>
                       <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mb-2">
                        <Gamepad2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="text-sm font-medium text-gray-700">Xbox</div>
                    </div>
                  </div>
                  <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow border flex items-center justify-center hover:bg-gray-100">
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Section 3: Transaction History */}
              <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                 <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-600 text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">3</span>
                  <h3 className="text-lg font-semibold text-gray-800">Transaction history</h3>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 text-xs text-gray-400 font-medium pb-2 border-b border-gray-100">
                    <span>Receiver</span>
                    <span className="text-center">Type</span>
                    <span className="text-center">Date</span>
                    <span className="text-right">Amount</span>
                  </div>
                  {[
                    { icon: <ShoppingCart className="w-5 h-5 text-gray-400" />, receiver: "Tesco Market", type: "Shopping", date: "13 Dec 2020", amount: "$75.67" },
                    { icon: <ShoppingCart className="w-5 h-5 text-gray-400" />, receiver: "ElectroMen Market", type: "Shopping", date: "14 Dec 2020", amount: "$250.00" },
                    { icon: <User className="w-5 h-5 text-gray-400" />, receiver: "Fiorgio Restaurant", type: "Food", date: "07 Dec 2020", amount: "$19.50" },
                    { icon: <User className="w-5 h-5 text-gray-400" />, receiver: "John-Mathew Kayne", type: "Sport", date: "06 Dec 2020", amount: "$350" },
                    { icon: <User className="w-5 h-5 text-gray-400" />, receiver: "Ann Martin", type: "Shopping", date: "31 Nov 2020", amount: "$430" },
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-center py-2 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">{item.icon}</div>
                        <span className="font-medium text-gray-700">{item.receiver}</span>
                      </div>
                      <span className="text-gray-500 text-center">{item.type}</span>
                      <span className="text-gray-500 text-center">{item.date}</span>
                      <span className="font-bold text-gray-800 text-right">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna Anidada para Secciones 4, 5, 6 */}
              <div className="md:col-span-1 flex flex-col gap-6">

                {/* Section 4: Outcome Statistics */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-600 text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">4</span>
                    <h3 className="text-lg font-semibold text-gray-800">Outcome Statistics</h3>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-lg">
                          <ShoppingCart className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="font-medium text-gray-700">Shopping</span>
                        <span className="ml-auto text-sm font-bold text-gray-800">52%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-orange-400 h-1.5 rounded-full" style={{width: '52%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-lg">
                          <Laptop className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="font-medium text-gray-700">Electronics</span>
                        <span className="ml-auto text-sm font-bold text-gray-800">21%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-400 h-1.5 rounded-full" style={{width: '21%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-sm">
                         <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                          <Shirt className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="font-medium text-gray-700">Towels</span>
                        <span className="ml-auto text-sm font-bold text-gray-800">74%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full" style={{width: '74%'}}></div></div>
                    </div>
                  </div>
                </div>

                {/* Section 5: Rating Modal */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                   <div className="flex items-center gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-600 text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">5</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-md font-semibold text-gray-800 mb-1">How would you rate the overall user experience of our App?</h3>
                    <p className="text-xs text-gray-400 mb-4">Do you find the app easy to use?</p>
                    <div className="flex justify-center gap-2 mb-5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-7 h-7 text-gray-300 cursor-pointer hover:text-yellow-400" fill="currentColor"/>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
                      <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Submit</button>
                    </div>
                  </div>
                </div>

                {/* Section 6: Get Great Loan */}
                <div className="bg-red-500 rounded-2xl shadow-sm text-white p-6 relative overflow-hidden">
                   <div className="absolute -right-8 -bottom-8 text-white/20">
                    <Cloud size={120}/>
                  </div>
                   <div className="flex items-center gap-2 mb-4 relative z-10">
                    <span className="bg-white/20 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">6</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4">Get great loan!</h3>
                    <button className="bg-white text-red-500 w-10 h-10 rounded-lg font-medium flex items-center justify-center text-xl hover:bg-gray-100">
                      <span>→</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

DockWithContent.displayName = "DockWithContent"

export { DockWithContent }