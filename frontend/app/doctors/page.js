'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    LayoutGrid, History, Settings, LogOut,
    Activity, MapPin, Phone, Search, Star, Navigation
} from 'lucide-react';
import Link from 'next/link';

export default function DoctorsPage() {
    const [user, setUser] = useState(null);
    const [location, setLocation] = useState('Bangalore'); // Default
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [mapQuery, setMapQuery] = useState('Pharmacogenomics doctors near Bangalore');
    const router = useRouter();

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        // Extract city from location string (simple split for demo)
        const city = location.split(',')[0] || 'Bangalore';
        setDoctors(generateDoctors(city));
    }, [location]);

    const generateDoctors = (city) => [
        {
            name: "Dr. Sarah Chen, PharmD",
            specialty: "Clinical Pharmacogenomics",
            rating: 4.9,
            reviews: 128,
            location: `Medical Center, ${city}`,
            distance: "2.4 km",
            clinic: "Precision Care Institute",
            bio: "Specialist in tailoring cardiovascular and psychiatric medications based on genetic profiles. 10+ years of experience.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "Dr. Rajesh Kumar, MD",
            specialty: "Genetic Counselor",
            rating: 4.8,
            reviews: 95,
            location: `Indiranagar, ${city}`,
            distance: "4.1 km",
            clinic: "Genomic Health Hub",
            bio: "Expert in interpreting complex VCF data for family planning and preventative medication strategies.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Dr. Emily Watts, PhD",
            specialty: "Molecular Biologist",
            rating: 5.0,
            reviews: 64,
            location: `Whitefield, ${city}`,
            distance: "8.5 km",
            clinic: "NextGen Diagnostics",
            bio: "Focuses on oncology and rare disease pharmacotherapy. Leads research in CYP enzyme variations.",
            image: "https://randomuser.me/api/portraits/women/68.jpg"
        }
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const detectLocation = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                // Reverse geocoding is complex without API key, so we use lat/long directly in query or just prompt user
                // For embed, we can use "near me" if browser permission is granted, or coordinates
                setLocation(`${latitude}, ${longitude}`);
                setMapQuery(`Pharmacogenomics doctors near ${latitude},${longitude}`);
                setLoadingLocation(false);
            }, (error) => {
                console.error("Error getting location:", error);
                alert("Could not detect location. Please search manually.");
                setLoadingLocation(false);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
            setLoadingLocation(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setMapQuery(`Pharmacogenomics doctors near ${location}`);
    };

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between hidden md:flex z-10">
                <div>
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <img src="/logo.jpg" alt="Jeevyukt" className="w-32 h-auto object-contain mix-blend-multiply hue-rotate-180" />
                    </div>
                    <nav className="space-y-1">
                        <NavItem icon={LayoutGrid} label="Dashboard" href="/dashboard" />
                        <NavItem icon={Activity} label="Analysis" href="/analysis" />
                        <NavItem icon={MapPin} label="Find Doctors" active href="/doctors" />
                        <NavItem icon={History} label="History" href="/history" />
                        <NavItem icon={Settings} label="Settings" href="/settings" />
                    </nav>
                </div>
                <div>
                    <div className="px-4 py-3 mb-6 bg-indigo-50 rounded-xl">
                        <p className="text-xs font-bold text-indigo-900 mb-1">Pro Plan</p>
                        <p className="text-[10px] text-indigo-600">Expires in 24 days</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors w-full text-left text-sm font-medium">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto flex flex-col">
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-slate-800">Find Specialists</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold ring-2 ring-white shadow-sm">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col">
                    <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex-1 w-full">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Locate Experts Nearby</h2>
                            <p className="text-sm text-slate-500">Find verified pharmacogenomics specialists and genetic counselors.</p>
                        </div>

                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter your city or area..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                                />
                                <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                            </div>
                            <button
                                type="button"
                                onClick={detectLocation}
                                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                                title="Use my location"
                            >
                                <Navigation size={20} className={loadingLocation ? "animate-spin" : ""} />
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <Search size={18} />
                                <span className="hidden md:inline">Search</span>
                            </button>
                        </form>
                    </div>

                    {/* Map Container */}
                    <div className="flex-1 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner relative min-h-[400px] mb-8">
                        <iframe
                            title="Google Maps Search"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                        ></iframe>

                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50 max-w-xs hidden md:block">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800">Need immediate help?</h4>
                                    <p className="text-[10px] text-slate-500">Contact nearby clinics directly through the map.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Specialists (Mock Data) */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Star size={20} className="text-indigo-500" /> Suggested Specialists
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doc, index) => (
                                <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
                                    <div className="flex items-start gap-4 mb-4">
                                        <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-full object-cover bg-slate-100" />
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{doc.name}</h3>
                                            <p className="text-indigo-600 text-xs font-bold uppercase tracking-wide">{doc.specialty}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                                <span className="text-sm font-bold text-slate-700">{doc.rating}</span>
                                                <span className="text-xs text-slate-400">({doc.reviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow">
                                        {doc.bio}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <MapPin size={16} className="text-slate-400" />
                                            <span>{doc.location} ({doc.distance})</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Activity size={16} className="text-slate-400" />
                                            <span>{doc.clinic}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-slate-50 flex gap-3">
                                        <button className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors border border-slate-200">
                                            View Profile
                                        </button>
                                        <button className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                            <Phone size={16} /> Contact
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}



function NavItem({ icon: Icon, label, active, href }) {
    return (
        <Link href={href || "#"} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-sm ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    )
}
