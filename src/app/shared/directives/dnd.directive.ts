import { Directive, HostBinding, HostListener, output } from '@angular/core';

@Directive({
    selector: '[appDnd]',
})
export class DndDirective {
    fileDropped = output<File | undefined>();
    @HostBinding('class.file-over') fileOver = false;
    @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.fileOver = true;
    }

    @HostListener('dragleave', ['$event']) onDragOLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.fileOver = false;
    }

    @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.fileOver = false;

        this.fileDropped.emit(event.dataTransfer?.files[0]);
    }
}
