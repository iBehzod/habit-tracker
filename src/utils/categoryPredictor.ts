// Simple category predictor based on keywords

interface CategoryMapping {
    [key: string]: string[];
  }
  
  const categoryKeywords: CategoryMapping = {
    "health": ["exercise", "workout", "run", "jog", "walk", "gym", "weight", "yoga", "meditation", "sleep", "water", "hydration", "diet", "nutrition", "eating", "fast"],
    "productivity": ["work", "study", "read", "book", "learn", "focus", "pomodoro", "time", "deadline", "project", "task", "goal", "productivity"],
    "self-care": ["meditate", "journal", "gratitude", "reflect", "mindfulness", "relax", "bath", "skincare", "hobby", "music", "art", "creative"],
    "finance": ["save", "budget", "money", "invest", "expense", "spending", "finance", "bill", "debt", "income"],
    "social": ["call", "text", "friend", "family", "connect", "relationship", "network", "social", "communicate"],
    "bad habits": ["smoking", "alcohol", "drink", "procrastinate", "junk food", "sugar", "soda", "sweets", "caffeine", "binge", "social media", "phone", "screen", "tv", "late", "swearing"]
  };
  
  export function predictCategory(title: string): string {
    const lowercaseTitle = title.toLowerCase();
    
    // Check each category for matching keywords
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (lowercaseTitle.includes(keyword)) {
          return category;
        }
      }
    }
    
    // Default category if no match is found
    return "other";
  }