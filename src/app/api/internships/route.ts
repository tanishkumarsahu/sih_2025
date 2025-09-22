import { NextRequest, NextResponse } from 'next/server';
import { Internship } from '@/types';
import { InternshipSchema } from '@/lib/validations';
import { internshipService, USE_FIREBASE } from '@/services/firebase';

// Mock internship database
const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Software Development Intern',
    company: 'Tata Consultancy Services',
    description: 'Work on cutting-edge software projects and learn from industry experts.',
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
    isRemote: false
  },
  {
    id: '2',
    title: 'Digital Marketing Intern',
    company: 'Wipro Limited',
    description: 'Learn digital marketing strategies and work on real client campaigns.',
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
    isRemote: true
  },
  {
    id: '3',
    title: 'Finance Analyst Intern',
    company: 'HDFC Bank',
    description: 'Gain hands-on experience in financial analysis and banking operations.',
    location: 'Delhi, Delhi',
    state: 'Delhi',
    district: 'New Delhi',
    sector: 'Finance',
    stipend: 18000,
    duration: '6 months',
    requirements: ['Strong analytical skills', 'Excel proficiency', 'Attention to detail'],
    skills: ['Financial Analysis', 'Excel', 'Data Analysis', 'Risk Assessment'],
    educationLevel: 'Bachelor\'s in Commerce/Finance/Economics',
    applicationDeadline: '2024-12-15',
    isActive: true,
    isRemote: false
  },
  {
    id: '4',
    title: 'Mechanical Engineering Intern',
    company: 'Mahindra & Mahindra',
    description: 'Work on automotive projects and manufacturing processes.',
    location: 'Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    district: 'Chennai',
    sector: 'Manufacturing',
    stipend: 14000,
    duration: '5 months',
    requirements: ['Mechanical engineering background', 'CAD software knowledge', 'Problem-solving'],
    skills: ['AutoCAD', 'SolidWorks', 'Manufacturing', 'Quality Control'],
    educationLevel: 'Diploma/Bachelor\'s in Mechanical Engineering',
    applicationDeadline: '2024-11-25',
    isActive: true,
    isRemote: false
  },
  {
    id: '5',
    title: 'Content Writing Intern',
    company: 'Infosys Limited',
    description: 'Create engaging content for various digital platforms and marketing materials.',
    location: 'Pune, Maharashtra',
    state: 'Maharashtra',
    district: 'Pune',
    sector: 'Content',
    stipend: 10000,
    duration: '3 months',
    requirements: ['Excellent writing skills', 'Creativity', 'Research abilities'],
    skills: ['Content Writing', 'Copywriting', 'SEO Writing', 'Social Media'],
    educationLevel: 'Bachelor\'s in English/Journalism/Mass Communication',
    applicationDeadline: '2024-12-10',
    isActive: true,
    isRemote: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const state = searchParams.get('state');
    const isRemote = searchParams.get('remote');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let internships: Internship[];

    // Use Firebase if enabled, otherwise use mock data
    if (USE_FIREBASE) {
      try {
        if (sector) {
          internships = await internshipService.getInternshipsBySector(sector);
        } else if (state) {
          internships = await internshipService.getInternshipsByLocation(state);
        } else {
          internships = await internshipService.getAllInternships();
        }
      } catch (firebaseError) {
        console.warn('Firebase fetch failed, using mock data:', firebaseError);
        internships = mockInternships.filter(internship => internship.isActive);
      }
    } else {
      internships = mockInternships.filter(internship => internship.isActive);
    }

    // Apply additional filters for mock data
    if (!USE_FIREBASE) {
      if (sector) {
        internships = internships.filter(
          internship => internship.sector.toLowerCase().includes(sector.toLowerCase())
        );
      }

      if (state) {
        internships = internships.filter(
          internship => internship.state.toLowerCase().includes(state.toLowerCase())
        );
      }

      if (isRemote === 'true') {
        internships = internships.filter(internship => internship.isRemote);
      }
    }

    // Pagination
    const paginatedInternships = internships.slice(offset, offset + limit);

    return NextResponse.json({
      internships: paginatedInternships,
      metadata: {
        total: internships.length,
        limit,
        offset,
        hasMore: offset + limit < internships.length
      }
    });

  } catch (error) {
    console.error('Error fetching internships:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body using Zod schema
    const validationResult = InternshipSchema.safeParse({
      id: Date.now().toString(),
      ...body,
      isActive: true
    });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid internship data',
          details: validationResult.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      );
    }

    const newInternship = validationResult.data;

    // Use Firebase if enabled, otherwise use mock data
    if (USE_FIREBASE) {
      try {
        const internshipId = await internshipService.createInternship(newInternship);
        return NextResponse.json({ ...newInternship, id: internshipId }, { status: 201 });
      } catch (firebaseError) {
        console.warn('Firebase create failed, using mock data:', firebaseError);
        mockInternships.push(newInternship);
        return NextResponse.json(newInternship, { status: 201 });
      }
    } else {
      mockInternships.push(newInternship);
      return NextResponse.json(newInternship, { status: 201 });
    }

  } catch (error) {
    console.error('Error creating internship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
