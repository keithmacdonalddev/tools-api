// models/caseModel.js

import mongoose from 'mongoose';

// Schema for custom fields
const customFieldSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'textarea'],
        default: 'text',
    },
    required: {
        type: Boolean,
        default: false,
    },
});

// Main case schema - Simplified for your specific needs
const caseSchema = new mongoose.Schema(
    {
        caseNumber: {
            type: String,
            required: [true, 'Case number is required'],
            unique: true,
            trim: true, // Removes whitespace from both ends
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            enum: {
                values: ['Payments', 'Payroll', 'QBO'],
                message: '{VALUE} is not a valid department',
            },
        },
        status: {
            type: String,
            required: true,
            enum: ['open', 'closed'],
            default: 'open',
        },
        // For storing custom field values
        customFields: {
            type: Map,
            of: String,
            default: {},
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Add text indexes for search functionality
caseSchema.index({
    caseNumber: 'text',
    subject: 'text',
    description: 'text',
    department: 'text',
});

const Case = mongoose.model('Case', caseSchema);
const CustomField = mongoose.model('CustomField', customFieldSchema);

export { Case, CustomField };
