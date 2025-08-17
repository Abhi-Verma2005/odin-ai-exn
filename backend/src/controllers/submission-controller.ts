import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth';
import { 
  getCodeSubmissionByUserAndQuestion,
  saveCodeSubmission,
  updateCodeSubmission 
} from '@/services/queries';

const submitRequestSchema = z.object({
  slug: z.string(),
  code: z.string(),
  language: z.string(),
  timestamp: z.string(),
  problemTitle: z.string().optional(),
});

export const submitCode = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { slug, code, language, timestamp, problemTitle } = submitRequestSchema.parse(req.body);

    // Validate required fields
    if (!slug || !code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: slug, code, and language are required'
      });
    }

    // Validate code is not empty
    if (!code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Code cannot be empty'
      });
    }

    const externalUserId = req.user.id;

    // Check for existing submission
    const existingSubmission = await getCodeSubmissionByUserAndQuestion({
      externalUserId,
      questionSlug: slug,
    });

    let submission;
    let isUpdate = false;

    if (existingSubmission) {
      // Update existing submission
      submission = await updateCodeSubmission({
        externalUserId,
        questionSlug: slug,
        code: code.trim(),
        language,
        problemTitle,
      });
      isUpdate = true;
      console.log(`Code submission updated for user ${externalUserId}, problem ${slug}`);
    } else {
      // Create new submission
      submission = await saveCodeSubmission({
        externalUserId,
        questionSlug: slug,
        code: code.trim(),
        language,
        problemTitle,
      });
      console.log(`Code submission created for user ${externalUserId}, problem ${slug}`);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      externalUserId: externalUserId,
      message: isUpdate ? 'Code submission updated successfully' : 'Code submission saved successfully',
      submissionId: submission.id,
      isUpdate
    });

  } catch (error) {
    console.error('Submit endpoint error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
    }
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('UNIQUE constraint')) {
        return res.status(409).json({
          success: false,
          message: 'Submission already exists'
        });
      }
    }
    
    // Generic error response
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 