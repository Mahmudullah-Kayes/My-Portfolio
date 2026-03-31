"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { 
  MessageSquare, 
  Lightbulb, 
  Code, 
  TestTube, 
  Rocket, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const workSteps = [
  {
    id: 1,
    title: "Discovery",
    description: "I start by understanding your vision, goals, and requirements to create a solid foundation for your project.",
    keyPoints: [
      "Project scope & requirements analysis",
      "Target audience research",
      "Timeline & budget planning",
      "Technology stack selection"
    ],
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    iconBg: "bg-blue-500/20",
    animation: "/animation/discovery.lottie"
  },
  {
    id: 2,
    title: "Planning",
    description: "I create detailed wireframes, design mockups, and plan the technical architecture for optimal user experience.",
    keyPoints: [
      "User experience (UX) design",
      "Wireframes & prototypes",
      "Database architecture planning",
      "API structure design"
    ],
    icon: Lightbulb,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    iconBg: "bg-purple-500/20",
    animation: "/animation/planing.lottie"
  },
  {
    id: 3,
    title: "Design",
    description: "I craft beautiful, modern interfaces that align with your brand and provide excellent user experience.",
    keyPoints: [
      "UI/UX design implementation",
      "Responsive design principles",
      "Brand consistency",
      "Design system creation"
    ],
    icon: Code,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    iconBg: "bg-green-500/20",
    animation: "/animation/design.lottie"
  },
  {
    id: 4,
    title: "Development",
    description: "I build your application using modern technologies and best practices, keeping you updated with regular progress reports.",
    keyPoints: [
      "Clean, maintainable code",
      "Modern tech stack implementation",
      "Performance optimization",
      "Security best practices"
    ],
    icon: TestTube,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    iconBg: "bg-orange-500/20",
    animation: "/animation/development.lottie"
  },
  {
    id: 5,
    title: "Testing",
    description: "Thorough testing across devices and browsers ensures everything works perfectly before launch.",
    keyPoints: [
      "Cross-browser compatibility",
      "Mobile responsiveness testing",
      "Performance & speed testing",
      "User acceptance testing"
    ],
    icon: Rocket,
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    iconBg: "bg-red-500/20",
    animation: "/animation/testing.lottie"
  },
  {
    id: 6,
    title: "Deploy",
    description: "Your project goes live! I handle deployment, domain setup, and provide ongoing support and maintenance.",
    keyPoints: [
      "Production deployment",
      "Domain & hosting setup",
      "SSL certificate installation",
      "Ongoing maintenance & support"
    ],
    icon: Users,
    color: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    iconBg: "bg-indigo-500/20",
    animation: "/animation/deploy.lottie"
  }
];

const HowIWork = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.35 });

  useEffect(() => {
    if (!isSectionInView || hasStarted) return;
    setCurrentStep(0);
    setIsPlaying(true);
    setHasStarted(true);
  }, [isSectionInView, hasStarted]);

  // Auto-advance steps
  useEffect(() => {
    if (!hasStarted || !isPlaying || shouldReduceMotion) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % workSteps.length);
    }, 5000); // Change step every 5 seconds

    return () => clearInterval(interval);
  }, [hasStarted, isPlaying, shouldReduceMotion]);

  const currentStepData = workSteps[currentStep];

  return (
    <section ref={sectionRef} id="how-i-work" className="relative py-24 overflow-hidden bg-transparent">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-indigo-600/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-teal-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 1, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-teal-600/30 bg-gradient-to-r from-teal-900/25 to-indigo-900/25 px-4 py-1">
            <span className="text-sm font-medium text-teal-300">My Process</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            How I Work
          </h2>
          <div className="mx-auto mb-6 h-0.5 w-20 bg-gradient-to-r from-teal-400 to-indigo-500"></div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            My proven 6-step process ensures your project is delivered on time, on budget, and exceeds your expectations.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Stunning Steps Row */}
          <motion.div
            initial={{ opacity: 1, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 relative"
          >
            {/* Background Glow Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/4 h-96 w-96 -translate-y-1/2 transform rounded-full bg-teal-500/10 blur-3xl"></div>
              <div className="absolute top-1/2 right-1/4 h-96 w-96 -translate-y-1/2 transform rounded-full bg-indigo-500/10 blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
              {/* Enhanced Circular Steps */}
               <div className="relative">
                 {/* Connection Line with Progress Animation */}
                 <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-full h-0.5 hidden max-w-[calc(80rem-320px)] lg:block">
                   <div className="relative w-full h-full bg-slate-700/30">
                     <motion.div
                       className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 via-indigo-500 to-emerald-400"
                       initial={{ width: "0%" }}
                       animate={{ 
                         width: `${(currentStep / (workSteps.length - 1)) * 100}%` 
                       }}
                       transition={{ duration: 0.8, ease: "easeInOut" }}
                     />
                     
                     {/* Enhanced Processing Dot */}
                     {isPlaying && !shouldReduceMotion && (
                       <motion.div
                         className="absolute top-1/2 w-2 h-2 -translate-y-1/2 transform rounded-full border border-teal-300 bg-white shadow-lg"
                         animate={{
                           left: `${(currentStep / (workSteps.length - 1)) * 100}%`,
                           x: '-50%',
                           scale: [1, 1.2, 1]
                         }}
                         transition={{ 
                           left: { duration: 0.8, ease: "easeInOut" },
                           x: { duration: 0.8, ease: "easeInOut" },
                           scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                         }}
                       />
                     )}
                   </div>
                 </div>

                 {/* Steps Container */}
                 <div className="flex justify-between items-center max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 flex-wrap lg:flex-nowrap">
                   {workSteps.map((step, index) => (
                     <motion.div
                       key={step.id}
                       initial={{ opacity: 1, scale: 1, y: 30 }}
                       whileInView={{ opacity: 1, scale: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ 
                         duration: 0.6, 
                         delay: index * 0.15,
                         type: "spring",
                         stiffness: 200,
                         damping: 20
                       }}
                       className="relative group flex flex-col items-center mx-0.5 sm:mx-1 lg:mx-0"
                     >
                                              <motion.button
                         onClick={() => {
                           setCurrentStep(index);
                           setIsPlaying(false);
                         }}
                         className="relative"
                         whileTap={{ scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                       >
                         {/* Enhanced Clean Circle - Responsive sizing */}
                         <motion.div 
                           className={`w-8 sm:w-10 lg:w-14 h-8 sm:h-10 lg:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                             index === currentStep
                               ? 'bg-white text-slate-900 shadow-xl'
                               : index < currentStep
                               ? 'bg-emerald-500 text-white shadow-lg'
                               : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
                           }`}
                           animate={{
                             scale: index === currentStep ? 1.1 : 1,
                             y: index === currentStep ? -2 : 0,
                           }}
                           transition={{ 
                             duration: 0.5, 
                             ease: "easeOut",
                             type: "spring",
                             stiffness: 300
                           }}
                         >
                           {/* Icon with enhanced animation */}
                           {index < currentStep ? (
                             <motion.div
                               initial={{ scale: 0, rotate: -180 }}
                               animate={{ scale: 1, rotate: 0 }}
                               transition={{ 
                                 duration: 0.6, 
                                 ease: "easeOut",
                                 type: "spring",
                                 stiffness: 200 
                               }}
                             >
                               <CheckCircle className="w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6" />
                             </motion.div>
                           ) : index === currentStep && !shouldReduceMotion ? (
                             <motion.div
                               animate={{ 
                                 scale: [1, 1.1, 1],
                                 rotate: [0, 5, -5, 0]
                               }}
                               transition={{ 
                                 duration: 2, 
                                 repeat: Infinity, 
                                 ease: "easeInOut",
                                 times: [0, 0.3, 0.7, 1]
                               }}
                             >
                               <step.icon className="w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6" />
                             </motion.div>
                           ) : (
                             <step.icon className="w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6" />
                           )}
                           
                           {/* Enhanced Active Glow */}
                           {index === currentStep && !shouldReduceMotion && (
                             <>
                               <motion.div
                                 className="absolute inset-0 rounded-full bg-white/20"
                                 animate={{ 
                                   scale: [1, 1.4, 1],
                                   opacity: [0, 0.4, 0]
                                 }}
                                 transition={{ 
                                   duration: 2, 
                                   repeat: Infinity, 
                                   ease: "easeInOut"
                                 }}
                               />
                               <motion.div
                                 className="absolute inset-0 rounded-full bg-teal-300/20"
                                 animate={{ 
                                   scale: [1, 1.6, 1],
                                   opacity: [0, 0.2, 0]
                                 }}
                                 transition={{ 
                                   duration: 2, 
                                   repeat: Infinity, 
                                   ease: "easeInOut",
                                   delay: 0.5
                                 }}
                               />
                             </>
                           )}
                         </motion.div>
                         
                         {/* Clean Number Badge - Responsive sizing */}
                         <div className={`absolute -top-0.5 -right-0.5 w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                           index === currentStep
                             ? 'bg-slate-900 text-white'
                             : index < currentStep
                             ? 'bg-white text-emerald-600'
                             : 'bg-slate-600 text-slate-300'
                         }`}>
                           <span className="text-[10px] leading-none">{step.id}</span>
                         </div>
                       </motion.button>
                       
                       {/* Step Title */}
                       <motion.div 
                         className="mt-3 text-center"
                         initial={{ opacity: 1, y: 10 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ delay: index * 0.1 + 0.3 }}
                       >
                         <h4 className={`font-bold text-xs transition-all duration-500 ${
                           index === currentStep
                             ? 'text-white'
                             : index < currentStep
                             ? 'text-emerald-300'
                             : 'text-slate-400 group-hover:text-slate-300'
                         }`}>
                           {step.title}
                         </h4>
                         
                         {/* Status Dot */}
                         <div className="mt-1 sm:mt-1.5 flex justify-center">
                           <div className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full transition-all duration-500 ${
                             index === currentStep
                               ? 'bg-teal-400 shadow-lg shadow-teal-400/50'
                               : index < currentStep
                               ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                               : 'bg-slate-600'
                           }`}></div>
                         </div>
                       </motion.div>
                     </motion.div>
                   ))}
                 </div>
               </div>

             </div>
           </motion.div>

           {/* Current Step Details */}
           <AnimatePresence mode="wait">
             <motion.div
               key={currentStep}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -30 }}
               transition={{ duration: 0.5 }}
               className="relative"
             >
               {/* Details Card with Split Layout */}
               <div className="relative overflow-hidden rounded-2xl border border-slate-200/15 bg-slate-900/30 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)] ring-1 ring-teal-300/10 backdrop-blur-xl transition-all duration-500 md:p-8">
                 
                 {/* Background Glow */}
                 <div className="absolute inset-0 rounded-3xl overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-slate-900/55 via-slate-900/30 to-slate-950/60"></div>
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(45,212,191,0.12),transparent_35%),radial-gradient(circle_at_84%_82%,rgba(99,102,241,0.12),transparent_40%)]"></div>
                   <div className="absolute -left-20 top-6 h-44 w-44 rounded-full bg-teal-200/10 blur-3xl"></div>
                   <div className="absolute -right-16 bottom-4 h-36 w-36 rounded-full bg-indigo-300/10 blur-3xl"></div>
                   <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_0)] [background-size:16px_16px]"></div>
                   <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-teal-100/40 to-transparent"></div>
                   <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-white/25 via-transparent to-transparent"></div>
                   <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-200/25 to-transparent"></div>
                 </div>

                 {/* Split Layout Content */}
                 <div className="relative z-10 max-w-5xl mx-auto">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                     
                     {/* Left Side - Details */}
                     <motion.div
                       initial={{ opacity: 0, x: -50 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.6, delay: 0.2 }}
                       className="space-y-6 transform-gpu"
                     >
                       {/* Step Header */}
                                                <div className="space-y-4">
                           <div className="flex items-center gap-3">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                               'bg-gradient-to-br from-teal-400 to-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                             }`}>
                               <currentStepData.icon className="w-6 h-6" />
                             </div>
                             
                             <div>
                               <span className="text-xs font-medium text-teal-300 mb-1 block">
                                 Step {currentStepData.id} of {workSteps.length}
                               </span>
                               <h3 className="text-2xl md:text-3xl font-bold text-white">
                                 {currentStepData.title}
                               </h3>
                             </div>
                           </div>
                           
                           <div className="w-16 h-0.5 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full"></div>
                         </div>

                       {/* Description */}
                       <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-4">
                         {currentStepData.description}
                       </p>

                       {/* Key Points */}
                       <div className="space-y-3">
                         {currentStepData.keyPoints.map((point, index) => (
                           <motion.div
                             key={index}
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ duration: 0.4, delay: index * 0.1 }}
                             className="flex items-start gap-3"
                           >
                             <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500"></div>
                             <span className="text-sm text-slate-400 leading-relaxed">{point}</span>
                           </motion.div>
                         ))}
                       </div>

                       
                     </motion.div>

                     {/* Right Side - Lottie Animation */}
                     <motion.div
                       initial={{ opacity: 0, x: 50 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.6, delay: 0.4 }}
                       className="flex justify-center transform-gpu"
                     >
                       <div className="w-full max-w-md mx-auto">
                         <div className="aspect-square w-full">
                           <DotLottieReact
                             src={currentStepData.animation}
                             loop
                             autoplay
                             style={{ 
                               height: '100%', 
                               width: '100%',
                               objectFit: 'contain'
                             }}
                           />
                         </div>
                       </div>
                     </motion.div>

                   </div>
                 </div>
               </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HowIWork; 