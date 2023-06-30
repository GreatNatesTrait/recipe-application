import { ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from './pipe/safepipe.pipe';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent {
  @Input() videoUrl: string;
  safeVideoUrl: SafeResourceUrl;
  loading: boolean;
  
  constructor(private safepipe:SafePipe) {}

  ngOnInit(): void {
    this.loading = true; 
     let videoId = this.extractYouTubeVideoId(this.videoUrl);
     let embedVideoUrl = "https://www.youtube.com/embed/"+videoId;
     this.safeVideoUrl = this.safepipe.transform(embedVideoUrl);
   }

  extractYouTubeVideoId(url:string) {
    var pattern = /(?:\?v=|\/embed\/|\/\d{2}\/|\/\d{1}\/|\/v\/|https?:\/\/(?:www\.)?youtu\.be\/|https?:\/\/(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=|embed\/|watch\?v%3D|embed%25%3D))([\w-]{11})/;
  
    var match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }
}
