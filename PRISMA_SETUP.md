# Prisma Database Setup - YourNextBlinds

## Ì≥ã What Was Created

### Files Created:
1. **`prisma/schema.prisma`** - Complete database schema
2. **`prisma/README.md`** - Detailed documentation
3. **`.env.example`** - Environment variables template

### Schema Overview:

#### ÌªçÔ∏è Product Models (7 models)
- `Product` - Main product with pricing, stock, delivery
- `ProductImage` - Multiple images with ordering
- `Category` - Product categories
- `Tag` - Search/filter tags  
- `ProductCategory` - Product ‚Üî Category relation
- `ProductTag` - Product ‚Üî Tag relation

#### ‚öôÔ∏è Customization Models (3 models)
- `Customization` - Root options (Headrail, Bottom Chain, etc.)
- `CustomizationOption` - Values with pricing (Classic, Platinum, etc.)
  - **Supports nesting via `parentOptionId`**
  - Each option has its own price
- `ProductCustomization` - Product ‚Üî Customization relation

#### ‚≠ê Review Model
- `Review` - Customer reviews with moderation

## Ì¥ë Key Features

### 1. Nested Customizations
```
Customization: "Headrail"
‚îú‚îÄ Option: "Classic Headrail" (¬£0)
‚îÇ  ‚îú‚îÄ Child: "White" (¬£0)
‚îÇ  ‚îî‚îÄ Child: "Black" (¬£0)
‚îî‚îÄ Option: "Platinum Headrail" (¬£50)
   ‚îú‚îÄ Child: "Silver" (¬£10)
   ‚îî‚îÄ Child: "Gold" (¬£20)
```

### 2. Flexible Pricing
- `price`: Amount (Decimal)
- `priceType`: FIXED | PERCENTAGE | FREE

### 3. Product-Specific Options
Each product can have different customizations via `ProductCustomization`

## Ì∫Ä Next Steps

### 1. Install Prisma
```bash
npm install prisma @prisma/client
npm install -D prisma tsx
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL
```

### 3. Initialize Database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# OR use migrations (for production)
npm run db:migrate
```

### 4. View Database
```bash
npm run db:studio
```

## Ì≥ä Database Options

### PostgreSQL (Recommended)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/yournextblinds"
```

### MySQL
```env
DATABASE_URL="mysql://user:password@localhost:3306/yournextblinds"
```

### SQLite (Development)
```env
DATABASE_URL="file:./dev.db"
```

## Ìº± Seeding Data

You'll need to create a seed script to import from `dataset.json`:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import dataset from '../dataset.json';

const prisma = new PrismaClient();

async function main() {
  // Import products from dataset.json
  for (const item of dataset) {
    await prisma.product.create({
      data: {
        sourceId: item.source.id,
        slug: item.source.canonicalUrl.split('/').pop(),
        name: item.title,
        description: item.description,
        // ... map other fields
      }
    });
  }
}

main();
```

## Ì≥ñ Usage Examples

### Query Product with All Relations
```typescript
const product = await prisma.product.findUnique({
  where: { slug: 'pacific-white' },
  include: {
    images: true,
    categories: { include: { category: true } },
    productCustomizations: {
      include: {
        customization: {
          include: {
            options: {
              include: { childOptions: true }
            }
          }
        }
      }
    },
    reviews: { where: { isApproved: true } }
  }
});
```

### Create Customization with Nested Options
```typescript
const headrail = await prisma.customization.create({
  data: {
    name: 'headrail',
    label: 'Select Your Headrail',
    type: 'SELECTOR',
    options: {
      create: [
        {
          name: 'classic',
          label: 'Classic Headrail',
          price: 0,
          priceType: 'FREE',
          childOptions: {
            create: [
              { name: 'white', label: 'White', price: 0 },
              { name: 'black', label: 'Black', price: 5 }
            ]
          }
        },
        {
          name: 'platinum',
          label: 'Platinum Headrail',
          price: 50,
          priceType: 'FIXED'
        }
      ]
    }
  }
});
```

## Ì¥ç Prisma Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to DB (dev) |
| `npm run db:migrate` | Create migration (prod) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database |

## ‚úÖ Schema Validation

The schema includes:
- ‚úÖ Proper indexes for performance
- ‚úÖ Cascade deletes for data integrity
- ‚úÖ Timestamps on all models
- ‚úÖ Enums for type safety
- ‚úÖ Decimal precision for pricing
- ‚úÖ Unique constraints
- ‚úÖ Foreign key relations

Ready to use! Ìæâ
