# Mars International Admin

Real estate management system for Mars International properties. Built with Laravel 12, Inertia.js v2, and React 19.

## Project Overview

Mars International Admin is a property management platform that allows real estate portfolio managers and sales teams to manage projects and units with comprehensive media handling, role-based access control, and public property listings.

### Core Functionality

**Project Management**
- Create, update, and manage real estate projects
- Multi-image upload support with hero and gallery collections
- Automatic image conversions (thumbnail, preview, large)
- Project attributes: location, pricing, status, amenities, completion dates
- Slug-based public URLs for property listings
- Featured and active/inactive toggles

**Unit Management**
- Manage individual units within projects (apartments, offices, etc.)
- Unit specifications: type, floor, size (sqft/sqm), bedrooms, bathrooms
- Pricing per unit with currency support
- Status tracking (available, sold, reserved)
- Features: balcony, parking spots, view types
- Floor plan uploads with single-file media collection
- Unit image galleries

**User & Role Management**
- Role-based access control using Spatie Permission
- Three predefined roles: `admin`, `portfolio_manager`, `salesperson`
- User CRUD operations with role assignment
- Authentication via Laravel Fortify

**Media Management**
- Image upload and management using Spatie Media Library
- Projects: hero images and gallery collections
- Units: image galleries and floor plan uploads
- Automatic image conversions for web optimization

**Public Listings**
- Public project pages accessible via `/p/{slug}`
- No authentication required for viewing listings

## Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm
- SQLite (default) or MySQL/PostgreSQL

### Setup

1. Clone the repository and install dependencies:
```bash
composer install
npm install
```

2. Configure environment:
```bash
cp .env.example .env
php artisan key:generate
```

3. Configure database in `.env`:
```env
# SQLite (default)
DB_CONNECTION=sqlite

# Or MySQL/PostgreSQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mars_admin
DB_USERNAME=root
DB_PASSWORD=
```

4. Create SQLite database file if using SQLite:
```bash
touch database/database.sqlite
```

5. Run migrations and seeders:
```bash
php artisan migrate:fresh --seed
```

6. Create symbolic link for public storage:
```bash
php artisan storage:link
```

7. Build frontend assets:
```bash
npm run build
```

## Seeder Data

The database seeder (`php artisan migrate:fresh --seed`) creates the following test data:

### Roles
- `admin` - Full system access
- `portfolio_manager` - Project and unit management
- `salesperson` - Sales and inquiry management

### Test User
- **Email:** test@example.com
- **Password:** password
- **Role:** admin

### Projects
- **10 sample projects** with complete details
- Each project includes location, pricing, status, amenities
- Random completion dates and developer information

### Units
- **5-15 units per project** (randomized)
- Varied unit types: apartment, penthouse, studio, office
- Complete specifications: size, bedrooms, bathrooms, pricing
- Random features: balconies, parking spots, views
- Different statuses: available, sold, reserved

Total: ~100+ units across all projects ready for testing.

## Development

Start the development environment with hot module replacement:

```bash
composer run dev
```

This concurrently runs:
- Laravel development server (http://localhost:8000)
- Queue worker
- Log viewer (Pail)
- Vite dev server with HMR

Or run services individually:
```bash
php artisan serve
php artisan queue:listen
npm run dev
```

## Testing

Run the test suite:
```bash
composer test
# or
php artisan test
```

Run specific test file:
```bash
php artisan test tests/Feature/UserControllerTest.php
```

Filter by test name:
```bash
php artisan test --filter=testName
```

## Code Style

Format code with Laravel Pint:
```bash
vendor/bin/pint
```

Fix only changed files:
```bash
vendor/bin/pint --dirty
```

## Key Technologies

- **Backend:** Laravel 12 with modern PHP 8.4 features
- **Frontend:** React 19 with Inertia.js v2 for SPA experience
- **Styling:** Tailwind CSS v4
- **Authentication:** Laravel Fortify
- **Permissions:** Spatie Laravel Permission
- **Media:** Spatie Laravel Media Library with image conversions
- **Type Safety:** Laravel Wayfinder for TypeScript route generation
- **Testing:** Pest v4 with browser testing support
- **Dev Tools:** Laravel Pint, Pail, Sail

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── ProjectController.php      # Project CRUD + image management
│   │   ├── PublicProjectController.php # Public project pages
│   │   ├── UnitController.php         # Unit management within projects
│   │   └── UserController.php         # User & role management
│   └── Requests/
│       ├── StoreProjectRequest.php
│       ├── UpdateProjectRequest.php
│       ├── StoreUserRequest.php
│       └── UpdateUserRequest.php
└── Models/
    ├── Project.php  # HasMany units, implements HasMedia
    ├── Unit.php     # BelongsTo project, implements HasMedia
    └── User.php     # Uses Spatie HasRoles

resources/js/
├── Pages/
│   ├── projects/   # Project management UI
│   ├── users/      # User management UI
│   └── welcome.tsx # Public homepage
└── components/     # Reusable React components

database/
├── factories/
│   ├── ProjectFactory.php
│   └── UnitFactory.php
└── seeders/
    ├── RoleSeeder.php     # Creates 3 roles
    ├── UserSeeder.php     # Creates admin user
    ├── ProjectSeeder.php  # Creates 10 projects
    └── UnitSeeder.php     # Creates 5-15 units per project
```

## Routes

### Public Routes
- `GET /` - Homepage
- `GET /p/{slug}` - Public project detail page

### Authenticated Routes
- `GET /dashboard` - Admin dashboard
- Resource routes for `projects`, `users`
- `POST /projects/{project}/images` - Upload project images
- `DELETE /projects/{project}/images` - Delete project image
- `POST /projects/{project}/units` - Create unit
- `PUT /projects/{project}/units/{unit}` - Update unit
- `DELETE /projects/{project}/units/{unit}` - Delete unit
- `POST /units/{unit}/images` - Upload unit images
- `DELETE /units/{unit}/images` - Delete unit image

## Environment Variables

Key configuration:
```env
APP_NAME="Mars International"
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite

FILESYSTEM_DISK=public
QUEUE_CONNECTION=database

MAIL_MAILER=log
```

## License

MIT
