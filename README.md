# Gulf Coast Directory

A comprehensive directory website for tourists visiting the Gulf Coast of America, featuring businesses, attractions, and services across Texas, Louisiana, Mississippi, Alabama, and Florida.

## Features

- **State-based Navigation**: Browse by Gulf Coast states
- **City-specific Pages**: Detailed information for each coastal city
- **Business Categories**: Hotels, restaurants, beaches, bars, water sports, fishing charters, and more
- **Google Maps Integration**: Interactive maps with business locations
- **Search & Filters**: Find businesses by location, category, and amenities
- **Admin Panel**: Manage listings and import data
- **Responsive Design**: Mobile-first approach for tourists on the go

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API routes + Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Maps**: Google Maps JavaScript API + Places API
- **Image Storage**: Cloudinary
- **Hosting**: Vercel + Supabase/Neon

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/rush828/GulfCoastDirectory.git
   cd GulfCoastDirectory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys and database URL
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main models:
- **State**: Gulf Coast states (TX, LA, MS, AL, FL)
- **City**: Coastal cities within each state
- **Category**: Business categories and subcategories
- **Listing**: Individual business listings with contact info and location
- **Media**: Images and media files for listings

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   ├── states/            # State listing and detail pages
│   ├── [stateSlug]/       # Dynamic state routes
│   ├── search/            # Search functionality
│   └── api/               # API routes
├── components/             # Reusable UI components
├── lib/                    # Utility functions and configurations
└── types/                  # TypeScript type definitions
```

## API Routes

- `GET /api/states` - List all Gulf Coast states
- `GET /api/states/[slug]` - Get state details
- `GET /api/cities/[stateSlug]` - Get cities for a state
- `GET /api/listings` - Search and filter listings
- `GET /api/listings/[id]` - Get listing details

## Google Maps Setup

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Add your API key to `.env.local`

## Deployment

1. **Deploy to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Set up production environment variables** in Vercel dashboard

3. **Deploy database** to Supabase or Neon

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please open an issue on GitHub.

## Roadmap

- [ ] User reviews and ratings
- [ ] Business hours and availability
- [ ] Mobile app development
- [ ] Advanced search filters
- [ ] Social media integration
- [ ] Newsletter subscription
- [ ] Business owner dashboard
