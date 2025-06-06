import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Business } from '@/models/Business';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in again' }, { status: 401 });
    }

    if (!session.user.email) {
      return NextResponse.json({ error: 'Invalid user email' }, { status: 400 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }
    
    await dbConnect();

    // Check if user already has a business
    const existingBusiness = await Business.findOne({ userId: session.user.email });
    if (existingBusiness) {
      return NextResponse.json({ error: 'User already has a business' }, { status: 409 });
    }

    // Debug logging
    console.log('Creating business for user:', session.user.email);

    const business = await Business.create({
      userId: session.user.email,
      name: body.name,
      description: body.description || '',
      industry: body.industry || '',
      foundedDate: body.foundedDate || new Date(),
      logo: body.logo || '',
      totalInvestment: 0,
      totalExpenses: 0,
      totalSales: 0
    });

    console.log('Created business:', {
      id: business._id,
      name: business.name,
      userId: business.userId
    });

    return NextResponse.json(business);
  } catch (error: Error | unknown) {
    console.error('Error creating business:', error);
    
    // Handle MongoDB specific errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key error')) {
        return NextResponse.json({ error: 'A business already exists for this user' }, { status: 409 });
      }
      if (error.message.includes('validation failed')) {
        return NextResponse.json({ error: 'Invalid business data provided' }, { status: 400 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in again' }, { status: 401 });
    }

    await dbConnect();

    // Debug logging
    console.log('Fetching businesses for user:', session.user.email);

    const businesses = await Business.find({ 
      userId: session.user.email  // Always use email as the userId
    }).select('-__v').lean(); // Optimize query by excluding version field and using lean()

    if (!businesses || businesses.length === 0) {
      return NextResponse.json({ error: 'No business found - Please create one first' }, { status: 404 });
    }

    console.log('Found businesses:', businesses.length);

    return NextResponse.json(businesses);
  } catch (error: Error | unknown) {
    console.error('Error fetching businesses:', error);
    
    // Handle MongoDB connection errors
    if (error instanceof Error && error.message.includes('MONGODB_URI')) {
      return NextResponse.json({ error: 'Database connection error - Please try again later' }, { status: 503 });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Debug log the incoming data
    console.log('Updating business with data:', {
      name: body.name,
      hasLogo: !!body.logo,
      logoPreview: body.logo?.substring(0, 50) + '...'
    });
    
    await dbConnect();

    // Find and update the business
    const business = await Business.findOneAndUpdate(
      { userId: session.user.email },
      { 
        $set: {
          name: body.name,
          description: body.description,
          industry: body.industry,
          foundedDate: body.foundedDate,
          logo: body.logo || '' // Ensure logo is never undefined
        }
      },
      { new: true }
    );

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Debug log the updated business
    console.log('Updated business:', {
      name: business.name,
      hasLogo: !!business.logo,
      logoPreview: business.logo?.substring(0, 50) + '...'
    });

    return NextResponse.json(business);
  } catch (error: Error | unknown) {
    console.error('Error updating business:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 