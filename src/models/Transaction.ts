import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['investment', 'expense', 'sale'],
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
  category: {
    type: String,
    default: 'other',
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

transactionSchema.index({ businessId: 1, date: -1 });
transactionSchema.index({ businessId: 1, type: 1 });
transactionSchema.index({ businessId: 1, category: 1 });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema); 