import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-comments-content',
    templateUrl: './comments-content.component.html'
})

export class CommentsContentComponent{

    @Input() comments;
    @Output() moreComments = new EventEmitter<any>();

    loadComments(event){
        this.moreComments.emit();
        event.target.complete();
    }

}