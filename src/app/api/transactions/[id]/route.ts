import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import { Transaction } from '@/models/Transaction';
import { Business } from '@/models/Business';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authSession = await getServerSession(authOptions);
    
    if (!authSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find the transaction first
    const transaction = await Transaction.findById(params.id);
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Verify business ownership
    const business = await Business.findOne({
      _id: transaction.businessId,
      userId: authSession.user.email,
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found or unauthorized' }, { status: 404 });
    }

    // Update business totals
    const updateQuery: Record<string, number> = {};
    if (transaction.type === 'investment') {
      updateQuery.totalInvestment = business.totalInvestment - transaction.amount;
    } else if (transaction.type === 'expense') {
      updateQuery.totalExpenses = business.totalExpenses - transaction.amount;
    } else if (transaction.type === 'sale') {
      updateQuery.totalSales = business.totalSales - transaction.amount;
    }

    // Delete transaction and update business totals
    await Transaction.findByIdAndDelete(params.id);
    await Business.updateOne(
      { _id: transaction.businessId },
      { $set: updateQuery }
    );

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authSession = await getServerSession(authOptions);
    
    if (!authSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    await dbConnect();

    // Find the transaction first
    const transaction = await Transaction.findById(params.id);
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Verify business ownership
    const business = await Business.findOne({
      _id: transaction.businessId,
      userId: authSession.user.email,
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found or unauthorized' }, { status: 404 });
    }

    // Calculate the difference in amount for updating totals
    const amountDiff = body.amount - transaction.amount;

    // Update business totals based on the difference
    const updateQuery: Record<string, number> = {};
    if (transaction.type === 'investment') {
      updateQuery.totalInvestment = business.totalInvestment + amountDiff;
    } else if (transaction.type === 'expense') {
      updateQuery.totalExpenses = business.totalExpenses + amountDiff;
    } else if (transaction.type === 'sale') {
      updateQuery.totalSales = business.totalSales + amountDiff;
    }

    // Update transaction and business totals
    const updatedTransaction = await Transaction.findByIdAndUpdate(params.id, body, { new: true });
    await Business.updateOne(
      { _id: transaction.businessId },
      { $set: updateQuery }
    );

    return NextResponse.json(updatedTransaction);
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 