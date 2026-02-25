// lib/data.ts  – Static content for all packages

export type Package = {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    category: "Hill Stations" | "Beaches" | "Adventure" | "Cultural" | "Custom";
    destination: string;
    duration: string;
    groupSize: string;
    price: number;
    priceDisplay: string;
    overview: string;
    coverImage: string;
    gallery: string[];
    highlights: string[];
    itinerary: { day: number; title: string; description: string }[];
    inclusions: string[];
    exclusions: string[];
    rating: number;
    reviews: number;
};

export const packages: Package[] = [
    {
        id: "1",
        slug: "manali-adventure-escape",
        name: "Manali Adventure Escape",
        tagline: "Snow peaks, roaring rivers & mountain thrills",
        category: "Hill Stations",
        destination: "Manali, Himachal Pradesh",
        duration: "5 Days / 4 Nights",
        groupSize: "10–20 people",
        price: 8499,
        priceDisplay: "₹8,499",
        overview:
            "Experience the raw beauty of the Himalayas with our Manali Adventure Escape. From the frozen Solang Valley to the ancient Hadimba Temple, this trip is crafted for thrill-seekers and nature lovers alike. Expert guides, cozy accommodations, and unforgettable campfire nights included.",
        coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop",
        ],
        highlights: [
            "Solang Valley snow activities",
            "Rohtang Pass (subject to permit)",
            "River rafting on Beas",
            "Hadimba Temple visit",
            "Campfire & bonding night",
        ],
        itinerary: [
            { day: 1, title: "Arrival & Old Manali Exploration", description: "Arrive in Manali, check in, explore Old Manali Bazaar, evening bonfire at campsite." },
            { day: 2, title: "Solang Valley Adventure", description: "Full-day at Solang Valley – skiing, snow scooter, zorbing. Evening hot chocolate session." },
            { day: 3, title: "Rohtang & River Rafting", description: "Morning drive to Rohtang Pass (permit-based). Afternoon river rafting on Beas River." },
            { day: 4, title: "Hadimba Temple & Local Culture", description: "Visit Hadimba Temple, Manu Temple, Van Vihar. Explore local Kashmiri handicraft market." },
            { day: 5, title: "Departure", description: "Breakfast, final photos, check-out, and drop-off at bus stand / airport." },
        ],
        inclusions: [
            "4 nights accommodation in cozy guesthouse/camp",
            "Daily breakfast & dinner",
            "All transfers in private cab",
            "Professional trip guide",
            "River rafting session",
            "Campfire & bonfire night",
        ],
        exclusions: [
            "Train/flight tickets to Manali",
            "Rohtang Pass permit (~₹500)",
            "Personal expenses & shopping",
            "Lunch",
            "Travel insurance",
        ],
        rating: 4.9,
        reviews: 128,
    },
    {
        id: "2",
        slug: "goa-beach-bonanza",
        name: "Goa Beach Bonanza",
        tagline: "Sunsets, shacks & infinite good vibes",
        category: "Beaches",
        destination: "Goa",
        duration: "4 Days / 3 Nights",
        groupSize: "10–25 people",
        price: 7299,
        priceDisplay: "₹7,299",
        overview:
            "Sun-soaked beaches, fresh seafood, and legendary nightlife await you in India's party capital. Our Goa Beach Bonanza is designed for groups who want the perfect mix of relaxation, adventure water sports, and unforgettable memories.",
        coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1559308786-c77fdfbf36a6?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=800&auto=format&fit=crop",
        ],
        highlights: [
            "Water sports at Calangute",
            "Sunset cruise on Mandovi",
            "Heritage walk in Old Goa",
            "Night market experience",
            "Dudhsagar Waterfall trip",
        ],
        itinerary: [
            { day: 1, title: "Arrival & North Goa Beaches", description: "Check-in, freshen up, head to Baga & Calangute beach. Evening at a beachside shack." },
            { day: 2, title: "Water Sports & Sunset Cruise", description: "Morning water sports, post-lunch Dudhsagar Waterfall excursion, evening sunset cruise." },
            { day: 3, title: "South Goa & Heritage", description: "Explore peaceful Palolem beach, visit Basilica of Bom Jesus, spice plantation tour." },
            { day: 4, title: "Departure", description: "Morning leisure, breakfast, shopping at Panjim market, drop at airport/station." },
        ],
        inclusions: [
            "3 nights stay at beachside hotel",
            "Daily breakfast",
            "Water sports package",
            "Sunset cruise tickets",
            "Dudhsagar trip in shared jeep",
            "Airport transfers",
        ],
        exclusions: [
            "Flights/train to Goa",
            "Personal food & beverages",
            "Nightlife expenses",
            "Shopping",
        ],
        rating: 4.8,
        reviews: 215,
    },
    {
        id: "3",
        slug: "rishikesh-adventure-rush",
        name: "Rishikesh Adventure Rush",
        tagline: "White water, bungee & yoga at the spiritual capital",
        category: "Adventure",
        destination: "Rishikesh, Uttarakhand",
        duration: "3 Days / 2 Nights",
        groupSize: "8–18 people",
        price: 5999,
        priceDisplay: "₹5,999",
        overview:
            "The adventure capital of India is calling! From the adrenaline rush of Grade 4 rapids to bungee jumping off the highest platform in India, Rishikesh is every thrill-seeker's dream. Balance it with morning yoga and a peaceful Ganga Aarti ceremony.",
        coverImage: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1570639232030-f14a01ec3d77?w=800&auto=format&fit=crop",
        ],
        highlights: [
            "River rafting (Grade 3–4 rapids)",
            "Bungee jumping (83m)",
            "Morning yoga session",
            "Ganga Aarti at Triveni Ghat",
            "Overnight beach camping",
        ],
        itinerary: [
            { day: 1, title: "Arrival & Ganga Aarti", description: "Arrive, check into camp, explore Laxman Jhula, attend the mesmerizing evening Ganga Aarti." },
            { day: 2, title: "River Rafting & Bungee", description: "Full-day adventure – 16km white water rafting, optional bungee jump + cliff jumping." },
            { day: 3, title: "Yoga & Departure", description: "Sunrise yoga, healthy breakfast, explore the Beatles Ashram, depart after lunch." },
        ],
        inclusions: [
            "2 nights beachside camping",
            "All meals (breakfast, lunch, dinner)",
            "River rafting (16km)",
            "Bungee jump (1 attempt)",
            "Yoga session",
            "Safety equipment & guide",
        ],
        exclusions: [
            "Travel to Rishikesh",
            "Additional adventure activities",
            "Personal expenses",
        ],
        rating: 4.9,
        reviews: 183,
    },
    {
        id: "4",
        slug: "rajasthan-royal-journey",
        name: "Rajasthan Royal Journey",
        tagline: "Forts, deserts & the colors of royal India",
        category: "Cultural",
        destination: "Jaipur – Jodhpur – Jaisalmer",
        duration: "7 Days / 6 Nights",
        groupSize: "12–24 people",
        price: 14999,
        priceDisplay: "₹14,999",
        overview:
            "Immerse yourself in the opulence, history, and vivid culture of Rajasthan — India's most majestic state. Walk through ancient forts, haggle in colorful bazaars, ride camels at sunset in the Thar Desert, and sleep under a billion stars in Jaisalmer.",
        coverImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1546961342-ea5f62d5a6e2?w=800&auto=format&fit=crop",
        ],
        highlights: [
            "Amber Fort & City Palace, Jaipur",
            "Blue city lanes of Jodhpur",
            "Camel safari at sunset",
            "Desert camp under stars",
            "Jaisalmer golden fort",
        ],
        itinerary: [
            { day: 1, title: "Arrival in Jaipur – Pink City", description: "Check in, explore Hawa Mahal, evening market at Bapu Bazaar." },
            { day: 2, title: "Jaipur Forts & Palaces", description: "Amber Fort, City Palace, Jantar Mantar. Rajasthani dinner with folk music." },
            { day: 3, title: "Jaipur to Jodhpur", description: "Drive to Jodhpur (~5hrs). Evening at Mehrangarh Fort, explore the blue city lanes." },
            { day: 4, title: "Jodhpur to Jaisalmer", description: "Drive to Jaisalmer, visit Sonar Fort, sunset at Bada Bagh. Dinner in haveli restaurant." },
            { day: 5, title: "Camel Safari & Desert Camp", description: "Morning sightseeing, afternoon camel safari to Sam Sand Dunes, overnight desert camp." },
            { day: 6, title: "Desert & Departure Prep", description: "Sunrise at dunes, folk dance at camp, drive back to Jaisalmer, leisure shopping." },
            { day: 7, title: "Departure", description: "Breakfast, drop to Jaisalmer station/airport. Memories for life!" },
        ],
        inclusions: [
            "6 nights accommodation (hotels + desert camp)",
            "Daily breakfast & dinner",
            "All intercity transfers",
            "Camel safari",
            "Professional guide throughout",
            "Entry tickets to monuments",
        ],
        exclusions: [
            "Flights to Jaipur / from Jaisalmer",
            "Lunch",
            "Personal shopping",
            "Photography fees at monuments",
        ],
        rating: 4.7,
        reviews: 97,
    },
    {
        id: "5",
        slug: "coorg-coffee-trails",
        name: "Coorg Coffee Trails",
        tagline: "Misty hills, coffee estates & waterfall magic",
        category: "Hill Stations",
        destination: "Coorg (Kodagu), Karnataka",
        duration: "3 Days / 2 Nights",
        groupSize: "8–16 people",
        price: 6499,
        priceDisplay: "₹6,499",
        overview:
            "Nestled in the Western Ghats, Coorg is India's best-kept secret. Walk through lush coffee and spice plantations, chase majestic waterfalls, spot wildlife at Nagarhole, and wake up to misty mountain mornings. Perfect for a rejuvenating group getaway.",
        coverImage: "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop",
        ],
        highlights: [
            "Coffee plantation walk & tasting",
            "Abbey Falls & Iruppu Falls",
            "Nagarhole wildlife safari",
            "Raja's Seat viewpoint at sunset",
            "Authentic Kodava cuisine",
        ],
        itinerary: [
            { day: 1, title: "Arrival & Coffee Estate", description: "Arrive Coorg, check in, guided tour of coffee & spice plantation, evening at Raja's Seat." },
            { day: 2, title: "Falls & Wildlife", description: "Abbey Falls trek, Iruppu Falls, afternoon Nagarhole jungle safari. Campfire dinner." },
            { day: 3, title: "Local Culture & Departure", description: "Visit Golden Temple at Bylakuppe, local market, lunch, departure." },
        ],
        inclusions: [
            "2 nights at a coffee estate homestay",
            "All meals (breakfast, lunch, dinner)",
            "Plantation guided tour",
            "Nagarhole safari jeep (shared)",
            "All transfers from Mysore/Bangalore",
        ],
        exclusions: [
            "Travel to pickup point (Mysore/Bangalore)",
            "Personal beverages & tips",
            "Any additional activities",
        ],
        rating: 4.8,
        reviews: 74,
    },
];

export const testimonials = [
    {
        id: 1,
        name: "Priya Sharma",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=priya",
        trip: "Manali Adventure Escape",
        quote: "Best trip of my life! The team handled everything perfectly. Every single detail was taken care of and I just had to show up and enjoy. Would highly recommend to anyone!",
        rating: 5,
        location: "Mumbai",
    },
    {
        id: 2,
        name: "Arjun Mehta",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=arjun",
        trip: "Goa Beach Bonanza",
        quote: "GangOfMusafirs planned our group trip to Goa and it was absolutely insane! The accommodations were great, activities were perfectly timed. Already booked another trip!",
        rating: 5,
        location: "Pune",
    },
    {
        id: 3,
        name: "Sneha Patel",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=sneha",
        trip: "Rishikesh Adventure Rush",
        quote: "I was terrified of river rafting but the guides were so encouraging and professional. Did bungee too! This is the only travel group you'll ever need.",
        rating: 5,
        location: "Ahmedabad",
    },
    {
        id: 4,
        name: "Kabir Singh",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=kabir",
        trip: "Rajasthan Royal Journey",
        quote: "7 days in Rajasthan felt like living a completely different life. Desert camp under stars is something I will never forget. The organizers were super responsive throughout.",
        rating: 5,
        location: "Delhi",
    },
    {
        id: 5,
        name: "Ananya Roy",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=ananya",
        trip: "Coorg Coffee Trails",
        quote: "Coorg weekend trip was exactly what I needed — away from city chaos, fresh mountain air, amazing food. Our group of 12 friends had an absolute blast!",
        rating: 5,
        location: "Bangalore",
    },
];

export const stats = [
    { value: "500+", label: "Trips Completed" },
    { value: "2000+", label: "Happy Travelers" },
    { value: "50+", label: "Destinations" },
    { value: "4.9★", label: "Average Rating" },
];

export const whyUs = [
    {
        icon: "🧭",
        title: "Zero Planning Stress",
        description: "We handle every detail — hotels, transport, activities, food. You just show up, we do the rest.",
    },
    {
        icon: "🔒",
        title: "Safe & Verified Trips",
        description: "All our trips are expert-planned with safety-first protocols and experienced local guides.",
    },
    {
        icon: "💰",
        title: "Best Price Guarantee",
        description: "Premium experiences at budget-friendly prices. Transparent pricing, no hidden charges ever.",
    },
    {
        icon: "📱",
        title: "24/7 WhatsApp Support",
        description: "Our team is always a message away. Before, during, and after your trip.",
    },
    {
        icon: "🌿",
        title: "Local & Authentic",
        description: "We partner with local guides and businesses to give you real, authentic cultural experiences.",
    },
    {
        icon: "👥",
        title: "Group Vibes Only",
        description: "Meet amazing people, make lifelong friends. Our groups are the right size for real connections.",
    },
];
