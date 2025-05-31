import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
  } catch (error: any) {
    console.error('Error creating business:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Debug logging
    console.log('Fetching businesses for user:', session.user.email);

    const businesses = await Business.find({ 
      userId: session.user.email  // Always use email as the userId
    });

    console.log('Found businesses:', businesses);

    return NextResponse.json(businesses);
  } catch (error: any) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  } catch (error: any) {
    console.error('Error updating business:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 