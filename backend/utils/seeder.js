const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

mongoose.connect('mongodb://localhost:27017/shopsphere');

const importData = async () => {
  try {
    // Clear everything
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // Drop indexes to avoid slug conflicts
    await Category.collection.dropIndexes();
    await Product.collection.dropIndexes();

    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Gadgets and electronics' },
      { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
      { name: 'Books', slug: 'books', description: 'Books and stationery' },
      { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances' },
    ];

    const createdCategories = await Category.insertMany(categories);
    const electronicsId = createdCategories[0]._id;

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopsphere.com',
      password: 'admin123',
      role: 'admin',
    });

   const sampleProducts = [
  // ── Electronics ──
  {
    name: 'Wireless Pro Headphones',
    slug: 'wireless-pro-headphones',
    description: 'Premium sound quality with 30-hour battery life and active noise cancellation.',
    price: 4999, discountPrice: 3499,
    category: createdCategories[0]._id, brand: 'SoundMax', stock: 50, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' }],
    tags: ['audio', 'wireless'], seller: adminUser._id,
  },
  {
    name: 'Smart Watch Series X',
    slug: 'smart-watch-series-x',
    description: 'Track fitness, notifications, and health metrics with style.',
    price: 8999, discountPrice: 6999,
    category: createdCategories[0]._id, brand: 'TechWear', stock: 30, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }],
    tags: ['smartwatch', 'fitness'], seller: adminUser._id,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    slug: 'mechanical-gaming-keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches for tactile typing.',
    price: 3499, discountPrice: 2999,
    category: createdCategories[0]._id, brand: 'KeyMaster', stock: 25, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500' }],
    tags: ['gaming', 'keyboard'], seller: adminUser._id,
  },
  {
    name: 'Portable SSD 1TB',
    slug: 'portable-ssd-1tb',
    description: 'Ultra-fast portable storage with USB 3.2 Gen 2 speeds up to 1050MB/s.',
    price: 6499, discountPrice: 5299,
    category: createdCategories[0]._id, brand: 'SpeedDrive', stock: 40, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=500' }],
    tags: ['storage', 'ssd'], seller: adminUser._id,
  },
  {
    name: 'Noise Cancelling Earbuds',
    slug: 'noise-cancelling-earbuds',
    description: 'True wireless earbuds with ANC and 24hr total battery life.',
    price: 2999, discountPrice: 2499,
    category: createdCategories[0]._id, brand: 'SoundMax', stock: 60, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500' }],
    tags: ['earbuds', 'wireless'], seller: adminUser._id,
  },
  {
    name: '4K Webcam Ultra HD',
    slug: '4k-webcam-ultra-hd',
    description: 'Crystal clear 4K video for professional streaming and video calls.',
    price: 5999, discountPrice: 4799,
    category: createdCategories[0]._id, brand: 'VisionTech', stock: 20, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500' }],
    tags: ['webcam', '4k'], seller: adminUser._id,
  },

  // ── Men's Clothing ──
  {
    name: "Men's Classic Cotton T-Shirt",
    slug: 'mens-classic-cotton-tshirt',
    description: 'Premium 100% cotton t-shirt with comfortable regular fit.',
    price: 799, discountPrice: 599,
    category: createdCategories[1]._id, brand: 'FashionHub', stock: 100, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' }],
    tags: ['tshirt', 'cotton', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Slim Fit Jeans",
    slug: 'mens-slim-fit-jeans',
    description: 'Comfortable slim fit jeans with stretch fabric for all-day wear.',
    price: 2499, discountPrice: 1799,
    category: createdCategories[1]._id, brand: 'DenimCo', stock: 60, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500' }],
    tags: ['jeans', 'denim', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Formal Shirt",
    slug: 'mens-formal-shirt',
    description: 'Classic white formal shirt with regular fit for office wear.',
    price: 1499, discountPrice: 1199,
    category: createdCategories[1]._id, brand: 'OfficePro', stock: 90, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500' }],
    tags: ['shirt', 'formal', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Polo T-Shirt",
    slug: 'mens-polo-tshirt',
    description: 'Classic polo t-shirt in premium pique cotton fabric.',
    price: 999, discountPrice: 799,
    category: createdCategories[1]._id, brand: 'FashionHub', stock: 85, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500' }],
    tags: ['polo', 'tshirt', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Graphic Hoodie",
    slug: 'mens-graphic-hoodie',
    description: 'Trendy oversized graphic hoodie in premium fleece fabric.',
    price: 1999, discountPrice: 1499,
    category: createdCategories[1]._id, brand: 'UrbanWear', stock: 85, isFeatured: true,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781673579/pexels-mag-photography-1501456-14241847_j0nmiq.jpg' }],
    tags: ['hoodie', 'men', 'graphic'], seller: adminUser._id,
  },
  {
    name: "Men's Chino Pants",
    slug: 'mens-chino-pants',
    description: 'Slim fit chino pants in stretchable cotton blend. Ideal for smart casual wear.',
    price: 1799, discountPrice: 1299,
    category: createdCategories[1]._id, brand: 'StyleCo', stock: 60, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500' }],
    tags: ['chino', 'pants', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Linen Shirt",
    slug: 'mens-linen-shirt',
    description: 'Breathable linen shirt perfect for summer. Available in multiple pastel shades.',
    price: 1499, discountPrice: 1099,
    category: createdCategories[1]._id, brand: 'SummerVibes', stock: 70, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500' }],
    tags: ['linen', 'shirt', 'men', 'summer'], seller: adminUser._id,
  },
  {
    name: "Men's Bomber Jacket",
    slug: 'mens-bomber-jacket',
    description: 'Stylish bomber jacket with ribbed cuffs and collar. Great for autumn wear.',
    price: 3499, discountPrice: 2799,
    category: createdCategories[1]._id, brand: 'UrbanWear', stock: 40, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500' }],
    tags: ['bomber', 'jacket', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Tracksuit Set",
    slug: 'mens-tracksuit-set',
    description: 'Comfortable tracksuit set with jacket and pants in moisture-wicking fabric.',
    price: 2499, discountPrice: 1999,
    category: createdCategories[1]._id, brand: 'SportsFit', stock: 55, isFeatured: false,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781761970/pexels-qamar-rehman-94539242-15868727_nhbcp7.jpg' }],
    tags: ['tracksuit', 'men', 'sports'], seller: adminUser._id,
  },
  {
    name: "Men's Ethnic Kurta",
    slug: 'mens-ethnic-kurta',
    description: 'Traditional cotton kurta with embroidery detailing. Perfect for festive occasions.',
    price: 1299, discountPrice: 999,
    category: createdCategories[1]._id, brand: 'EthnicWear', stock: 65, isFeatured: true,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1782364653/pexels-the-kzari-design-studio-844576064-31371016_j2sum7.jpg' }],
    tags: ['kurta', 'ethnic', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Denim Jacket",
    slug: 'mens-denim-jacket',
    description: 'Classic denim jacket with button closure. A timeless wardrobe essential.',
    price: 2999, discountPrice: 2299,
    category: createdCategories[1]._id, brand: 'DenimCo', stock: 45, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=500' }],
    tags: ['denim', 'jacket', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Cargo Pants",
    slug: 'mens-cargo-pants',
    description: 'Multi-pocket cargo pants in durable cotton twill. Great for outdoor activities.',
    price: 1999, discountPrice: 1599,
    category: createdCategories[1]._id, brand: 'OutdoorPro', stock: 50, isFeatured: false,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781674280/pexels-quang-viet-nguyen-107013384-11716437_hmeqhg.jpg' }],
    tags: ['cargo', 'pants', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Woolen Sweater",
    slug: 'mens-woolen-sweater',
    description: 'Warm woolen sweater with ribbed texture. Perfect for cold winter days.',
    price: 2299, discountPrice: 1799,
    category: createdCategories[1]._id, brand: 'WarmWear', stock: 40, isFeatured: true,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781762822/pexels-koraybozkurt-14756273_ro7i8i.jpg' }],
    tags: ['sweater', 'woolen', 'men', 'winter'], seller: adminUser._id,
  },
   {
    name: "Men's Casual Checked Shirt",
    slug: 'mens-casual-checked-shirt',
    description: 'Comfortable checked casual shirt in soft cotton fabric, perfect for everyday wear.',
    price: 1399, discountPrice: 999,
    category: createdCategories[1]._id, brand: 'CasualCo', stock: 75, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80' }],
    tags: ['shirt', 'casual', 'men'], seller: adminUser._id,
  },
  {
    name: "Men's Joggers Track Pants",
    slug: 'mens-joggers-track-pants',
    description: 'Comfortable jogger track pants with elastic cuffs, ideal for workouts and lounging.',
    price: 1299, discountPrice: 999,
    category: createdCategories[1]._id, brand: 'SportsFit', stock: 80, isFeatured: false,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781762649/pexels-youssef-mahmoud-2154095663-33055599_sctx2f.jpg' }],
    tags: ['joggers', 'trackpants', 'men'], seller: adminUser._id,
  },
  
  {
    name: "Men's Round Neck Sweatshirt",
    slug: 'mens-round-neck-sweatshirt',
    description: 'Cozy round neck sweatshirt in fleece fabric for casual everyday comfort.',
    price: 1599, discountPrice: 1199,
    category: createdCategories[1]._id, brand: 'CasualCo', stock: 70, isFeatured: true,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781761776/pexels-dhanno-29504054_a4ivgf.jpg' }],
    tags: ['sweatshirt', 'casual', 'men'], seller: adminUser._id,
  },


  // ── Women's Clothing ──
  {
    name: "Women's Floral Kurti",
    slug: 'womens-floral-kurti',
    description: 'Beautiful floral print kurti perfect for casual and festive occasions.',
    price: 1299, discountPrice: 999,
    category: createdCategories[1]._id, brand: 'EthnicWear', stock: 75, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500' }],
    tags: ['kurti', 'women', 'ethnic'], seller: adminUser._id,
  },
  {
    name: "Women's Maxi Dress",
    slug: 'womens-maxi-dress',
    description: 'Elegant flowy maxi dress in chiffon fabric. Perfect for parties and events.',
    price: 2499, discountPrice: 1899,
    category: createdCategories[1]._id, brand: 'GlowFashion', stock: 50, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500' }],
    tags: ['maxi', 'dress', 'women', 'party'], seller: adminUser._id,
  },
  {
    name: "Women's Denim Jacket",
    slug: 'womens-denim-jacket',
    description: 'Cropped denim jacket with distressed details. A must-have fashion staple.',
    price: 2799, discountPrice: 2199,
    category: createdCategories[1]._id, brand: 'DenimCo', stock: 45, isFeatured: false,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1782364274/pexels-kamyar-dehghan-211352708-12003334_vttsln.jpg' }],
    tags: ['denim', 'jacket', 'women'], seller: adminUser._id,
  },
  {
    name: "Women's Palazzo Pants",
    slug: 'womens-palazzo-pants',
    description: 'Wide leg palazzo pants in georgette fabric. Comfortable and stylish.',
    price: 1299, discountPrice: 999,
    category: createdCategories[1]._id, brand: 'EthnicWear', stock: 70, isFeatured: false,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781674866/pexels-enginakyurt-19995459_iyhw86.jpg' }],
    tags: ['palazzo', 'pants', 'women'], seller: adminUser._id,
  },
  {
    name: "Women's Crop Top",
    slug: 'womens-crop-top',
    description: 'Trendy crop top in ribbed cotton fabric. Perfect for casual and party wear.',
    price: 799, discountPrice: 599,
    category: createdCategories[1]._id, brand: 'GlowFashion', stock: 100, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500' }],
    tags: ['crop', 'top', 'women', 'casual'], seller: adminUser._id,
  },
  {
  name: "Women's Lehenga Choli",
  slug: 'womens-lehenga-choli',
  description: 'Gorgeous embroidered lehenga choli set for weddings and festive occasions.',
  price: 5999,
  discountPrice: 4799,
  category: createdCategories[1]._id,
  brand: 'EthnicWear',
  stock: 20,
  isFeatured: true,
  images: [
    {
      url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781674704/pexels-pratik-patil-415018186-16803130_lcihem.jpg'
    }
  ],
  tags: ['lehenga', 'ethnic', 'women', 'wedding'],
  seller: adminUser._id,
},
 {
    name: "Women's Denim Skirt",
    slug: 'womens-denim-skirt',
    description: 'Trendy A-line denim skirt with button closure, great for casual styling.',
    price: 1299, discountPrice: 999,
    category: createdCategories[1]._id, brand: 'DenimCo', stock: 55, isFeatured: false,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781762260/pexels-mehti-jabari-2159306421-36093237_nawvio.jpg' }],
    tags: ['skirt', 'denim', 'women'], seller: adminUser._id,
  },
  {
  name: "Women's Blazer Formal",
  slug: 'womens-blazer-formal',
  description: 'Sharp formal blazer in premium polyester blend. Perfect for office and meetings.',
  price: 2999,
  discountPrice: 2399,
  category: createdCategories[1]._id,
  brand: 'OfficePro',
  stock: 35,
  isFeatured: false,
  images: [
    {
      url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781675006/pexels-musaabzayona-19531053_df0jdw.jpg'
    }
  ],
  tags: ['blazer', 'formal', 'women', 'office'],
  seller: adminUser._id,
},
  {
    name: "Women's Anarkali Suit",
    slug: 'womens-anarkali-suit',
    description: 'Beautiful floor-length Anarkali suit with dupatta. Ideal for festive wear.',
    price: 3499, discountPrice: 2799,
    category: createdCategories[1]._id, brand: 'EthnicWear', stock: 30, isFeatured: true,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781762494/pexels-hemant-saini-2148893253-33363057_uittnz.jpg' }],
    tags: ['anarkali', 'ethnic', 'women'], seller: adminUser._id,
  },
  {
    name: "Women's Cardigan Knit",
    slug: 'womens-cardigan-knit',
    description: 'Soft knitted cardigan with button closure. Perfect layering piece for winters.',
    price: 1799, discountPrice: 1399,
    category: createdCategories[1]._id, brand: 'WarmWear', stock: 55, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500' }],
    tags: ['cardigan', 'knit', 'women', 'winter'], seller: adminUser._id,
  },
  
  {
  name: "Women's Saree Cotton",
  slug: 'womens-saree-cotton',
  description: 'Elegant handloom cotton saree with traditional border design.',
  price: 2999,
  discountPrice: 2299,
  category: createdCategories[1]._id,
  brand: 'EthnicWear',
  stock: 35,
  isFeatured: true,
  images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781674472/pexels-mehedi-30703872_pfosaz.jpg' }],
  tags: ['saree', 'cotton', 'women'],
  seller: adminUser._id,
},

  // ── Books ──
  {
    name: 'The Alchemist',
    slug: 'the-alchemist',
    description: 'Paulo Coelho\'s masterpiece about following your dreams.',
    price: 399, discountPrice: 299,
    category: createdCategories[2]._id, brand: 'HarperCollins', stock: 200, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500' }],
    tags: ['novel', 'fiction','books'], seller: adminUser._id,
  },
  {
    name: 'Atomic Habits',
    slug: 'atomic-habits',
    description: 'James Clear\'s guide to building good habits and breaking bad ones.',
    price: 599, discountPrice: 449,
    category: createdCategories[2]._id, brand: 'Penguin', stock: 150, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500' }],
    tags: ['self-help', 'habits','books'], seller: adminUser._id,
  },
  {
    name: 'Clean Code',
    slug: 'clean-code',
    description: 'Robert C. Martin\'s handbook of agile software craftsmanship.',
    price: 1299, discountPrice: 999,
    category: createdCategories[2]._id, brand: 'Prentice Hall', stock: 80, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' }],
    tags: ['programming', 'coding','books'], seller: adminUser._id,
  },
  {
    name: 'Wings of Fire',
    slug: 'wings-of-fire',
    description: 'Autobiography of Dr. APJ Abdul Kalam India\'s beloved scientist president.',
    price: 299, discountPrice: 199,
    category: createdCategories[2]._id, brand: 'Universities Press', stock: 250, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500' }],
    tags: ['biography', 'inspiration','books'], seller: adminUser._id,
  },

  // ── Home & Kitchen ──
  {
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: 'Double-walled insulated bottle keeps drinks cold 24hrs and hot 12hrs.',
    price: 899, discountPrice: 699,
    category: createdCategories[3]._id, brand: 'HydroLife', stock: 120, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500' }],
    tags: ['bottle', 'kitchen'], seller: adminUser._id,
  },
  {
    name: 'Non-Stick Cookware Set',
    slug: 'non-stick-cookware-set',
    description: '5-piece premium non-stick cookware set with glass lids.',
    price: 4999, discountPrice: 3799,
    category: createdCategories[3]._id, brand: 'ChefMaster', stock: 35, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500' }],
    tags: ['cookware', 'kitchen'], seller: adminUser._id,
  },
  {
    name: 'LED Desk Lamp',
    slug: 'led-desk-lamp',
    description: 'Eye-caring LED lamp with 5 color modes and USB charging port.',
    price: 1999, discountPrice: 1499,
    category: createdCategories[3]._id, brand: 'BrightHome', stock: 70, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500' }],
    tags: ['lamp', 'led', 'desk'], seller: adminUser._id,
  },
  {
    name: 'Air Fryer 4L Digital',
    slug: 'air-fryer-4l-digital',
    description: 'Digital air fryer with 8 preset cooking modes and touch panel.',
    price: 6999, discountPrice: 5499,
    category: createdCategories[3]._id, brand: 'ChefMaster', stock: 28, isFeatured: true,
    images: [{ url: 'https://res.cloudinary.com/dyxrqqx3s/image/upload/v1781672183/422476-tower-4l-digital-air-fryer-2_jquudh.jpg' }],
    tags: ['airfryer', 'cooking', 'kitchen'], seller: adminUser._id,
  },
  {
    name: 'Mixer Grinder 750W',
    slug: 'mixer-grinder-750w',
    description: 'Powerful 750W mixer grinder with 3 jars and multiple speed settings.',
    price: 3999, discountPrice: 3199,
    category: createdCategories[3]._id, brand: 'HomeApply', stock: 45, isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500' }],
    tags: ['mixer', 'grinder', 'kitchen'], seller: adminUser._id,
  },
];

    await Product.insertMany(sampleProducts);

    console.log('✅ Data seeded successfully!');
    console.log('👤 Admin email: admin@shopsphere.com');
    console.log('🔑 Admin password: admin123');
    console.log(`📦 ${sampleProducts.length} products added`);
    console.log(`🗂️  ${categories.length} categories added`);
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log('🗑️  Data destroyed');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}