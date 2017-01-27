import { Component } from '@angular/core';
import { PostsService } from '../services/posts.service';

@Component({
    selector: 'button-test',
    template: `<button (click)="onClick()">I am a button.</button>`,
    providers: [PostsService],
})
export class ButtonTestComponent {

    constructor(private postsService: PostsService) {

    }

    onClick() {
        this.postsService.getPosts().subscribe(posts => {
            console.log(posts);
        });
    }
}
