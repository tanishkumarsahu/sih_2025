import { NextRequest, NextResponse } from 'next/server';
import { UserProfile, InternshipRecommendation, RecommendationRequest, RecommendationResponse } from '@/types';
import { RecommendationRequestSchema } from '@/lib/validations';
import { calculateRecommendations } from '@/services/recommendations';


export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const body = await request.json();
    
    console.log('API received body:', JSON.stringify(body, null, 2));
    
    // Validate request body using Zod schema
    const validationResult = RecommendationRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.issues);
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      );
    }
    
    const { profile, filters, limit } = validationResult.data;
    
    // Generate recommendations using the service
    console.log('Generating recommendations for profile:', profile.name || 'Anonymous');
    const recommendations = await calculateRecommendations(profile);
    console.log('Generated recommendations count:', recommendations.length);
    const processingTime = Date.now() - startTime;
    
    const response: RecommendationResponse = {
      recommendations: recommendations.slice(0, limit || 5),
      metadata: {
        totalCount: recommendations.length,
        processingTime,
        algorithmVersion: '1.0.0',
        filters
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Internship Recommendation API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/recommendations - Generate personalized recommendations'
    }
  });
}
