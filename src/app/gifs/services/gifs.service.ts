import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  constructor( private http: HttpClient ) { 
    this.loadLocalStorage();
  }
  
  public giftList: Gif[] = [];
  private _tagHistory: string[] = [];
  private apiKey: string = 'vJAhzj4YcctThbZza0JCNVSJjQ6JlWUY';
  private serviceURL: string = 'http://api.giphy.com/v1/gifs';

  get tagHistory (){
    return [...this._tagHistory];
  }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase();

    this._tagHistory = this._tagHistory.filter( (oldtag) => oldtag !== tag );
    this._tagHistory.unshift(tag);
    this._tagHistory = this.tagHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void{
    return localStorage.setItem('history', JSON.stringify( this._tagHistory ));
  }

  private loadLocalStorage(): void{
    if ( !localStorage.getItem('history') ) return;

    this._tagHistory = JSON.parse( localStorage.getItem('history')! );

    if (this._tagHistory.length === 0) return;

    this.searchTag( this._tagHistory[0] );
  }

  searchTag (tag: string): void{
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', 10)

    this.http.get<SearchResponse>(`${this.serviceURL}/search?${ params }`).subscribe(
      resp => {
        this.giftList = resp.data;
      }
    );
  }
}