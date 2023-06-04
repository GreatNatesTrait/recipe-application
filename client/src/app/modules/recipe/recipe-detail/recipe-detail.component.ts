import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RecipeModel } from '@app/shared/models/recipe.model';
import { SafePipe } from '@app/shared/pipe/safepipe.pipe';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit{
  Object = Object;
  activeRecipe: RecipeModel;
  id: string | null = null;
  youtubeUrl: SafeResourceUrl;
  embedUrl: string;

  constructor(private route: ActivatedRoute,private safepipe:SafePipe) { }
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('name');
    this.activeRecipe = history.state.data.recipeData[0];
    let videoId = this.extractYouTubeVideoId(this.activeRecipe.strYoutube);
    let videoUrl = "https://www.youtube.com/embed/"+videoId;
    this.youtubeUrl = this.safepipe.transform(videoUrl);
  }


  extractYouTubeVideoId(url) {
    // Regular expression pattern to match the video ID
    var pattern = /(?:\?v=|\/embed\/|\/\d{2}\/|\/\d{1}\/|\/v\/|https?:\/\/(?:www\.)?youtu\.be\/|https?:\/\/(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=|embed\/|watch\?v%3D|embed%25%3D))([\w-]{11})/;
  
    // Extract the video ID using the pattern and return it
    var match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    } else {
      // Return null if no match is found
      return null;
    }
  }
  

  

}
