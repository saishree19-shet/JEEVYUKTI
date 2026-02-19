'use client';
import Link from 'next/link';
import { ArrowRight, Activity, FileText, Database, Shield, Heart, Zap, CheckCircle, Upload, Search, FileBarChart } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F4F2] font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#F7F4F2]/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Jeevyukt Logo" className="w-40 h-auto object-contain mix-blend-multiply hue-rotate-180" />
            </div>

            <div className="hidden md:flex space-x-8 items-center bg-white/50 px-8 py-3 rounded-full border border-white/50 shadow-sm backdrop-blur-md">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How it Works</NavLink>
              <NavLink href="#testimonials">Trust</NavLink>
            </div>

            <div className="flex space-x-3">
              <Link href="/login" className="px-6 py-2.5 text-slate-600 font-bold hover:text-teal-600 transition-colors">
                Login
              </Link>
              <Link href="/signup" className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-teal-600 transition-all shadow-lg hover:shadow-teal-500/30">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-48 pb-20 px-6 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-200/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-extrabold uppercase tracking-wider mb-8 border border-orange-100">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              v2.0 Now Live
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Understand Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Genetic Code.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg font-medium">
              Your DNA holds the blueprint to safer medication. We interpret it instantly using advanced AI and CPIC guidelines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-300">
                Analyze My DNA <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors shadow-sm border border-slate-100">
                <CheckCircle className="text-teal-500" size={20} />
                See Sample Report
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm font-semibold text-slate-400">
              <span>TRUSTED BY RESEARCHERS AT</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>
          </div>

          {/* Abstract Hero Graphic */}
          <div className="relative hidden lg:block h-[650px] w-full perspective-1000">
            {/* Main Graphic Container */}
            <div className="relative w-full h-full transform transition-transform duration-700 hover:rotate-y-6 preserve-3d">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-50 to-orange-50 rounded-[48px] border border-white/50 shadow-2xl backdrop-blur-sm overflow-hidden flex items-center justify-center">
                <div className="grid grid-cols-6 gap-4 opacity-10 transform -rotate-12 scale-150">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="w-20 h-20 rounded-2xl bg-slate-900/10"></div>
                  ))}
                </div>
              </div>

              {/* Floating Cards */}
              <FloatingCard
                className="top-20 right-10 animate-float-slow delay-0"
                icon={Activity}
                color="orange"
                title="CYP2C19"
                value="Poor Metabolizer"
                subtext="Reduce Clopidogrel"
              />
              <FloatingCard
                className="bottom-32 left-10 animate-float-reverse delay-1000"
                icon={Shield}
                color="teal"
                title="Safety Score"
                value="98% Confident"
                subtext="Verified by CPIC"
              />
              <FloatingCard
                className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"
                icon={Database}
                color="blue"
                title="Processing VCF"
                value="12,000 Variants"
                subtext="Analyzing..."
                isCenter
              />
            </div>
          </div>

        </div>
      </div>

      {/* Trusted By Strip */}
      <div className="py-10 border-y border-slate-200/60 bg-white/50 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex justify-around opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Mock Logos */}
          <span className="text-xl font-bold">GENOMICS<span className="font-light">LAB</span></span>
          <span className="text-xl font-bold">Medi<span className="text-teal-600">Care</span></span>
          <span className="text-xl font-bold tracking-widest">RESEARCH+</span>
          <span className="text-xl font-serif italic">University Health</span>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">From Raw Data to <br /> Life-Saving Insights</h2>
            <p className="text-lg text-slate-500">We make complex bioinformatics as simple as drag-and-drop.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-teal-100 via-orange-100 to-teal-100 rounded-full z-0"></div>

            <StepCard
              step="01"
              icon={Upload}
              title="Upload VCF"
              desc="Drag and drop your 23andMe or AncestryDNA raw data file securely."
            />
            <StepCard
              step="02"
              icon={Search}
              title="AI Analysis"
              desc="Our engine maps variants to phenotypes using the latest CPIC database tables."
            />
            <StepCard
              step="03"
              icon={FileBarChart}
              title="Get Report"
              desc="Receive a comprehensive PDF report with personalized dosage guidelines."
            />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-32 px-6 bg-[#F7F4F2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Scientific Precision, <br />Delivered Instantly.</h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Don't rely on generic prescribing information. Your genetic makeup dictates how you process medications.
              </p>

              <div className="space-y-6">
                <FeatureRow
                  icon={Zap}
                  color="bg-orange-100 text-orange-600"
                  title="Real-time Parsing"
                  desc="Process 50MB+ VCF files in under 3 seconds using WebAssembly."
                />
                <FeatureRow
                  icon={Database}
                  color="bg-teal-100 text-teal-600"
                  title="CPIC Compliant"
                  desc="Strict adherence to Clinical Pharmacogenetics Implementation Consortium guidelines."
                />
                <FeatureRow
                  icon={Shield}
                  color="bg-blue-100 text-blue-600"
                  title="Privacy First"
                  desc="Data is processed in memory and never stored without your explicit consent."
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[48px] shadow-xl relative transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-orange-50 rounded-[48px] opacity-50"></div>
              <div className="relative z-10 space-y-4">
                {/* Mock UI Elements */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold">!</div>
                  <div>
                    <h4 className="font-bold text-slate-800">High Risk Detected</h4>
                    <p className="text-xs text-slate-500">Consider alternative to Codeine</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Normal Metabolism</h4>
                    <p className="text-xs text-slate-500">Ibuprofen is safe to use</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-700">Analysis Confidence</span>
                    <span className="font-bold text-teal-500">99.8%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[99.8%] h-full bg-teal-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6 rounded-t-[48px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="Jeevyukt Logo" className="w-32 h-auto object-contain hue-rotate-180" />
            </div>
            <p className="mt-6 text-slate-400 max-w-sm">
              Empowering patients and providers with precision pharmacogenomics tools for a safer, healthier future.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Platform</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 text-center text-slate-600 text-sm">
          © 2026 PharmaGuard Inc. Built for RIFT Hackathon.
        </div>
      </footer>
    </main>
  );
}

function NavLink({ href, children }) {
  return (
    <a href={href} className="text-slate-600 font-bold text-sm hover:text-teal-600 transition-colors">
      {children}
    </a>
  )
}

function FloatingCard({ className, icon: Icon, color, title, value, subtext, isCenter }) {
  return (
    <div className={`absolute bg-white p-5 rounded-[24px] shadow-2xl z-20 ${className} ${isCenter ? 'scale-110' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${color === 'orange' ? 'bg-orange-500 shadow-orange-200' :
          color === 'teal' ? 'bg-teal-500 shadow-teal-200' :
            'bg-blue-600 shadow-blue-200'
          }`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{title}</p>
          <h4 className="font-bold text-slate-800 text-lg">{value}</h4>
          <p className={`text-xs font-medium ${color === 'orange' ? 'text-orange-500' :
            color === 'teal' ? 'text-teal-500' :
              'text-blue-500'
            }`}>{subtext}</p>
        </div>
      </div>
    </div>
  )
}

function StepCard({ step, icon: Icon, title, desc }) {
  return (
    <div className="relative z-10 bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
      <div className="absolute -top-6 left-8 bg-slate-900 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-lg">
        STEP {step}
      </div>
      <div className="w-16 h-16 bg-[#F7F4F2] rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-slate-800" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  )
}

function FeatureRow({ icon: Icon, color, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-lg mb-1">{title}</h4>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
