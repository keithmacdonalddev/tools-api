// controllers/caseController.js

import { Case, CustomField } from '../models/caseModel.js';
import AppError from '../utils/appError.js';

// Get all cases with filtering and pagination
export const getCases = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query based on filters
        const query = {};
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Add any additional filters
        ['businessName', 'department', 'coid', 'mid'].forEach((field) => {
            if (req.query[field]) {
                query[field] = req.query[field];
            }
        });

        const cases = await Case.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Case.countDocuments(query);

        res.status(200).json({
            status: 'success',
            data: {
                cases,
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(new AppError('Error fetching cases', 500));
    }
};

// Get single case by ID
export const getCase = async (req, res, next) => {
    try {
        const caseItem = await Case.findById(req.params.id);

        if (!caseItem) {
            return next(new AppError('Case not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: caseItem,
        });
    } catch (error) {
        next(new AppError('Error fetching case', 500));
    }
};

// Create new case
export const createCase = async (req, res, next) => {
    try {
        // Log the incoming request body for debugging
        console.log('Creating new case with data:', req.body);

        // Validate required fields
        const requiredFields = [
            'caseNumber',
            'subject',
            'description',
            'department',
        ];
        const missingFields = requiredFields.filter(
            (field) => !req.body[field]
        );

        if (missingFields.length > 0) {
            return next(
                new AppError(
                    `Missing required fields: ${missingFields.join(', ')}`,
                    400
                )
            );
        }

        const newCase = await Case.create(req.body);

        // Log successful creation
        console.log('Case created successfully:', newCase);

        res.status(201).json({
            status: 'success',
            data: newCase,
        });
    } catch (error) {
        console.error('Error creating case:', error);

        if (error.code === 11000) {
            // Duplicate case number error
            return next(new AppError('Case number already exists', 400));
        }

        if (error.name === 'ValidationError') {
            // Mongoose validation error
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return next(
                new AppError(`Validation error: ${messages.join('. ')}`, 400)
            );
        }

        next(new AppError('Error creating case', 500));
    }
};

// Update case
export const updateCase = async (req, res, next) => {
    try {
        const updatedCase = await Case.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCase) {
            return next(new AppError('Case not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: updatedCase,
        });
    } catch (error) {
        next(new AppError('Error updating case', 500));
    }
};

// Delete case
export const deleteCase = async (req, res, next) => {
    try {
        const caseItem = await Case.findByIdAndDelete(req.params.id);

        if (!caseItem) {
            return next(new AppError('Case not found', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(new AppError('Error deleting case', 500));
    }
};

// Custom Fields Controllers
export const getCustomFields = async (req, res, next) => {
    try {
        const customFields = await CustomField.find();

        res.status(200).json({
            status: 'success',
            data: customFields,
        });
    } catch (error) {
        next(new AppError('Error fetching custom fields', 500));
    }
};

export const addCustomField = async (req, res, next) => {
    try {
        const newField = await CustomField.create(req.body);

        res.status(201).json({
            status: 'success',
            data: newField,
        });
    } catch (error) {
        next(new AppError('Error creating custom field', 500));
    }
};

export const deleteCustomField = async (req, res, next) => {
    try {
        const field = await CustomField.findByIdAndDelete(req.params.id);

        if (!field) {
            return next(new AppError('Custom field not found', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(new AppError('Error deleting custom field', 500));
    }
};
