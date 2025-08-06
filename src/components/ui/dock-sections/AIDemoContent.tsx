import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Send, Sparkles, Brain, MessageSquare, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

const demoMessages = [
  {
    type: 'user',
    content: 'Paciente masculino de 45 años con dolor en molar superior derecho, sensibilidad al frío y calor',
    timestamp: '10:30 AM'
  },
  {
    type: 'ai',
    content: 'Basado en los síntomas descritos, sugiero evaluar: pulpitis reversible/irreversible, caries profunda, o fractura dental. Recomiendo examen clínico detallado, pruebas de vitalidad pulpar y radiografía periapical para confirmar diagnóstico.',
    timestamp: '10:30 AM',
    suggestions: [
      'Realizar prueba de vitalidad',
      'Radiografía periapical',
      'Evaluar profundidad de caries'
    ]
  }
]

export const AIDemoContent: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const [demoStep, setDemoStep] = useState(0)

  const handleStartDemo = () => {
    setShowDemo(true)
    setDemoStep(0)
    setTimeout(() => setDemoStep(1), 1000)
    setTimeout(() => setDemoStep(2), 3000)
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-[600px]">
      {/* Panel de Control y Características */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        {/* Características de la IA */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">Capacidades de la IA</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-blue-800">Análisis de Síntomas</p>
                <p className="text-xs text-blue-600">Interpreta descripciones clínicas complejas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-800">Sugerencias Diagnósticas</p>
                <p className="text-xs text-green-600">Propone diagnósticos diferenciales basados en evidencia</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium text-purple-800">Planes de Tratamiento</p>
                <p className="text-xs text-purple-600">Genera protocolos personalizados</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-medium text-orange-800">Entrada por Voz</p>
                <p className="text-xs text-orange-600">Transcripción automática de dictado médico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Control */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
          <h3 className="font-semibold text-primary mb-4">Probar Demo Interactiva</h3>
          
          <div className="space-y-4">
            <Button 
              onClick={handleStartDemo}
              className="w-full"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Demo
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Mic className="w-4 h-4 mr-1" />
                Voz
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Texto
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas de Rendimiento */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Rendimiento de la IA</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">97.8%</p>
              <p className="text-xs text-muted-foreground">Precisión</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">2.3s</p>
              <p className="text-xs text-muted-foreground">Respuesta</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">15k+</p>
              <p className="text-xs text-muted-foreground">Casos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">24/7</p>
              <p className="text-xs text-muted-foreground">Disponible</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat Demo Interface */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">Asistente IA Dental</h3>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            En línea
          </Badge>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <AnimatePresence>
            {showDemo && (
              <>
                {demoStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[80%] bg-primary text-primary-foreground rounded-lg p-3">
                      <p className="text-sm">{demoMessages[0].content}</p>
                      <p className="text-xs opacity-70 mt-1">{demoMessages[0].timestamp}</p>
                    </div>
                  </motion.div>
                )}

                {demoStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Dentaxy IA</span>
                      </div>
                      <p className="text-sm text-gray-800">{demoMessages[1].content}</p>
                      <div className="mt-3 space-y-1">
                        {demoMessages[1].suggestions?.map((suggestion, index) => (
                          <Badge key={index} variant="outline" className="mr-1 text-xs">
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{demoMessages[1].timestamp}</p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>

          {!showDemo && (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Inicia el demo para ver la IA en acción</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Textarea
              placeholder="Describe los síntomas del paciente..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="flex-1 min-h-[60px] resize-none"
            />
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Pause className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Presiona el micrófono para dictar o escribe directamente
          </p>
        </div>
      </motion.div>
    </div>
  )
}