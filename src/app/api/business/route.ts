import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Business } from '@/models/Business';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    await dbConnect();

    // Debug logging
    console.log('Creating business with session user:', session.user);

    const business = await Business.create({
      ...body,
      userId: session.user.email, // Always use email as the userId
    });

    console.log('Created business:', business);

    return NextResponse.json(business);
  } catch (error: Error | unknown) {
    console.error('Error creating business:', error);
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