import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  myForm = new FormGroup({

    name: new FormControl('', [Validators.required, Validators.minLength(3)]),

    file: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])

  });

    

  constructor(private http: HttpClient) { }

      

  get f(){

    return this.myForm.controls;

  }

     

  onFileChange(event) {

  

    if (event.target.files.length > 0) {

      const file = event.target.files[0];

      this.myForm.patchValue({

        fileSource: file

      });

    }

  }

     

  submit(){
  
    // const headers = new HttpHeaders({
    //   'x-api-key': 'MMFp16pjPD4krlniBHOAh8JWlWRl607P7xnOszlY',
    // });
    const headers = new HttpHeaders({
      'x-api-key': environment.photoUploadAPIkey
    });
    const formData = new FormData();

    formData.append('file', this.myForm.get('fileSource').value);
    let url = 'https://5kd2dru7v8.execute-api.us-east-1.amazonaws.com/s3api/nwebhook-apigateway/t/Dockewfd.json';
    let url2 = `${environment.photoUpload}/nwebhook-apigateway/t/Dockewfd.json`;
   this.http.put(url2, formData, { headers})
   .subscribe(
     response => {
       console.log(response);
     },
     error => {
       console.error(error);
     }
   );

  }

}
