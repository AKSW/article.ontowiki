class BBEditor_Main {
    
    /**
     * 
     */
    static initializeBBEditor (textareaId:string, toolbarId:string, imagePath:string, entries:Object[]) {        
        var bbe = new BBEditor (textareaId, toolbarId, imagePath);
        
        // output toolbar 
        bbe.outputToolbar ( entries );
    }
}
