import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Recipe {
  label: string;
  image: string;
  calories: number;
  url: string;
  calorieLevel?: string; // Optional property for calorie level
}

interface RecipeResponse {
  hits: { recipe: Recipe }[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  appId = '3c5ed2a3';  // Your Application ID
  appKey = 'e83f46336c0c4eddbc00591501f925d2';  // Your API Key
  query: string = '';
  recipes: Recipe[] = [];

  constructor(private http: HttpClient) {}

  searchRecipes(): void {
    const apiUrl = `https://api.edamam.com/search?q=${this.query}&app_id=${this.appId}&app_key=${this.appKey}`;
    this.http.get<RecipeResponse>(apiUrl).subscribe(
      (data) => {
        this.recipes = data.hits.map(hit => {
          const recipe = hit.recipe;
          recipe.calorieLevel = this.getCalorieLevel(recipe.calories); // Set calorie level
          return recipe;
        });
      },
      (error) => {
        console.error('Error fetching recipes:', error);
        alert("Please check your internet connection.");
      }
    );
  }

  private getCalorieLevel(calories: number): string {
    if (calories < 500) {
      return 'Low';
    } else if (calories >= 500 && calories <= 800) {
      return 'Medium';
    } else if (calories > 800 && calories <= 1000) {
      return 'High';
    } else {
      return 'Very High';
    }
  }

  getCalorieClass(calorieLevel: string | undefined): string {
    if (!calorieLevel) {
      return ''; // Return an empty string if calorieLevel is undefined
    }

    switch (calorieLevel) {
      case 'Low':
        return 'low-calorie';
      case 'Medium':
        return 'medium-calorie';
      case 'High':
        return 'high-calorie';
      case 'Very High':
        return 'very-high-calorie';
      default:
        return '';
    }
  }
}
