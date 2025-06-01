import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Transaction } from '@/models/Transaction';
import { Business } from '@/models/Business';

interface TransactionFilters {
  businessId: string;
  date?: {
    $gte: Date;
    $lte: Date;
  };
  type?: string;
  category?: string;
}

export async function POST(req: Request) {
  try {
    const authSession = await getServerSession(authOptions);
    
    if (!authSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Debug logging
    console.log('Received transaction data:', body);
    console.log('Auth session user:', authSession.user);
    
    // Validate required fields
    if (!body.businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }
    if (!body.type || !['investment', 'expense', 'sale'].includes(body.type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }
    if (!body.amount || isNaN(body.amount) || body.amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    if (!body.description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    await dbConnect();

    try {
      // Debug logging for business search
      console.log('Searching for business with criteria:', {
        _id: body.businessId,
        userId: authSession.user.email,
      });

      // Verify business ownership with projection
      const business = await Business.findOne(
        {
          _id: body.businessId,
          userId: authSession.user.email,
        },
        { _id: 1, totalInvestment: 1, totalExpenses: 1, totalSales: 1 }
      );

      console.log('Found business:', business);

      if (!business) {
        return NextResponse.json({ error: 'Business not found or unauthorized' }, { status: 404 });
      }

      // Create transaction
      const transactionData = {
        ...body,
        date: body.date || new Date(),
        category: body.category || 'other',
      };
      
      console.log('Creating transaction with data:', transactionData);
      
      const transaction = await Transaction.create(transactionData);

      // Update business totals
      const updateQuery: Record<string, number> = {};
      if (body.type === 'investment') {
        updateQuery.totalInvestment = (business.totalInvestment || 0) + body.amount;
      } else if (body.type === 'expense') {
        updateQuery.totalExpenses = (business.totalExpenses || 0) + body.amount;
      } else if (body.type === 'sale') {
        updateQuery.totalSales = (business.totalSales || 0) + body.amount;
      }

      console.log('Updating business totals:', updateQuery);

      await Business.updateOne(
        { _id: body.businessId },
        { $set: updateQuery }
      );

      return NextResponse.json(transaction);
    } catch (error: Error | unknown) {
      console.error('Transaction error:', error);
      if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json({ error: 'Invalid transaction data' }, { status: 400 });
      }
      throw error;
    }
  } catch (error: Error | unknown) {
    console.error('Server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ 
      error: process.env.NODE_ENV === 'development' 
        ? errorMessage
        : 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Verify business ownership with projection
    const business = await Business.findOne(
      {
        _id: businessId,
        userId: session.user.email,
      },
      { _id: 1 }
    );

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Build query filters
    const query: TransactionFilters = { businessId };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (type) {
      query.type = type;
    }
    if (category) {
      query.category = category;
    }

    // Execute query with pagination and projection
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .select('type amount description date category')
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(query)
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error: Error | unknown) {
    console.error('Server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 