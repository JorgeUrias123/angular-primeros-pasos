import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  private debouncer: Subject<string> = new Subject<string>();
  private debounceSuscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onValue: EventEmitter<string> = new EventEmitter();

  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.debounceSuscription = this.debouncer
    .pipe(
      debounceTime(300),
    )
    .subscribe( value => {
      this.onDebounce.emit( value )
    });
  }

  ngOnDestroy(): void {
    this.debounceSuscription?.unsubscribe();
  }

  emitValue( value: string ): void{
    this.onValue.emit(value);
  }

  onKeyPress( searchTerm: string ){
    this.debouncer.next( searchTerm );
  }
}
