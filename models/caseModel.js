// server/models/caseModel.js
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

// Main case schema
const caseSchema = new mongoose.Schema(
    {
        caseNumber: {
            type: String,
            required: true,
            unique: true,
        },
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        contactName: {
            type: String,
            required: true,
        },
        businessName: {
            type: String,
            required: true,
        },
        coid: {
            type: String,
            required: true,
        },
        mid: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
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
    contactName: 'text',
    businessName: 'text',
    coid: 'text',
    mid: 'text',
    department: 'text',
});

const Case = mongoose.model('Case', caseSchema);
const CustomField = mongoose.model('CustomField', customFieldSchema);

export { Case, CustomField };
