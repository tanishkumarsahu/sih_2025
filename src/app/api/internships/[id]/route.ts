import { NextRequest, NextResponse } from 'next/server';
import { Internship } from '@/types';
import { InternshipSchema } from '@/lib/validations';
import { internshipService, USE_FIREBASE } from '@/services/firebase';

// Mock detailed internship data
const mockInternshipDetails: Record<string, Internship> = {
  '1': {
    id: '1',
    title: 'Software Development Intern',
    company: 'Tata Consultancy Services',
    description: 'Work on cutting-edge software projects and learn from industry experts.',
    detailedDescription: 'Join our dynamic software development team and contribute to real-world projects that impact millions of users. You will work alongside experienced developers, participate in code reviews, and learn industry best practices in software development.',
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    district: 'Mumbai',
    sector: 'Technology',
    stipend: 15000,
    duration: '6 months',
    requirements: ['Basic programming knowledge', 'Problem-solving skills', 'Team collaboration'],
    skills: ['JavaScript', 'Python', 'React', 'Node.js'],
    educationLevel: 'Bachelor\'s in Computer Science/IT',
    applicationDeadline: '2024-12-31',
    isActive: true,
    isRemote: false,
    benefits: ['Mentorship program', 'Skill development workshops', 'Certificate of completion', 'Potential full-time offer'],
    applicationProcess: 'Submit resume and cover letter, followed by technical assessment and interview.'
  },
  '2': {
    id: '2',
    title: 'Digital Marketing Intern',
    company: 'Wipro Limited',
    description: 'Learn digital marketing strategies and work on real client campaigns.',
    detailedDescription: 'Dive into the world of digital marketing with hands-on experience in campaign management, social media marketing, and analytics. Work with real clients and see the impact of your marketing strategies.',
    location: 'Bangalore, Karnataka',
    state: 'Karnataka',
    district: 'Bangalore',
    sector: 'Marketing',
    stipend: 12000,
    duration: '4 months',
    requirements: ['Basic marketing knowledge', 'Creative thinking', 'Communication skills'],
    skills: ['Social Media Marketing', 'Content Creation', 'Analytics', 'SEO'],
    educationLevel: 'Bachelor\'s in Marketing/Business/Commerce',
    applicationDeadline: '2024-11-30',
    isActive: true,
    isRemote: true,
    benefits: ['Remote work flexibility', 'Marketing tools access', 'Industry certifications', 'Networking opportunities'],
    applicationProcess: 'Online application with portfolio submission, followed by virtual interview.'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    let internship: Internship | null = null;

    // Use Firebase if enabled, otherwise use mock data
    if (USE_FIREBASE) {
      try {
        internship = await internshipService.getInternshipById(id);
      } catch (firebaseError) {
        console.warn('Firebase fetch failed, using mock data:', firebaseError);
        internship = mockInternshipDetails[id] || null;
      }
    } else {
      internship = mockInternshipDetails[id] || null;
    }
    
    if (!internship) {
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(internship);
    
  } catch (error) {
    console.error('Error fetching internship details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate request body using Zod schema
    const validationResult = InternshipSchema.partial().safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid internship data',
          details: validationResult.error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Use Firebase if enabled, otherwise use mock data
    if (USE_FIREBASE) {
      try {
        await internshipService.updateInternship(id, updates);
        const updatedInternship = await internshipService.getInternshipById(id);
        return NextResponse.json(updatedInternship);
      } catch (firebaseError) {
        console.warn('Firebase update failed, using mock data:', firebaseError);
        if (!mockInternshipDetails[id]) {
          return NextResponse.json(
            { error: 'Internship not found' },
            { status: 404 }
          );
        }
        mockInternshipDetails[id] = {
          ...mockInternshipDetails[id],
          ...updates,
          id // Ensure ID doesn't change
        };
        return NextResponse.json(mockInternshipDetails[id]);
      }
    } else {
      if (!mockInternshipDetails[id]) {
        return NextResponse.json(
          { error: 'Internship not found' },
          { status: 404 }
        );
      }
      
      mockInternshipDetails[id] = {
        ...mockInternshipDetails[id],
        ...updates,
        id // Ensure ID doesn't change
      };
      
      return NextResponse.json(mockInternshipDetails[id]);
    }
    
  } catch (error) {
    console.error('Error updating internship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!mockInternshipDetails[id]) {
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      );
    }
    
    // Soft delete by setting isActive to false
    mockInternshipDetails[id].isActive = false;
    
    return NextResponse.json({ message: 'Internship deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting internship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
