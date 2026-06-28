import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    description: { 
      type: String, 
      required: true,
      trim: true
    },
    amount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    
    paidBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
        },
    
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true
    },
    
    splitAmong: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model('Expense', expenseSchema);