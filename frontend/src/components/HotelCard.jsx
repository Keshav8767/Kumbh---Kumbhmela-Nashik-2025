import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const INDIA_HOTELS = [
  { name: 'The Leela Kovalam', city: 'Kovalam', state: 'Kerala', rating: 5, price: 28000, type: 'Luxury', rooms: 182, amenities: ['Pool', 'Spa', 'Restaurant', 'Beach'], images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600'] },
  { name: 'Taj Malabar Resort', city: 'Kochi', state: 'Kerala', rating: 5, price: 22000, type: 'Luxury', rooms: 95, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'] },
  { name: 'Casino Hotel', city: 'Kochi', state: 'Kerala', rating: 4, price: 8500, type: 'Mid-range', rooms: 67, amenities: ['Pool', 'Restaurant', 'WiFi', 'Gym'], images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600', 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600'] },
  { name: 'Fragrant Nature Munnar', city: 'Munnar', state: 'Kerala', rating: 4, price: 6500, type: 'Mid-range', rooms: 52, amenities: ['Restaurant', 'WiFi', 'Valley View', 'Spa'], images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=600'] },
  { name: 'Taj Gateway Hotel', city: 'Ahmedabad', state: 'Gujarat', rating: 5, price: 15000, type: 'Luxury', rooms: 120, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], images: ['https://images.unsplash.com/photo-1549294413-26f195200c16?w=600', 'https://images.unsplash.com/photo-1564501049559-0a02629a8414?w=600'] },
  { name: 'Hyatt Regency Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', rating: 5, price: 12000, type: 'Luxury', rooms: 211, amenities: ['Pool', 'Gym', 'Spa', 'WiFi'], images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'] },
  { name: 'Rann Riders Resort', city: 'Kutch', state: 'Gujarat', rating: 3, price: 5500, type: 'Mid-range', rooms: 30, amenities: ['Restaurant', 'Desert View', 'WiFi', 'AC'], images: ['https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=600'] },
  { name: 'The Taj Mahal Palace', city: 'Mumbai', state: 'Maharashtra', rating: 5, price: 35000, type: 'Luxury', rooms: 285, amenities: ['Pool', 'Spa', 'Restaurant', 'Sea View'], images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'] },
  { name: 'Ginger Hotel Nashik', city: 'Nashik', state: 'Maharashtra', rating: 3, price: 3500, type: 'Mid-range', rooms: 40, amenities: ['AC', 'WiFi', 'Restaurant'], images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600'] },
  { name: 'Radisson Blu Pune', city: 'Pune', state: 'Maharashtra', rating: 4, price: 8000, type: 'Mid-range', rooms: 198, amenities: ['Pool', 'Gym', 'Restaurant', 'WiFi'], images: ['https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=600'] },
  { name: 'The Leela Palace New Delhi', city: 'New Delhi', state: 'Delhi', rating: 5, price: 32000, type: 'Luxury', rooms: 254, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], images: ['https://images.unsplash.com/photo-1549294413-26f195200c16?w=600', 'https://images.unsplash.com/photo-1564501049559-0a02629a8414?w=600'] },
  { name: 'The Imperial New Delhi', city: 'New Delhi', state: 'Delhi', rating: 5, price: 25000, type: 'Luxury', rooms: 235, amenities: ['Pool', 'Spa', 'Bar', 'WiFi'], images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600', 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600'] },
  { name: 'ITC Royal Bengal', city: 'Kolkata', state: 'West Bengal', rating: 5, price: 20000, type: 'Luxury', rooms: 520, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600'] },
  { name: 'Mayfair Darjeeling', city: 'Darjiling', state: 'West Bengal', rating: 4, price: 9500, type: 'Mid-range', rooms: 72, amenities: ['Restaurant', 'WiFi', 'Mountain View', 'Spa'], images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'] },
  { name: 'Taj Exotica Goa', city: 'Salcete', state: 'Goa', rating: 5, price: 30000, type: 'Luxury', rooms: 140, amenities: ['Pool', 'Spa', 'Beach', 'Restaurant'], images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'] },
  { name: 'Zostel Goa', city: 'Arpora', state: 'Goa', rating: 2, price: 900, type: 'Budget', rooms: 20, amenities: ['WiFi', 'Common Area', 'Beach Nearby'], images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600'] },
  { name: 'The Oberoi Bangalore', city: 'Bangalore', state: 'Karnataka', rating: 5, price: 22000, type: 'Luxury', rooms: 169, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'] },
  { name: 'The Oberoi Udaivilas', city: 'Udaipur', state: 'Rajasthan', rating: 5, price: 45000, type: 'Luxury', rooms: 87, amenities: ['Pool', 'Spa', 'Lake View', 'Restaurant'], images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600'] },
  { name: 'Suryagarh Jaisalmer', city: 'Jaisalmer', state: 'Rajasthan', rating: 5, price: 20000, type: 'Luxury', rooms: 60, amenities: ['Pool', 'Spa', 'Desert View', 'Restaurant'], images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600'] },
  { name: 'ITC Grand Chola', city: 'Chennai', state: 'Tamil Nadu', rating: 5, price: 18000, type: 'Luxury', rooms: 600, amenities: ['Pool', 'Gym', 'Spa', 'WiFi'], images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'] },
  { name: 'Ananda In The Himalayas', city: 'Rishikesh', state: 'Uttarakhand', rating: 5, price: 38000, type: 'Luxury', rooms: 75, amenities: ['Spa', 'Yoga', 'Restaurant', 'Mountain View'], images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600'] },
  { name: 'Trident Agra', city: 'Agra', state: 'Uttar Pradesh', rating: 5, price: 15000, type: 'Luxury', rooms: 137, amenities: ['Pool', 'Spa', 'Taj View', 'Restaurant'], images: ['https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600', 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=600'] },
  { name: 'Wildflower Hall Shimla', city: 'Shimla', state: 'Himachal Pradesh', rating: 5, price: 32000, type: 'Luxury', rooms: 85, amenities: ['Spa', 'Restaurant', 'Mountain View', 'WiFi'], images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'] },
  { name: 'ITC Kakatiya Hyderabad', city: 'Hyderabad', state: 'Telangana', rating: 5, price: 16000, type: 'Luxury', rooms: 188, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'] },
  { name: 'The Grand Dragon Ladakh', city: 'Leh', state: 'Ladakh', rating: 4, price: 11000, type: 'Mid-range', rooms: 55, amenities: ['Restaurant', 'WiFi', 'Mountain View', 'Parking'], images: ['https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600', 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=600'] },
];

const AMENITY_ICONS = {
  'Pool': '🏊', 'Spa': '💆', 'Restaurant': '🍽️', 'WiFi': '📶',
  'Gym': '💪', 'Bar': '🍸', 'AC': '❄️', 'Parking': '🅿️',
  'Lake View': '🌊', 'Taj View': '🕌', 'Common Area': '🛋️',
  'Lockers': '🔒', 'TV': '📺', 'Beach': '🏖️', 'Desert View': '🏜️',
  'Mountain View': '⛰️', 'Valley View': '🌄', 'River View': '🌊',
  'Heritage': '🏛️', 'Yoga': '🧘', 'Ayurveda': '🌿', 'Sea View': '🌊',
  'Beach Nearby': '🏖️',
};

const TYPE_COLOR = {
  'Luxury': '#d97706', 'Mid-range': '#2563eb', 'Budget': '#16a34a',
};

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#f59e0b' : '#d1d5db', fontSize: '13px' }}>★</span>
      ))}
      <span style={{ fontSize: '0.78rem', color: '#6b7280', marginLeft: '3px' }}>{rating} Star</span>
    </div>
  );
}

function SingleHotelCard({ hotel }) {
  return (
    <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '160px', flexShrink: 0 }}>
        <Swiper modules={[Pagination]} pagination={{ clickable: true }} style={{ height: '160px' }}>
          {hotel.images.map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} alt={hotel.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} onError={e => e.target.src = hotel.images[0]} />
            </SwiperSlide>
          ))}
        </Swiper>
        <span style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, background: TYPE_COLOR[hotel.type] || '#374151', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700' }}>
          {hotel.type}
        </span>
        {hotel.rooms && (
          <span style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem' }}>
            {hotel.rooms} rooms
          </span>
        )}
      </div>

      <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#111827', lineHeight: 1.3 }}>{hotel.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
            📍 {hotel.city}, {hotel.state}
            {hotel.distanceKm != null ? ` · ${hotel.distanceKm.toFixed(1)} km away` : ''}
          </div>
          <div style={{ marginTop: '5px' }}><StarRating rating={hotel.rating} /></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '7px' }}>
            {hotel.amenities.slice(0, 4).map((a, i) => (
              <span key={i} style={{ background: '#f3f4f6', borderRadius: '6px', padding: '2px 6px', fontSize: '0.7rem', color: '#374151' }}>
                {AMENITY_ICONS[a] || '✓'} {a}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div>
            <span style={{ fontWeight: '800', color: '#ea580c', fontSize: '1rem' }}>₹{hotel.price.toLocaleString()}</span>
            <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>/night</span>
          </div>
          <a href={`https://www.booking.com/search.html?ss=${encodeURIComponent(hotel.name + ' ' + hotel.city)}`} target="_blank" rel="noreferrer"
            style={{ background: '#ea580c', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}>
            Book →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HotelSwiper({ hotels }) {
  const dbHotels = (hotels || []).map(h => ({
    name: h.name, city: 'Nashik', state: 'Maharashtra',
    rating: Math.round(h.rating) || 3,
    price: h.priceRange?.min || 0,
    type: h.type === 'mid-range' ? 'Mid-range' : h.type === 'luxury' ? 'Luxury' : 'Budget',
    rooms: h.totalRooms || h.availableRooms,
    amenities: h.amenities || [],
    images: h.images?.length ? h.images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'],
    distanceKm: h.distanceKm ?? null,
  }));

  const allHotels = dbHotels.length > 0 ? dbHotels : INDIA_HOTELS;

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>
        🏨 {allHotels.length} hotels {dbHotels.length > 0 ? 'near you' : 'across India'} · Swipe to explore
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={12}
        slidesPerView={1.2}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: true }}
        style={{ paddingBottom: '28px' }}
      >
        {allHotels.map((hotel, i) => (
          <SwiperSlide key={i} style={{ height: 'auto' }}>
            <SingleHotelCard hotel={hotel} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
