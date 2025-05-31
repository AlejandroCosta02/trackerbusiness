import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  industry: {
    type: String,
    default: '',
  },
  foundedDate: {
    type: Date,
    default: Date.now,
  },
  totalInvestment: {
    type: Number,
    default: 0,
  },
  totalExpenses: {
    type: Number,
    default: 0,
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Add compound index for userId and createdAt
businessSchema.index({ userId: 1, createdAt: -1 });

// Calculate net profit
businessSchema.virtual('netProfit').get(function() {
  return this.totalSales - this.totalExpenses;
});

// Calculate ROI (Return on Investment)
businessSchema.virtual('roi').get(function() {
  if (this.totalInvestment === 0) return 0;
  return ((this.totalSales - this.totalExpenses) / this.totalInvestment) * 100;
});

export const Business = mongoose.models.Business || mongoose.model('Business', businessSchema); 