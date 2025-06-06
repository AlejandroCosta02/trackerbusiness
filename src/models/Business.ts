import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    minlength: [2, 'Business name must be at least 2 characters long'],
    maxlength: [100, 'Business name cannot exceed 100 characters'],
  },
  logo: {
    type: String,
    default: '',
    validate: {
      validator: function(v: string) {
        return v === '' || v.startsWith('data:image/');
      },
      message: 'Logo must be a valid base64 image string'
    }
  },
  description: {
    type: String,
    default: '',
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  industry: {
    type: String,
    default: '',
    maxlength: [100, 'Industry cannot exceed 100 characters'],
  },
  foundedDate: {
    type: Date,
    default: Date.now,
  },
  totalInvestment: {
    type: Number,
    default: 0,
    min: [0, 'Total investment cannot be negative'],
  },
  totalExpenses: {
    type: Number,
    default: 0,
    min: [0, 'Total expenses cannot be negative'],
  },
  totalSales: {
    type: Number,
    default: 0,
    min: [0, 'Total sales cannot be negative'],
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
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
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

// Pre-save middleware to ensure data consistency
businessSchema.pre('save', function(next) {
  // Ensure numeric fields are not negative
  if (this.totalInvestment < 0) this.totalInvestment = 0;
  if (this.totalExpenses < 0) this.totalExpenses = 0;
  if (this.totalSales < 0) this.totalSales = 0;
  next();
});

export const Business = mongoose.models.Business || mongoose.model('Business', businessSchema); 