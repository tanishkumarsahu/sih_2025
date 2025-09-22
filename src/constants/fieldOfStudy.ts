// Field of Study Categories for Mobile-Friendly Selection
// Designed for first-generation learners with limited digital exposure

export interface FieldCategory {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  icon: string;
  color: string;
  fields: {
    en: string[];
    hi: string[];
  };
  description: {
    en: string;
    hi: string;
  };
}

// Mobile-optimized field categories (6 main categories)
export const FIELD_CATEGORIES: FieldCategory[] = [
  {
    id: 'technology',
    name: {
      en: 'Technology & IT',
      hi: 'तकनीक और आईटी'
    },
    icon: '💻',
    color: '#3B82F6', // Blue
    description: {
      en: 'Computer, Software, and IT related fields',
      hi: 'कंप्यूटर, सॉफ्टवेयर और आईटी संबंधी क्षेत्र'
    },
    fields: {
      en: [
        'Computer Science',
        'Information Technology',
        'Software Engineering',
        'Electronics',
        'Computer Applications',
        'Data Science'
      ],
      hi: [
        'कंप्यूटर साइंस',
        'सूचना प्रौद्योगिकी',
        'सॉफ्टवेयर इंजीनियरिंग',
        'इलेक्ट्रॉनिक्स',
        'कंप्यूटर एप्लीकेशन',
        'डेटा साइंस'
      ]
    }
  },
  {
    id: 'business',
    name: {
      en: 'Business & Commerce',
      hi: 'व्यापार और वाणिज्य'
    },
    icon: '💼',
    color: '#10B981', // Green
    description: {
      en: 'Business, Management, and Commerce fields',
      hi: 'व्यापार, प्रबंधन और वाणिज्य क्षेत्र'
    },
    fields: {
      en: [
        'Commerce',
        'Business Administration',
        'Management',
        'Marketing',
        'Finance',
        'Economics',
        'Accounting'
      ],
      hi: [
        'वाणिज्य',
        'व्यापार प्रशासन',
        'प्रबंधन',
        'विपणन',
        'वित्त',
        'अर्थशास्त्र',
        'लेखांकन'
      ]
    }
  },
  {
    id: 'engineering',
    name: {
      en: 'Engineering',
      hi: 'इंजीनियरिंग'
    },
    icon: '🏗️',
    color: '#F59E0B', // Orange
    description: {
      en: 'All engineering branches and technical fields',
      hi: 'सभी इंजीनियरिंग शाखाएं और तकनीकी क्षेत्र'
    },
    fields: {
      en: [
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Chemical Engineering',
        'Aerospace Engineering',
        'Biomedical Engineering'
      ],
      hi: [
        'मैकेनिकल इंजीनियरिंग',
        'सिविल इंजीनियरिंग',
        'इलेक्ट्रिकल इंजीनियरिंग',
        'केमिकल इंजीनियरिंग',
        'एयरोस्पेस इंजीनियरिंग',
        'बायोमेडिकल इंजीनियरिंग'
      ]
    }
  },
  {
    id: 'science',
    name: {
      en: 'Science & Research',
      hi: 'विज्ञान और अनुसंधान'
    },
    icon: '🔬',
    color: '#8B5CF6', // Purple
    description: {
      en: 'Pure sciences and research fields',
      hi: 'शुद्ध विज्ञान और अनुसंधान क्षेत्र'
    },
    fields: {
      en: [
        'Physics',
        'Chemistry',
        'Biology',
        'Mathematics',
        'Environmental Science',
        'Biotechnology'
      ],
      hi: [
        'भौतिक विज्ञान',
        'रसायन विज्ञान',
        'जीव विज्ञान',
        'गणित',
        'पर्यावरण विज्ञान',
        'जैव प्रौद्योगिकी'
      ]
    }
  },
  {
    id: 'creative',
    name: {
      en: 'Arts & Creative',
      hi: 'कला और रचनात्मक'
    },
    icon: '🎨',
    color: '#EF4444', // Red
    description: {
      en: 'Arts, Design, and Creative fields',
      hi: 'कला, डिजाइन और रचनात्मक क्षेत्र'
    },
    fields: {
      en: [
        'Arts',
        'Design',
        'Mass Communication',
        'Journalism',
        'English Literature',
        'Fine Arts',
        'Fashion Design'
      ],
      hi: [
        'कला',
        'डिजाइन',
        'जनसंचार',
        'पत्रकारिता',
        'अंग्रेजी साहित्य',
        'ललित कला',
        'फैशन डिजाइन'
      ]
    }
  },
  {
    id: 'others',
    name: {
      en: 'Other Fields',
      hi: 'अन्य क्षेत्र'
    },
    icon: '📚',
    color: '#6B7280', // Gray
    description: {
      en: 'Medical, Law, and other specialized fields',
      hi: 'चिकित्सा, कानून और अन्य विशेष क्षेत्र'
    },
    fields: {
      en: [
        'Medicine',
        'Law',
        'Nursing',
        'Pharmacy',
        'Architecture',
        'Psychology',
        'Sociology',
        'Political Science',
        'History',
        'Geography',
        'Philosophy',
        'Agriculture',
        'Hotel Management'
      ],
      hi: [
        'चिकित्सा',
        'कानून',
        'नर्सिंग',
        'फार्मेसी',
        'वास्तुकला',
        'मनोविज्ञान',
        'समाजशास्त्र',
        'राजनीति विज्ञान',
        'इतिहास',
        'भूगोल',
        'दर्शन',
        'कृषि',
        'होटल प्रबंधन'
      ]
    }
  }
];

// Helper function to get all fields in a flat array
export const getAllFields = (language: 'en' | 'hi' = 'en'): string[] => {
  return FIELD_CATEGORIES.flatMap(category => category.fields[language]);
};

// Helper function to find category by field
export const findCategoryByField = (fieldName: string, language: 'en' | 'hi' = 'en'): FieldCategory | undefined => {
  return FIELD_CATEGORIES.find(category => 
    category.fields[language].includes(fieldName)
  );
};

// Helper function to get category by id
export const getCategoryById = (id: string): FieldCategory | undefined => {
  return FIELD_CATEGORIES.find(category => category.id === id);
};

// Custom field option for "Others" category
export const CUSTOM_FIELD_OPTION = {
  en: 'Enter your field of study',
  hi: 'अपना अध्ययन क्षेत्र दर्ज करें'
};

// Popular fields for quick access (based on Indian education statistics)
export const POPULAR_FIELDS = {
  en: ['Computer Science', 'Commerce', 'Engineering', 'Arts', 'Science'],
  hi: ['कंप्यूटर साइंस', 'वाणिज्य', 'इंजीनियरिंग', 'कला', 'विज्ञान']
};
