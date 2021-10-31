import { Component, OnDestroy, Output, EventEmitter, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-tutorial',
    templateUrl: './tutorial.component.html',
    styleUrls: ['./tutorial.component.css'],
})
export class TutorialComponent implements OnInit, OnDestroy {

    @Output()
    public tutorialDoneClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    public tutorialViewed: boolean;

    public page: number;
    public totalPages: number;

    constructor() { }

    ngOnInit() {
        this.page = 0;
        this.totalPages = 10;
    }

    ngOnDestroy() {
        this.page = undefined;
        this.tutorialDoneClicked = undefined;
    }

    goPrevious() {
        if(this.page > 0) {
            this.page--;
        }
    }

    goNext() {
        if(this.page < this.totalPages) {
            this.page++;
        } else {
            this.page = 0;
            localStorage.setItem('tutorialViewed', 'true');
            this.tutorialDoneClicked.emit(true);
        }
    }

    skipTutorial() {
        this.page = 0;
        this.tutorialDoneClicked.emit(true);
    }
}
